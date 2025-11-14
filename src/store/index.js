import { createStore } from "vuex";
import { horseModule } from "./modules/horses";
import { raceModule } from "./modules/races";

export const store = createStore({
  modules: {
    horses: horseModule,
    races: raceModule,
  },
});
