import { useEffect, useState } from 'react';

interface GaugeChartProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  theme: 'dark' | 'light';
  icon?: React.ReactNode;
}

export function GaugeChart({ value, max, label, unit, theme, icon }: GaugeChartProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = (value / max) * 100;

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepValue = value / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setAnimatedValue(stepValue * currentStep);
      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedValue(value);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [value]);

  const getColor = () => {
    if (percentage >= 85) return '#ef4444';
    if (percentage >= 70) return '#f59e0b';
    if (percentage >= 50) return '#3b82f6';
    return '#10b981';
  };

  const getGradient = () => {
    if (percentage >= 85) return 'from-red-500 to-red-600';
    if (percentage >= 70) return 'from-orange-500 to-orange-600';
    if (percentage >= 50) return 'from-blue-500 to-blue-600';
    return 'from-green-500 to-green-600';
  };

  const color = getColor();
  const radius = 70;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={`rounded-xl p-6 shadow-lg border transition-all duration-500 hover:scale-105 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700 backdrop-blur-sm'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            <circle
              stroke={theme === 'dark' ? '#1e293b' : '#e5e7eb'}
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke={color}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference + ' ' + circumference}
              style={{
                strokeDashoffset,
                transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease',
              }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {icon && <div className="mb-1 opacity-60">{icon}</div>}
            <div className={`text-2xl font-bold bg-gradient-to-r ${getGradient()} bg-clip-text text-transparent`}>
              {animatedValue.toFixed(0)}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {unit}
            </div>
          </div>
        </div>
        <div className={`mt-4 text-sm font-medium text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </div>
        <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
          {percentage.toFixed(1)}% of {max}
        </div>
      </div>
    </div>
  );
}
