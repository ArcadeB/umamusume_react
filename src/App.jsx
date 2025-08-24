import React, { useState } from "react";
import { Target, Play, RotateCcw } from "lucide-react";
import Layout from "./components/Layout";
import RunnerSearch from "./components/RunnerSearch";
import RunnersList from "./components/RunnersList";
import RunnerCard from "./components/RunnerCard";
import RaceCalculations from "./components/RaceCalculations";
import RaceObstacles from "./components/RaceObstacles";

import runnersData from "./components/runners.json";

// Sample runner data structure matching your current setup
const sampleRunners = [
  {
    id: 1,
    name: "Test Runner",
    stats: {
      speed: 950,
      stamina: 800,
      power: 1100,
      guts: 750,
      wit: 600,
      staminaDown: 0,
      mana: 100,
    },
    distance: {
      sprint: "B",
      mile: "A",
      medium: "A",
      long: "C",
    },
    style: {
      front: "G",
      pace: "A",
      late: "B",
      end: "C",
    },
    abilities: [
      {
        name: "Speed Boost",
        description: "Increases speed by 15% for 3 turns",
        type: "active",
        manaCost: 30,
      },
      {
        name: "Endurance",
        description: "Reduces stamina consumption by 10%",
        type: "passive",
      },
    ],
  },
  {
    id: 2,
    name: "Lightning Flash",
    stats: {
      speed: 1200,
      stamina: 600,
      power: 800,
      guts: 900,
      wit: 850,
      staminaDown: 0,
      mana: 80,
    },
    distance: {
      sprint: "A",
      mile: "B",
      medium: "C",
      long: "D",
    },
    style: {
      front: "A",
      pace: "C",
      late: "D",
      end: "B",
    },
    abilities: [
      {
        name: "Lightning Strike",
        description: "Burst of speed that ignores terrain penalties",
        type: "active",
        manaCost: 25,
      },
    ],
  },
];

// Sample race obstacles matching your current setup
const sampleObstacles = [
  {
    id: 1,
    name: "Strong Headwind",
    description: "Reduces speed by 15%",
    severity: "DC 15",
    type: "weather",
  },
  {
    id: 2,
    name: "Muddy Track",
    description: "Increases stamina consumption",
    severity: "DC 12",
    type: "terrain",
  },
  {
    id: 3,
    name: "Crowd Distraction",
    description: "May cause concentration loss",
    severity: "DC 10",
    type: "mental",
  },
];

const RaceSimulation = ({ selectedRunners, obstacles }) => {
  const [raceState, setRaceState] = useState("setup"); // setup, running, finished
  const [raceResults, setRaceResults] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [raceLog, setRaceLog] = useState([]);

  const startRace = () => {
    setRaceState("running");
    setCurrentTurn(0);
    setRaceLog(["Race started!"]);

    // Simple race simulation
    const results = selectedRunners
      .map((runner) => ({
        runner,
        position: Math.floor(Math.random() * selectedRunners.length) + 1,
        time: (Math.random() * 10 + 90).toFixed(2), // Random time between 90-100 seconds
      }))
      .sort((a, b) => a.position - b.position);

    setTimeout(() => {
      setRaceResults(results);
      setRaceState("finished");
      setRaceLog((prev) => [...prev, "Race finished!"]);
    }, 2000);
  };

  const resetRace = () => {
    setRaceState("setup");
    setRaceResults([]);
    setCurrentTurn(0);
    setRaceLog([]);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Race Simulation</h2>
        <div className="flex gap-2">
          {raceState === "setup" && selectedRunners.length > 0 && (
            <button
              onClick={startRace}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              <Play size={16} />
              Start Race
            </button>
          )}
          {raceState !== "setup" && (
            <button
              onClick={resetRace}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          )}
        </div>
      </div>

      {raceState === "setup" && selectedRunners.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Target className="mx-auto mb-4" size={48} />
          <p className="text-lg">Select runners to start simulation</p>
          <p className="text-sm mt-2">
            Click on runners from the left panel to add them to the race
          </p>
        </div>
      )}

      {raceState === "setup" && selectedRunners.length > 0 && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">
              Race Participants ({selectedRunners.length})
            </h3>
            <div className="space-y-2">
              {selectedRunners.map((runner) => (
                <RunnerCard
                  key={runner.id}
                  runner={runner}
                  selected={false}
                  isCompact={true}
                  onSelect={() => {}}
                />
              ))}
            </div>
          </div>

          <RaceCalculations
            selectedRunners={selectedRunners}
            obstacles={obstacles}
          />
        </div>
      )}

      {raceState === "running" && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Race in Progress...</p>
          <p className="text-sm text-gray-600 mt-2">Calculating results...</p>
        </div>
      )}

      {raceState === "finished" && raceResults.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-semibold text-lg">Race Results</h3>
          <div className="space-y-3">
            {raceResults.map((result, index) => (
              <div
                key={result.runner.id}
                className={`flex items-center gap-4 p-4 rounded-lg ${
                  index === 0
                    ? "bg-yellow-100 border-2 border-yellow-400"
                    : index === 1
                      ? "bg-gray-100 border-2 border-gray-400"
                      : index === 2
                        ? "bg-orange-100 border-2 border-orange-400"
                        : "bg-white border border-gray-200"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                        ? "bg-gray-500"
                        : index === 2
                          ? "bg-orange-500"
                          : "bg-blue-500"
                  }`}
                >
                  {result.position}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{result.runner.name}</div>
                  <div className="text-sm text-gray-600">
                    Time: {result.time}s
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Speed: {result.runner.stats.speed}
                  </div>
                  <div className="text-sm text-gray-600">
                    Power: {result.runner.stats.power}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {raceLog.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-2">Race Log</h4>
          <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
            {raceLog.map((log, index) => (
              <div key={index} className="text-sm text-gray-700">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [runners, setRunners] = useState(runnersData); // Initialize directly with your JSON data
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRunners, setSelectedRunners] = useState([]);
  const [obstacles, setObstacles] = useState(sampleObstacles);

  const filteredRunners = runners.filter((runner) =>
    runner.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleRunnerSelect = (runner) => {
    setSelectedRunners((prev) => {
      const isSelected = prev.some((r) => r.id === runner.id);
      if (isSelected) {
        return prev.filter((r) => r.id !== runner.id);
      } else {
        return [...prev, runner];
      }
    });
  };

  const handleAddObstacle = (newObstacle) => {
    setObstacles((prev) => [...prev, newObstacle]);
  };

  const handleRemoveObstacle = (id) => {
    setObstacles((prev) => prev.filter((obs) => obs.id !== id));
  };

  return (
    <Layout>
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column - Runners & Participants */}
        <div className="col-span-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Runners & Participants
          </h2>

          <RunnerSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <RunnersList
            runners={filteredRunners}
            selectedRunners={selectedRunners}
            onRunnerSelect={handleRunnerSelect}
          />
        </div>

        {/* Main Column - Race Simulation */}
        <div className="col-span-5">
          <RaceSimulation
            selectedRunners={selectedRunners}
            obstacles={obstacles}
          />
        </div>

        {/* Right Column - Race Obstacles */}
        <div className="col-span-3">
          <RaceObstacles
            obstacles={obstacles}
            onAddObstacle={handleAddObstacle}
            onRemoveObstacle={handleRemoveObstacle}
          />
        </div>
      </div>
    </Layout>
  );
}
