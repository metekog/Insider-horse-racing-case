import test from "node:test";
import assert from "node:assert/strict";
import { raceModule } from "../src/store/modules/races.js";

const baseRaceState = () => ({
  schedule: [],
  results: [],
  currentRound: null,
  raceStatus: "idle",
  activeAnimationIds: [],
});

const buildHorses = (count = 10) =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Horse ${index + 1}`,
    condition: 50,
    color: "#000000",
  }));

test("GENERATE_SCHEDULE caps lanes at 10 horses and resets stats", () => {
  const state = baseRaceState();
  raceModule.mutations.GENERATE_SCHEDULE(state, buildHorses(15));

  assert.equal(state.schedule.length, 6);
  state.schedule.forEach((round) => {
    assert.equal(round.horses.length, 10);
    round.horses.forEach((horse, idx) => {
      assert.equal(horse.lane, idx + 1);
      assert.equal(horse.progress, 0);
      assert.equal(horse.position, 0);
    });
  });
});

test("SET_ROUND_RESULTS sorts by raceTime and stores positions/distance", () => {
  const state = baseRaceState();
  raceModule.mutations.GENERATE_SCHEDULE(state, buildHorses());

  const payload = {
    roundNumber: 2,
    results: [
      { id: 1, name: "Horse 1", raceTime: 900 },
      { id: 2, name: "Horse 2", raceTime: 850 },
      { id: 3, name: "Horse 3", raceTime: 920 },
    ],
  };

  raceModule.mutations.SET_ROUND_RESULTS(state, payload);

  const stored = state.results.find((r) => r.roundNumber === payload.roundNumber);
  assert.ok(stored);
  assert.equal(stored.distance, state.schedule[payload.roundNumber - 1].distance);
  assert.deepEqual(
    stored.results.map((r) => r.id),
    [2, 1, 3]
  );
  assert.deepEqual(
    stored.results.map((r) => r.position),
    [1, 2, 3]
  );
});

test("RESET_ROUND_PROGRESS zeros progress and position for the targeted round", () => {
  const state = baseRaceState();
  raceModule.mutations.GENERATE_SCHEDULE(state, buildHorses());

  const roundNumber = 1;
  state.schedule[roundNumber - 1].horses.forEach((horse, idx) => {
    horse.progress = 10 * (idx + 1);
    horse.position = idx + 1;
  });

  raceModule.mutations.RESET_ROUND_PROGRESS(state, roundNumber);

  state.schedule[roundNumber - 1].horses.forEach((horse) => {
    assert.equal(horse.progress, 0);
    assert.equal(horse.position, 0);
  });
});

test("RESET_ROUND_PROGRESS leaves other rounds untouched", () => {
  const state = baseRaceState();
  raceModule.mutations.GENERATE_SCHEDULE(state, buildHorses(12));

  state.schedule[0].horses.forEach((horse, idx) => {
    horse.progress = 30 + idx;
    horse.position = idx + 5;
  });
  state.schedule[1].horses.forEach((horse, idx) => {
    horse.progress = 40 + idx;
    horse.position = idx + 3;
  });

  raceModule.mutations.RESET_ROUND_PROGRESS(state, 2);

  state.schedule[0].horses.forEach((horse, idx) => {
    assert.equal(horse.progress, 30 + idx);
    assert.equal(horse.position, idx + 5);
  });

  state.schedule[1].horses.forEach((horse) => {
    assert.equal(horse.progress, 0);
    assert.equal(horse.position, 0);
  });
});
