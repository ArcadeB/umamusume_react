// Racing system constants and utilities

export const APTITUDE_MODIFIERS = {
  F: -3,
  D: -2,
  C: -1,
  B: 0,
  A: 1,
  S: 2,
  SS: 3,
};

export const RACE_ACTIONS = {
  RUN_NORMALLY: "run_normally",
  SPEED_UP: "speed_up",
  USE_ABILITY: "use_ability",
};

// Calculate tempo meter based on speed stat
export const calculateMaxTempo = (speed) => {
  return 10 + Math.floor(speed / 100);
};

// Calculate number of rolls based on distance aptitude and racing style
export const calculateRolls = (runner, distance, style) => {
  const distanceAptitude = runner.distance[distance] || "F";
  const styleAptitude = runner.style[style] || "F";

  const distanceRolls = Math.max(1, 1 + APTITUDE_MODIFIERS[distanceAptitude]);
  const styleRolls = Math.max(1, 1 + APTITUDE_MODIFIERS[styleAptitude]);

  return {
    distanceRolls,
    styleRolls,
    totalRolls: distanceRolls + styleRolls,
  };
};

// Calculate DC check based on stat
export const calculateDC = (statValue) => {
  return Math.floor(statValue / 10);
};

// Perform a single roll (1-100)
export const performRoll = () => {
  return Math.floor(Math.random() * 100) + 1;
};

// Check if roll succeeds against DC
export const checkRollSuccess = (roll, dc) => {
  return roll >= dc;
};

// Process run normally action
export const processRunNormally = (runner, obstacle) => {
  const statValue = runner.stats[obstacle.requiredStat] || runner.stats.power;
  const dc = calculateDC(statValue);

  let successes = 0;
  const rolls = [];

  // Perform base roll + aptitude-based rolls
  const rollData = calculateRolls(runner, obstacle.distance, obstacle.style);

  for (let i = 0; i < rollData.totalRolls; i++) {
    const roll = performRoll();
    const success = checkRollSuccess(roll, dc);

    rolls.push({ roll, success, dc });

    if (success) {
      successes++;
    }
  }

  return {
    successes,
    rolls,
    dc,
    totalRolls: rollData.totalRolls,
  };
};

// Calculate tempo change based on successes
export const calculateTempoChange = (successes, minRequired = 0) => {
  if (minRequired === 0) {
    // For run normally action, each success gives +1 tempo
    return successes;
  } else {
    // For obstacles, compare against minimum required
    const difference = successes - minRequired;
    return difference; // Positive = speed up, negative = slow down
  }
};

// Process obstacle encounter
export const processObstacle = (
  runner,
  obstacle,
  action = RACE_ACTIONS.RUN_NORMALLY,
) => {
  const result = {
    action,
    obstacle: obstacle.name,
    runner: runner.name,
    initialTempo: runner.currentTempo || 10,
    rolls: [],
    successes: 0,
    tempoChange: 0,
    newTempo: 0,
    message: "",
  };

  switch (action) {
    case RACE_ACTIONS.RUN_NORMALLY:
      const runResult = processRunNormally(runner, obstacle);
      result.rolls = runResult.rolls;
      result.successes = runResult.successes;

      if (obstacle.minRequired) {
        // This is a challenging obstacle
        result.tempoChange = calculateTempoChange(
          runResult.successes,
          obstacle.minRequired,
        );

        if (result.tempoChange < 0) {
          result.message = `Failed obstacle! Slowed down by ${Math.abs(result.tempoChange)} tempo`;
        } else if (result.tempoChange > 0) {
          result.message = `Overcame obstacle! Sped up by ${result.tempoChange} tempo`;
        } else {
          result.message = "Just barely overcame the obstacle";
        }
      } else {
        // Normal running, gain tempo based on successes
        result.tempoChange = runResult.successes;
        result.message = `Running normally, gained ${result.tempoChange} tempo`;
      }
      break;

    case RACE_ACTIONS.SPEED_UP:
      // TODO: Implement speed up logic
      result.message = "Speed up action (not implemented yet)";
      break;

    case RACE_ACTIONS.USE_ABILITY:
      // TODO: Implement ability usage
      result.message = "Ability usage (not implemented yet)";
      break;
  }

  // Calculate new tempo (ensure it doesn't go below 0 or above max)
  const maxTempo = calculateMaxTempo(runner.stats.speed);
  result.newTempo = Math.max(
    0,
    Math.min(maxTempo, result.initialTempo + result.tempoChange),
  );

  return result;
};

// Initialize runner for race
export const initializeRunnerForRace = (runner) => {
  return {
    ...runner,
    currentTempo: 10,
    maxTempo: calculateMaxTempo(runner.stats.speed),
    position: 0,
    raceLog: [],
  };
};

// Sample obstacles with the new structure
export const sampleRaceObstacles = [
  {
    id: 1,
    name: "Slope Hill",
    description: "A challenging uphill section",
    requiredStat: "power",
    minRequired: 5,
    distance: "medium",
    style: "pace",
    type: "terrain",
  },
  {
    id: 2,
    name: "Sharp Turn",
    description: "Requires careful navigation",
    requiredStat: "wit",
    minRequired: 3,
    distance: "sprint",
    style: "late",
    type: "technical",
  },
  {
    id: 3,
    name: "Straight Sprint",
    description: "Pure speed section",
    requiredStat: "speed",
    minRequired: 0, // No minimum, just gain tempo
    distance: "sprint",
    style: "front",
    type: "straight",
  },
];
