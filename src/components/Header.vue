<template>
  <header class="header">
    <h1 class="title">Horse Racing</h1>
    <div class="buttons">
      <button
        class="btn btn-generate"
        @click="handleGenerate"
        :disabled="isRacing"
      >
        GENERATE PROGRAM
      </button>
      <button
        class="btn btn-start"
        @click="handleStartPause"
        :disabled="!hasSchedule"
      >
        {{ buttonText }}
      </button>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Header",
  computed: {
    ...mapGetters("races", ["getRaceStatus", "getSchedule"]),
    ...mapGetters("horses", ["getAllHorses"]),

    isRacing() {
      return this.getRaceStatus === "racing";
    },

    hasSchedule() {
      return this.getSchedule.length > 0;
    },

    buttonText() {
      const status = this.getRaceStatus;
      if (status === "racing") return "PAUSE";
      if (status === "paused") return "RESUME";
      if (status === "finished") return "RESTART";
      return "START/PAUSE";
    },
  },
  methods: {
    ...mapActions("horses", ["generateHorses"]),
    ...mapActions("races", [
      "generateSchedule",
      "startRaces",
      "pauseRace",
      "resumeRace",
      "resetRaces",
    ]),

    async handleGenerate() {
      await this.generateHorses();

      await this.generateSchedule();
    },

    async handleStartPause() {
      const status = this.getRaceStatus;

      if (status === "racing") {
        this.pauseRace();
      } else if (status === "paused") {
        await this.resumeRace();
      } else if (status === "finished") {
        await this.resetRaces();
        await this.generateSchedule();
        await this.startRaces();
      } else {
        await this.startRaces();
      }
    },
  },
};
</script>

<style scoped>
.header {
  background-color: #f88d8d;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 1800px;
  width: 100%;
  margin: 0 auto;
}

.title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-generate,
.btn-start {
  background-color: #fef5ef;
  color: #4b4b4b;
}

.btn-generate:hover:not(:disabled),
.btn-start:hover:not(:disabled) {
  background-color: #f6e3d7;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
