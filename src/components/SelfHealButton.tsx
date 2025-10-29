import { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';
import { Service } from '../types';

interface SelfHealButtonProps {
  services: Service[];
  onTrigger: (serviceData: Service) => Promise<void>;
  theme: 'dark' | 'light';
}

export function SelfHealButton({ services, onTrigger, theme }: SelfHealButtonProps) {
  const [isHealing, setIsHealing] = useState(false);

  const problematicServices = services.filter(
    (s) => s.error_count > 5 || s.cpu_usage > 80 || s.status !== 'Running'
  );

  const hasIssues = problematicServices.length > 0;

  const handleHeal = async () => {
    if (problematicServices.length === 0) return;

    setIsHealing(true);
    try {
      for (const service of problematicServices.slice(0, 3)) {
        await onTrigger(service);
      }
    } finally {
      setIsHealing(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleHeal}
        disabled={!hasIssues || isHealing}
        className={`relative px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
          hasIssues
            ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-lg shadow-red-500/50'
            : 'bg-gradient-to-r from-gray-600 to-gray-500'
        }`}
      >
        {hasIssues && !isHealing && (
          <span className="absolute inset-0 rounded-xl bg-white/30 animate-ping" />
        )}
        <span className="relative flex items-center gap-2">
          {isHealing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Healing in Progress...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              AI Self-Heal {hasIssues && `(${problematicServices.length})`}
            </>
          )}
        </span>
      </button>
      {hasIssues && (
        <div className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {problematicServices.length} service{problematicServices.length !== 1 ? 's' : ''} need
          attention
        </div>
      )}
    </div>
  );
}
