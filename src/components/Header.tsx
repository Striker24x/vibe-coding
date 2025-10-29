import { Sun, Moon, Activity } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  servicesRunning: number;
  totalServices: number;
}

export function Header({ theme, onToggleTheme, servicesRunning, totalServices }: HeaderProps) {
  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-lg border-b ${
        theme === 'dark'
          ? 'bg-slate-900/80 border-slate-800'
          : 'bg-white/80 border-gray-200'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Maintenance Dashboard
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Live Monitoring & Self-Healing
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`px-4 py-2 rounded-lg ${
                theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span
                  className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {servicesRunning}/{totalServices} Running
                </span>
              </div>
            </div>

            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
