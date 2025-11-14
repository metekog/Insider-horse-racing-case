<template>
  <div class="program-container">
    <div class="header-section">
      <h2>Program</h2>
    </div>
    <div class="content-container">
      <div
        v-for="round in schedule"
        :key="round.roundNumber"
        class="round-section"
      >
        <h3 class="round-title">
          {{ getRoundTitle(round.roundNumber) }} - {{ round.distance }}m
        </h3>
        <table class="program-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(horse, index) in round.horses" :key="horse.id">
              <td>{{ index + 1 }}</td>
              <td>{{ horse.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Program",
  computed: {
    ...mapGetters("races", ["getSchedule"]),

    schedule() {
      return this.getSchedule;
    },
  },
  methods: {
    getRoundTitle(roundNumber) {
      const suffixes = ["", "ST", "ND", "RD"];
      const suffix = roundNumber <= 3 ? suffixes[roundNumber] || "TH" : "TH";
      return `${roundNumber}${suffix} Lap`;
    },
  },
};
</script>

<style scoped>
.program-container {
  width: 300px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100vh - 100px);
}

.header-section {
  background-color: #8ec5ff;
  padding: 10px;
  border-radius: 4px 4px 0 0;
}

.header-section h2 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: white;
}

.content-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.round-section {
  margin-bottom: 20px;
}

.round-section:last-child {
  margin-bottom: 0;
}

.round-title {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.program-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.program-table thead {
  background-color: #f5f5f5;
}

.program-table th {
  padding: 8px;
  text-align: left;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
}

.program-table td {
  padding: 6px 8px;
  border-bottom: 1px solid #eee;
}

.program-table tbody tr:hover {
  background-color: #f9f9f9;
}
</style>
