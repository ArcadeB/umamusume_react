import React from "react";
import RunnerCard from "./RunnerCard";

const RunnersList = ({ runners, selectedRunners, onRunnerSelect }) => {
  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      {runners.map((runner) => (
        <RunnerCard
          key={runner.id}
          runner={runner}
          onSelect={onRunnerSelect}
          selected={selectedRunners.some((r) => r.id === runner.id)}
        />
      ))}
    </div>
  );
};

export default RunnersList;
