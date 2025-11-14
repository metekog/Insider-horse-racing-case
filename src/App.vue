<template>
  <div class="app">
    <Header />
    <div class="main-content">
      <HorseList />
      <div class="center-section">
        <RaceTrack />
      </div>
      <div class="right-section">
        <Program />
        <Results />
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import HorseList from "./components/HorseList.vue";
import RaceTrack from "./components/RaceTrack.vue";
import Program from "./components/Program.vue";
import Results from "./components/Results.vue";

export default {
  name: "App",
  components: {
    Header,
    HorseList,
    RaceTrack,
    Program,
    Results,
  },
};
</script>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.main-content {
  display: flex;
  gap: 10px;
  padding: 10px;
  height: calc(100vh - 80px);
  max-width: 1800px;
  margin: 0 auto;
  width: 100%;
}

.center-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.right-section {
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 600px;
}
</style>
