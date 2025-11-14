import { createApp } from "vue";
import { store } from "./store";
import App from "./App.vue";
import "./style.css";

store.dispatch("horses/generateHorses");

createApp(App).use(store).mount("#app");
