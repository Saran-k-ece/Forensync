import { useEffect, useState } from 'react';

const StatsCard = ({ title, value, icon: Icon, color, subtitle, previousValue }) => {
  const colorClasses = {
    blue: 'from-blue-400 to-blue-600 text-white',
    green: 'from-green-400 to-green-600 text-white',
    yellow: 'from-yellow-400 to-yellow-500 text-white',
    purple: 'from-purple-400 to-purple-600 text-white',
  };

  const [changeIndicator, setChangeIndicator] = useState('');

  useEffect(() => {
    if (previousValue !== undefined) {
      if (value > previousValue) setChangeIndicator('▲'); // up
      else if (value < previousValue) setChangeIndicator('▼'); // down
      else setChangeIndicator(''); // no change
    }
  }, [value, previousValue]);

  return (
    <div className="card bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {changeIndicator && (
              <span
                className={`text-sm font-bold ${
                  changeIndicator === '▲' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {changeIndicator}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div
          className={`w-14 h-14 rounded-lg flex items-center justify-center bg-gradient-to-br ${colorClasses[color]} shadow-lg`}
        >
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
