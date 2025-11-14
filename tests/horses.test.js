import test from "node:test";
import assert from "node:assert/strict";
import { horseModule } from "../src/store/modules/horses.js";

const createState = () => ({
  allHorses: [],
  horseCount: 0,
});

const withMockedRandom = (mockFn, fn) => {
  const originalRandom = Math.random;
  Math.random = mockFn;
  try {
    return fn();
  } finally {
    Math.random = originalRandom;
  }
};

const createDeterministicRandom = () => {
  let current = 0.03;
  return () => {
    current = (current + 0.07) % 1;
    if (current === 0) current = 0.07;
    return current;
  };
};

test("GENERATE_HORSES creates 20 horses with sequential ids and stats", () => {
  const state = createState();

  withMockedRandom(createDeterministicRandom(), () => {
    horseModule.mutations.GENERATE_HORSES(state);
  });

  assert.equal(state.horseCount, 20);
  assert.equal(state.allHorses.length, 20);
  const expectedIds = Array.from({ length: 20 }, (_, idx) => idx + 1);
  assert.deepEqual(
    state.allHorses.map((horse) => horse.id),
    expectedIds
  );
  state.allHorses.forEach((horse) => {
    assert.ok(horse.condition >= 1 && horse.condition <= 100);
    assert.match(horse.color, /^#[0-9a-fA-F]{6}$/);
  });
});

test("GENERATE_HORSES assigns unique colors for each entry", () => {
  const state = createState();

  withMockedRandom(createDeterministicRandom(), () => {
    horseModule.mutations.GENERATE_HORSES(state);
  });

  const colors = state.allHorses.map((horse) => horse.color);
  assert.equal(new Set(colors).size, colors.length);
});
