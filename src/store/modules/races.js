const ROUND_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function calculateRaceTime(distance, condition) {
  const baseTime = 800;
  const modifier = 8;
  const effectiveCondition = Math.max(10, condition);

  const time = baseTime + (distance / effectiveCondition) * modifier;

  const randomness = Math.random() * 200 - 100;

  return Math.max(600, time + randomness);
}

export const raceModule = {
  namespaced: true,

  state: {
    schedule: [],
    results: [],
    currentRound: null,
    raceStatus: "idle",
    activeAnimationIds: [],
  },

  mutations: {
    GENERATE_SCHEDULE(state, horses) {
      if (horses.length === 0) {
        state.schedule = [];
        return;
      }

      state.schedule = ROUND_DISTANCES.map((distance, index) => {
        const horsesToSelect = Math.min(10, horses.length);
        const shuffledHorses = shuffleArray([...horses]);
        const selectedHorses = shuffledHorses.slice(0, horsesToSelect);

        return {
          roundNumber: index + 1,
          distance: distance,
          horses: selectedHorses.map((horse, horseIndex) => ({
            ...horse,
            lane: horseIndex + 1,
            position: 0,
            raceTime: 0,
            progress: 0,
          })),
        };
      });

      state.results = [];
      state.currentRound = null;
      state.raceStatus = "idle";
    },

    SET_CURRENT_ROUND(state, roundNumber) {
      state.currentRound = roundNumber;
    },

    UPDATE_HORSE_PROGRESS(state, { roundNumber, horseId, progress, position }) {
      const round = state.schedule.find((r) => r.roundNumber === roundNumber);
      if (round) {
        const horse = round.horses.find((h) => h.id === horseId);
        if (horse) {
          horse.progress = progress;
          horse.position = position;
        }
      }
    },

    RESET_ROUND_PROGRESS(state, roundNumber) {
      const round = state.schedule.find((r) => r.roundNumber === roundNumber);
      if (round) {
        round.horses.forEach((horse) => {
          horse.progress = 0;
          horse.position = 0;
        });
      }
    },

    SET_ROUND_RESULTS(state, { roundNumber, results }) {
      const sortedResults = [...results].sort(
        (a, b) => a.raceTime - b.raceTime
      );

      sortedResults.forEach((result, index) => {
        result.position = index + 1;
      });

      const existingIndex = state.results.findIndex(
        (r) => r.roundNumber === roundNumber
      );
      if (existingIndex >= 0) {
        state.results[existingIndex] = {
          roundNumber,
          distance:
            state.schedule.find((r) => r.roundNumber === roundNumber)
              ?.distance || 0,
          results: sortedResults,
        };
      } else {
        state.results.push({
          roundNumber,
          distance:
            state.schedule.find((r) => r.roundNumber === roundNumber)
              ?.distance || 0,
          results: sortedResults,
        });
      }
    },

    SET_RACE_STATUS(state, status) {
      state.raceStatus = status;
    },

    RESET_RACES(state) {
      state.schedule = [];
      state.results = [];
      state.currentRound = null;
      state.raceStatus = "idle";
      state.activeAnimationIds.forEach((id) => clearTimeout(id));
      state.activeAnimationIds = [];
    },

    ADD_ANIMATION_ID(state, id) {
      state.activeAnimationIds.push(id);
    },

    CLEAR_ANIMATION_IDS(state) {
      state.activeAnimationIds.forEach((id) => clearTimeout(id));
      state.activeAnimationIds = [];
    },
  },

  actions: {
    generateSchedule({ commit, rootGetters }) {
      const horses = rootGetters["horses/getAllHorses"];
      commit("GENERATE_SCHEDULE", horses);
    },

    async runRace({ commit, state, dispatch }, roundNumber) {
      const round = state.schedule.find((r) => r.roundNumber === roundNumber);
      if (!round) return;

      commit("RESET_ROUND_PROGRESS", roundNumber);
      commit("SET_CURRENT_ROUND", roundNumber);
      commit("SET_RACE_STATUS", "racing");

      const raceData = round.horses.map((horse) => ({
        ...horse,
        raceTime: calculateRaceTime(round.distance, horse.condition),
      }));

      const animationDuration = Math.max(...raceData.map((h) => h.raceTime));
      const updateInterval = 50; // Update every 50ms for smooth animation
      let startTime = Date.now();
      let pausedTime = 0;

      return new Promise((resolve, reject) => {
        let animationId = null;
        let isPaused = false;

        const animate = () => {
          if (state.raceStatus === "paused") {
            if (!isPaused) {
              isPaused = true;
              pausedTime = Date.now();
            }
            animationId = setTimeout(animate, updateInterval);
            commit("ADD_ANIMATION_ID", animationId);
            return;
          }

          if (isPaused && state.raceStatus === "racing") {
            const pauseDuration = Date.now() - pausedTime;
            startTime += pauseDuration;
            isPaused = false;
          }

          const elapsed = Date.now() - startTime;
          const overallProgress = Math.min(
            100,
            (elapsed / animationDuration) * 100
          );

          const horseProgressions = raceData.map((horseData) => ({
            id: horseData.id,
            progress: Math.min(100, (elapsed / horseData.raceTime) * 100),
          }));

          const sortedProgressions = [...horseProgressions].sort(
            (a, b) => b.progress - a.progress
          );

          raceData.forEach((horseData) => {
            const horseProgression = horseProgressions.find(
              (hp) => hp.id === horseData.id
            );
            const currentPosition =
              sortedProgressions.findIndex((hp) => hp.id === horseData.id) + 1;

            commit("UPDATE_HORSE_PROGRESS", {
              roundNumber,
              horseId: horseData.id,
              progress: horseProgression.progress,
              position: currentPosition,
            });
          });

          if (overallProgress < 100 && state.raceStatus === "racing") {
            animationId = setTimeout(animate, updateInterval);
            commit("ADD_ANIMATION_ID", animationId);
          } else if (overallProgress >= 100) {
            raceData.forEach((horseData) => {
              commit("UPDATE_HORSE_PROGRESS", {
                roundNumber,
                horseId: horseData.id,
                progress: 100,
                position: 0,
              });
            });

            commit("SET_ROUND_RESULTS", {
              roundNumber,
              results: raceData,
            });
            commit("CLEAR_ANIMATION_IDS");
            resolve();
          }
        };

        animate();
      });
    },

    async startRaces({ dispatch, state, commit }) {
      commit("SET_RACE_STATUS", "racing");

      for (let i = 1; i <= state.schedule.length; i++) {
        await dispatch("runRace", i);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      commit("SET_RACE_STATUS", "finished");
    },

    pauseRace({ commit, state }) {
      commit("SET_RACE_STATUS", "paused");
    },

    resumeRace({ commit, state }) {
      if (state.raceStatus !== "paused") return;

      commit("SET_RACE_STATUS", "racing");
    },

    resetRaces({ commit }) {
      commit("RESET_RACES");
    },
  },

  getters: {
    getSchedule: (state) => state.schedule,

    getResults: (state) => state.results,

    getCurrentRound: (state) => state.currentRound,

    getRaceStatus: (state) => state.raceStatus,

    getRoundByNumber: (state) => (roundNumber) => {
      return state.schedule.find((r) => r.roundNumber === roundNumber);
    },

    getRoundResults: (state) => (roundNumber) => {
      return state.results.find((r) => r.roundNumber === roundNumber);
    },
  },
};
