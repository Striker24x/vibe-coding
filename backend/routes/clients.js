import express from 'express';
import { getDB } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const supabase = getDB();
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(clients || []);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

router.post('/', async (req, res) => {
  try {
    const supabase = getDB();
    const client = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const supabase = getDB();
    const { id } = req.params;
    const updates = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const supabase = getDB();
    const { id } = req.params;

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

router.get('/:id/services', async (req, res) => {
  try {
    const supabase = getDB();
    const { id } = req.params;
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .eq('client_id', id);

    if (error) throw error;
    res.json(services || []);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.get('/:id/metrics', async (req, res) => {
  try {
    const supabase = getDB();
    const { id } = req.params;
    const { data: metrics, error } = await supabase
      .from('system_metrics')
      .select('*')
      .eq('client_id', id)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json(metrics || []);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

export default router;
