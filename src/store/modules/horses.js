const HORSE_NAMES = [
  "Lando Norris",
  "Oscar Piastri",
  "Max Verstappen",
  "George Russell",
  "Charles Leclerc",
  "Lewis Hamilton",
  "Kimi Antonelli",
  "Yuki Tsunoda",
  "Alexander Albon",
  "Carlos Sainz",
  "Liam Lawson",
  "Isack Hadjar",
  "Fernando Alonso",
  "Lance Stroll",
  "Esteban Ocon",
  "Oliver Bearman",
  "Nico Hülkenberg",
  "Gabriel Bortoleto",
  "Pierre Gasly",
  "Franco Colapinto",
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateUniqueColor(usedColors) {
  let color = "#000000";
  do {
    color = `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;
  } while (usedColors.has(color));
  usedColors.add(color);
  return color;
}

export const horseModule = {
  namespaced: true,

  state: {
    allHorses: [],
    horseCount: 0,
  },

  mutations: {
    SET_HORSE_COUNT(state, count) {
      state.horseCount = count;
    },

    GENERATE_HORSES(state) {
      const count = 20;
      state.horseCount = count;

      const shuffledNames = shuffleArray(HORSE_NAMES);
      const usedColors = new Set();

      state.allHorses = Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        name: shuffledNames[index],
        condition: randomInt(1, 100),
        color: generateUniqueColor(usedColors),
      }));
    },
  },

  actions: {
    generateHorses({ commit }) {
      commit("GENERATE_HORSES");
    },
  },

  getters: {
    getAllHorses: (state) => state.allHorses,

    getHorseCount: (state) => state.horseCount,

    getHorseById: (state) => (id) => {
      return state.allHorses.find((horse) => horse.id === id);
    },
  },
};
