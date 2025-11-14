<template>
  <div class="horse-list-container">
    <div class="header-section">
      <h2>Horse List (1-20)</h2>
    </div>
    <div class="table-container">
      <table class="horse-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Condition</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="horse in horses" :key="horse.id">
            <td>{{ horse.name }}</td>
            <td>{{ horse.condition }}</td>
            <td>
              <span
                class="color-indicator"
                :style="{ backgroundColor: horse.color }"
                aria-label="Horse color"
              ></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "HorseList",
  computed: {
    ...mapGetters("horses", ["getAllHorses"]),

    horses() {
      return this.getAllHorses;
    },
  },
};
</script>

<style scoped>
.horse-list-container {
  width: 300px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header-section {
  background-color: #f9e7a1;
  padding: 10px;
  border-radius: 4px 4px 0 0;
}

.header-section h2 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.table-container {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 150px);
}

.horse-table {
  width: 100%;
  border-collapse: collapse;
}

.horse-table thead {
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 10;
}

.horse-table th {
  padding: 10px;
  text-align: left;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
}

.horse-table td {
  padding: 8px 10px;
  border-bottom: 1px solid #eee;
}

.horse-table tbody tr:hover {
  background-color: #f9f9f9;
}

.color-indicator {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: middle;
  border: 1px solid #ddd;
}
</style>
