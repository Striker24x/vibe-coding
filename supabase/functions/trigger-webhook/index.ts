import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { serviceId, webhookUrl } = await req.json();

    if (!serviceId || !webhookUrl) {
      return new Response(
        JSON.stringify({ error: "serviceId and webhookUrl are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: service } = await supabase
      .from("services")
      .select("*")
      .eq("id", serviceId)
      .single();

    if (!service) {
      return new Response(
        JSON.stringify({ error: "Service not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    await supabase.from("service_logs").insert({
      id: `log-${Date.now()}-start`,
      service_id: serviceId,
      level: "INFO",
      message: `Server-side webhook trigger started for ${service.display_name} to ${webhookUrl}`,
      timestamp: new Date().toISOString(),
    });

    const maxRetries = 3;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await supabase.from("service_logs").insert({
          id: `log-${Date.now()}-attempt-${attempt}`,
          service_id: serviceId,
          level: "INFO",
          message: `Webhook GET request attempt ${attempt}/${maxRetries} to ${webhookUrl}`,
          timestamp: new Date().toISOString(),
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const webhookResponse = await fetch(webhookUrl, {
          method: "GET",
          headers: {
            "User-Agent": "Supabase-Edge-Function/1.0",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseText = await webhookResponse.text();

        await supabase.from("service_logs").insert({
          id: `log-${Date.now()}-response-${attempt}`,
          service_id: serviceId,
          level: "INFO",
          message: `Webhook response (attempt ${attempt}): Status ${webhookResponse.status} - ${responseText.substring(0, 200)}`,
          timestamp: new Date().toISOString(),
        });

        if (webhookResponse.ok) {
          await supabase.from("service_logs").insert({
            id: `log-${Date.now()}-success`,
            service_id: serviceId,
            level: "INFO",
            message: `Webhook successfully executed on attempt ${attempt} - Print Spooler stop command sent`,
            timestamp: new Date().toISOString(),
          });

          return new Response(
            JSON.stringify({
              success: true,
              message: "Webhook executed successfully",
              attempt,
              status: webhookResponse.status,
              response: responseText,
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        } else {
          throw new Error(`HTTP ${webhookResponse.status}: ${responseText}`);
        }
      } catch (error) {
        lastError = error;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        await supabase.from("service_logs").insert({
          id: `log-${Date.now()}-error-${attempt}`,
          service_id: serviceId,
          level: "WARNING",
          message: `Webhook attempt ${attempt}/${maxRetries} failed: ${errorMessage}`,
          timestamp: new Date().toISOString(),
        });

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
        }
      }
    }

    const finalError = lastError instanceof Error ? lastError.message : "Unknown error";
    await supabase.from("service_logs").insert({
      id: `log-${Date.now()}-failed`,
      service_id: serviceId,
      level: "ERROR",
      message: `Webhook failed after ${maxRetries} attempts: ${finalError}`,
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: "Webhook failed after multiple attempts",
        details: finalError,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
