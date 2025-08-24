import {
  initializeRunnerForRace,
  RACE_ACTIONS,
  sampleRaceObstacles,
} from "./raceEngine";
import { Pause, Play, SkipForward } from "lucide-react";
import RaceRunnerDisplay from "./RaceRunnerDisplay";
import { useState } from "react";
const RollDisplay = ({ rolls, runner }) => {
  if (!rolls || rolls.length === 0) return null;

  return (
    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
      <div className="font-medium mb-1">Rolls for {runner}:</div>
      <div className="flex flex-wrap gap-1">
        {rolls.map((roll, index) => (
          <span
            key={index}
            className={`px-2 py-1 rounded ${
              roll.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {roll.roll} {roll.success ? "✓" : "✗"}
          </span>
        ))}
      </div>
      <div className="text-gray-600 mt-1">
        DC: {rolls[0]?.dc}, Successes: {rolls.filter((r) => r.success).length}
      </div>
    </div>
  );
};

const LiveRace = ({ selectedRunners, obstacles = [] }) => {
  const [raceState, setRaceState] = useState("setup"); // setup, running, paused, finished
  const [raceRunners, setRaceRunners] = useState([]);
  const [currentObstacle, setCurrentObstacle] = useState(0);
  const [raceLog, setRaceLog] = useState([]);
  const [selectedActions, setSelectedActions] = useState({});
  const [turnResults, setTurnResults] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);

  // Initialize race
  const startRace = () => {
    const initializedRunners = selectedRunners.map((runner) =>
      initializeRunnerForRace(runner),
    );

    setRaceRunners(initializedRunners);
    setRaceState("running");
    setCurrentObstacle(0);
    setCurrentTurn(1);
    setRaceLog(["Race started!"]);
    setTurnResults([]);

    // Initialize default actions
    const defaultActions = {};
    selectedRunners.forEach((runner) => {
      defaultActions[runner.id] = RACE_ACTIONS.RUN_NORMALLY;
    });
    setSelectedActions(defaultActions);
  };

  // Process a single turn
  const processTurn = () => {
    if (raceRunners.length === 0) return;

    const obstacle =
      sampleRaceObstacles[currentObstacle % sampleRaceObstacles.length];
    const results = [];

    // Process each runner's action
    const updatedRunners = raceRunners.map((runner) => {
      const action = selectedActions[runner.id] || RACE_ACTIONS.RUN_NORMALLY;
      const result = processObstacle(runner, obstacle, action);

      results.push(result);

      // Update runner state
      const updatedRunner = {
        ...runner,
        currentTempo: result.newTempo,
        position: runner.position + result.newTempo,
        raceLog: [...(runner.raceLog || []), result],
      };

      return updatedRunner;
    });

    setRaceRunners(updatedRunners);
    setTurnResults(results);
    setRaceLog((prev) => [
      ...prev,
      `Turn ${currentTurn}: Processing ${obstacle.name}`,
    ]);

    // Move to next obstacle and turn
    setCurrentObstacle((prev) => prev + 1);
    setCurrentTurn((prev) => prev + 1);

    // Check if race should end (after 10 turns for demo)
    if (currentTurn >= 10) {
      finishRace(updatedRunners);
    }
  };

  const finishRace = (runners) => {
    setRaceState("finished");

    // Sort by position (distance traveled)
    const sortedRunners = [...runners].sort((a, b) => b.position - a.position);
    setRaceRunners(sortedRunners);

    setRaceLog((prev) => [
      ...prev,
      "Race finished!",
      `Winner: ${sortedRunners[0].name} (${sortedRunners[0].position} distance)`,
    ]);
  };

  const resetRace = () => {
    setRaceState("setup");
    setRaceRunners([]);
    setCurrentObstacle(0);
    setCurrentTurn(0);
    setRaceLog([]);
    setSelectedActions({});
    setTurnResults([]);
  };

  const handleActionSelect = (runnerId, action) => {
    setSelectedActions((prev) => ({
      ...prev,
      [runnerId]: action,
    }));
  };

  const getCurrentObstacle = () => {
    return sampleRaceObstacles[currentObstacle % sampleRaceObstacles.length];
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Live Race</h2>
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

          {raceState === "running" && (
            <>
              <button
                onClick={processTurn}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <SkipForward size={16} />
                Process Turn
              </button>
              <button
                onClick={() => setRaceState("paused")}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                <Pause size={16} />
                Pause
              </button>
            </>
          )}

          {raceState === "paused" && (
            <button
              onClick={() => setRaceState("running")}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              <Play size={16} />
              Resume
            </button>
          )}

          {(raceState === "finished" || raceState === "paused") && (
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

      {raceState === "setup" && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Select runners to start the live race</p>
          <p className="text-sm mt-2">
            This will be a turn-based race where you choose actions for each
            runner
          </p>
        </div>
      )}

      {raceState !== "setup" && (
        <div className="space-y-6">
          {/* Current Turn Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">
              Turn {currentTurn} - {getCurrentObstacle()?.name}
            </h3>
            <p className="text-sm text-gray-600">
              {getCurrentObstacle()?.description}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Required: {getCurrentObstacle()?.requiredStat}, Min Success:{" "}
              {getCurrentObstacle()?.minRequired || 0}
            </p>
          </div>

          {/* Runners Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {raceRunners.map((runner) => (
              <div key={runner.id}>
                <RaceRunnerDisplay runner={runner} showDetailed={true} />

                {raceState === "running" && (
                  <ActionSelector
                    runner={runner}
                    onActionSelect={handleActionSelect}
                    disabled={false}
                  />
                )}

                {/* Show current action */}
                {raceState === "running" && (
                  <div className="text-xs text-gray-600 mb-2">
                    Action:{" "}
                    <span className="font-medium">
                      {selectedActions[runner.id]?.replace("_", " ") ||
                        "Run Normally"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Turn Results */}
          {turnResults.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Turn Results</h4>
              <div className="space-y-3">
                {turnResults.map((result, index) => (
                  <div key={index} className="bg-white rounded p-3">
                    <div className="font-medium text-sm">{result.runner}</div>
                    <div className="text-xs text-gray-600">
                      {result.message}
                    </div>
                    <div className="text-xs text-gray-500">
                      Tempo: {result.initialTempo} → {result.newTempo}(
                      {result.tempoChange > 0 ? "+" : ""}
                      {result.tempoChange})
                    </div>
                    <RollDisplay rolls={result.rolls} runner={result.runner} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Race Log */}
          {raceLog.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Race Log</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {raceLog.slice(-10).map((log, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    {log}
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

export default LiveRace;
