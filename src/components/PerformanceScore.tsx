import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Service } from '../types';

interface PerformanceScoreProps {
  services: Service[];
  theme: 'dark' | 'light';
}

export function PerformanceScore({ services, theme }: PerformanceScoreProps) {
  const [score, setScore] = useState(0);
  const [previousScore, setPreviousScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const calculateScore = () => {
      if (services.length === 0) return 0;

      const runningServices = services.filter(s => s.status === 'Running').length;
      const serviceRatio = (runningServices / services.length) * 30;

      const avgCpu = services.reduce((sum, s) => sum + s.cpu_usage, 0) / services.length;
      const cpuScore = Math.max(0, 30 - (avgCpu / 100) * 30);

      const avgErrors = services.reduce((sum, s) => sum + s.error_count, 0) / services.length;
      const errorScore = Math.max(0, 25 - (avgErrors / 20) * 25);

      const uptimeScore = services.filter(s => s.uptime > 3600).length / services.length * 15;

      return Math.round(serviceRatio + cpuScore + errorScore + uptimeScore);
    };

    const newScore = calculateScore();
    setPreviousScore(score);
    setScore(newScore);
  }, [services]);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepValue = (score - animatedScore) / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setAnimatedScore(prev => {
        const next = prev + stepValue;
        if (currentStep >= steps) {
          clearInterval(interval);
          return score;
        }
        return next;
      });
    }, duration / steps);

    return () => clearInterval(interval);
  }, [score]);

  const getScoreColor = () => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-blue-500 to-cyan-600';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-600';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getTrend = () => {
    if (score > previousScore) return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (score < previousScore) return <TrendingDown className="w-5 h-5 text-red-500" />;
    return <Minus className="w-5 h-5 text-gray-500" />;
  };

  const radius = 90;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div
      className={`rounded-xl p-6 shadow-lg border transition-all duration-500 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700 backdrop-blur-sm'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
      }`}
    >
      <div className="flex flex-col items-center">
        <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          System Performance Score
        </h3>

        <div className="relative mb-6">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444'} />
                <stop offset="100%" stopColor={score >= 80 ? '#059669' : score >= 60 ? '#2563eb' : score >= 40 ? '#d97706' : '#dc2626'} />
              </linearGradient>
            </defs>
            <circle
              stroke={theme === 'dark' ? '#1e293b' : '#e5e7eb'}
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke="url(#scoreGradient)"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference + ' ' + circumference}
              style={{
                strokeDashoffset,
                transition: 'stroke-dashoffset 2s ease',
              }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-5xl font-bold bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent`}>
              {Math.round(animatedScore)}
            </div>
            <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              out of 100
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className={`text-2xl font-bold bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent`}>
            {getScoreLabel()}
          </span>
          {getTrend()}
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Uptime
            </div>
            <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {services.filter(s => s.uptime > 3600).length}/{services.length}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Avg CPU
            </div>
            <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {services.length > 0 ? (services.reduce((sum, s) => sum + s.cpu_usage, 0) / services.length).toFixed(1) : 0}%
            </div>
          </div>
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Running
            </div>
            <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {services.filter(s => s.status === 'Running').length}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Errors
            </div>
            <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {services.reduce((sum, s) => sum + s.error_count, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
