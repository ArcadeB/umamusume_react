import React from "react";

const RaceObstacleCard = ({ obstacle, onRemove }) => {
  const getSeverityColor = (severity) => {
    const dc = parseInt(severity.replace("DC ", ""));
    if (dc >= 15) return "bg-red-100 text-red-800";
    if (dc >= 12) return "bg-orange-100 text-orange-800";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900">{obstacle.name}</h4>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(obstacle.severity)}`}
        >
          {obstacle.severity}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{obstacle.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 capitalize">
          {obstacle.type}
        </span>
        {onRemove && (
          <button
            onClick={() => onRemove(obstacle.id)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default RaceObstacleCard;
