import React from "react";
import { Plus } from "lucide-react";
import RaceObstacleCard from "./RaceObstacleCard";

const RaceObstacles = ({ obstacles, onAddObstacle, onRemoveObstacle }) => {
  const handleAddObstacle = () => {
    const newObstacle = {
      id: Date.now(),
      name: "New Obstacle",
      description: "Configure this obstacle",
      severity: "DC 10",
      type: "custom",
    };
    onAddObstacle(newObstacle);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Race Obstacles
      </h2>

      <div className="space-y-4">
        {obstacles.map((obstacle) => (
          <RaceObstacleCard
            key={obstacle.id}
            obstacle={obstacle}
            onRemove={onRemoveObstacle}
          />
        ))}

        <button
          onClick={handleAddObstacle}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
        >
          <Plus size={20} />
          Add Obstacle
        </button>
      </div>
    </div>
  );
};

export default RaceObstacles;
