import React from "react";
import { Zap, TrendingUp, TrendingDown } from "lucide-react";

const TempoMeter = ({ current, max, runner }) => {
  const percentage = (current / max) * 100;

  const getTempoColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-700">Tempo</span>
        <span className="text-xs text-gray-600">
          {current}/{max}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${getTempoColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const RaceRunnerDisplay = ({ runner, showDetailed = false }) => {
  const currentTempo = runner.currentTempo || 10;
  const maxTempo = runner.maxTempo || 10 + Math.floor(runner.stats.speed / 100);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-lg text-gray-900">{runner.name}</h4>
          <div className="text-sm text-gray-600">
            Position: {runner.position || 0}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Zap size={14} className="text-blue-500" />
          <span>{runner.stats.mana}</span>
        </div>
      </div>

      <TempoMeter current={currentTempo} max={maxTempo} runner={runner} />

      {showDetailed && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-600">Speed:</span>
              <span className="font-medium ml-1">{runner.stats.speed}</span>
            </div>
            <div>
              <span className="text-gray-600">Power:</span>
              <span className="font-medium ml-1">{runner.stats.power}</span>
            </div>
            <div>
              <span className="text-gray-600">Stamina:</span>
              <span className="font-medium ml-1">{runner.stats.stamina}</span>
            </div>
            <div>
              <span className="text-gray-600">Guts:</span>
              <span className="font-medium ml-1">{runner.stats.guts}</span>
            </div>
          </div>

          {runner.raceLog && runner.raceLog.length > 0 && (
            <div className="mt-3 pt-2 border-t">
              <div className="text-xs font-medium text-gray-700 mb-1">
                Recent Actions:
              </div>
              <div className="max-h-20 overflow-y-auto space-y-1">
                {runner.raceLog.slice(-3).map((log, index) => (
                  <div
                    key={index}
                    className="text-xs text-gray-600 flex items-center gap-1"
                  >
                    {log.tempoChange > 0 && (
                      <TrendingUp size={10} className="text-green-500" />
                    )}
                    {log.tempoChange < 0 && (
                      <TrendingDown size={10} className="text-red-500" />
                    )}
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RaceRunnerDisplay;
