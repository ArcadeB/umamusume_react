import React from "react";

const RaceCalculations = ({ selectedRunners, obstacles }) => {
  // Calculate win probabilities based on stats and obstacles
  const calculateWinProbabilities = () => {
    if (selectedRunners.length === 0) return [];

    return selectedRunners
      .map((runner) => {
        let baseScore =
          (runner.stats.speed + runner.stats.stamina + runner.stats.power) / 3;

        // Apply obstacle penalties
        obstacles.forEach((obstacle) => {
          if (obstacle.type === "weather") baseScore *= 0.9;
          if (obstacle.type === "terrain") baseScore *= 0.85;
          if (obstacle.type === "mental") baseScore *= 0.95;
        });

        return {
          runner,
          probability: baseScore,
        };
      })
      .sort((a, b) => b.probability - a.probability);
  };

  const winProbabilities = calculateWinProbabilities();

  if (winProbabilities.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="font-semibold mb-3">Win Probabilities</h3>
      <div className="space-y-2">
        {winProbabilities.map((item, index) => {
          const totalScore = winProbabilities.reduce(
            (sum, p) => sum + p.probability,
            0,
          );
          const percentage = ((item.probability / totalScore) * 100).toFixed(1);

          return (
            <div key={item.runner.id} className="flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{item.runner.name}</span>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RaceCalculations;
