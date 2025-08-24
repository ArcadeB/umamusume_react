import React, { useState } from "react";
import { Zap, ChevronDown, ChevronUp } from "lucide-react";

const RunnerCard = ({ runner, onSelect, selected, isCompact = false }) => {
  const [expanded, setExpanded] = useState(false);

  const getGradeColor = (grade) => {
    const colors = {
      G: "text-purple-600 bg-purple-100",
      A: "text-red-600 bg-red-100",
      B: "text-orange-600 bg-orange-100",
      C: "text-yellow-600 bg-yellow-100",
      D: "text-green-600 bg-green-100",
      E: "text-blue-600 bg-blue-100",
      F: "text-gray-600 bg-gray-100",
    };
    return colors[grade] || "text-gray-600 bg-gray-100";
  };

  if (isCompact) {
    return (
      <div
        className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
          selected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
        }`}
        onClick={() => onSelect(runner)}
      >
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-900">{runner.name}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Speed: {runner.stats.speed}</span>
            <span>Power: {runner.stats.power}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
        selected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
      }`}
      onClick={() => onSelect(runner)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-gray-900">{runner.name}</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-blue-600">
            <Zap size={14} />
            <span>{runner.stats.mana}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="text-sm">
          <span className="text-gray-600">Speed:</span>
          <span className="font-medium ml-1">{runner.stats.speed}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Stamina:</span>
          <span className="font-medium ml-1">{runner.stats.stamina}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Power:</span>
          <span className="font-medium ml-1">{runner.stats.power}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Guts:</span>
          <span className="font-medium ml-1">{runner.stats.guts}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Wit:</span>
          <span className="font-medium ml-1">{runner.stats.wit}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Stamina Down:</span>
          <span className="font-medium ml-1">{runner.stats.staminaDown}</span>
        </div>
      </div>

      {expanded && (
        <div className="space-y-3 pt-3 border-t">
          {/* Distance Preferences */}
          <div>
            <div className="text-xs text-gray-600 mb-1">Distance Aptitude:</div>
            <div className="flex gap-1">
              {Object.entries(runner.distance).map(([dist, grade]) => (
                <span
                  key={dist}
                  className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(grade)}`}
                >
                  {dist}: {grade}
                </span>
              ))}
            </div>
          </div>

          {/* Racing Style */}
          <div>
            <div className="text-xs text-gray-600 mb-1">Racing Style:</div>
            <div className="flex gap-1">
              {Object.entries(runner.style).map(([style, grade]) => (
                <span
                  key={style}
                  className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(grade)}`}
                >
                  {style}: {grade}
                </span>
              ))}
            </div>
          </div>

          {/* Abilities */}
          <div>
            <div className="text-xs text-gray-600 mb-1">
              Abilities ({runner.abilities.length}):
            </div>
            <div className="space-y-1">
              {runner.abilities.map((ability, idx) => (
                <div key={idx} className="text-xs bg-gray-50 rounded px-2 py-1">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{ability.name}</span>
                    {ability.type === "active" && (
                      <span className="text-blue-600">
                        ({ability.manaCost} mana)
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600">{ability.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunnerCard;
