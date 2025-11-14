<template>
  <div class="race-track-container">
    <div class="track">
      <div class="finish-line-vertical"></div>
      <div v-for="lane in 10" :key="lane" class="lane">
        <div class="lane-number">{{ lane }}</div>
        <div class="lane-content">
          <div
            v-if="getHorseInLane(lane)"
            class="horse-icon"
            :key="getHorseKey(lane)"
            :style="getHorseStyle(lane)"
          >
            <div
              class="horse-icon-image"
              :style="getHorseColorStyle(lane)"
              aria-hidden="true"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="track-footer">
      <div class="lap-info">
        <span v-if="displayRoundData">
          {{ getLapText(displayRoundData.roundNumber) }} -
          {{ displayRoundData.distance }}m
        </span>
        <span v-else>No race scheduled</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HorseIcon from "../assets/icons/horse.svg";

export default {
  name: "RaceTrack",
  data() {
    return {
      horseIcon: HorseIcon,
    };
  },
  computed: {
    ...mapGetters("races", [
      "getCurrentRound",
      "getRoundByNumber",
      "getSchedule",
      "getResults",
      "getRaceStatus",
    ]),

    currentRoundData() {
      if (!this.getCurrentRound) return null;
      return this.getRoundByNumber(this.getCurrentRound);
    },

    upcomingRoundData() {
      if (!this.getSchedule?.length) return null;
      const completedRounds =
        this.getResults?.map((result) => result.roundNumber) || [];
      return (
        this.getSchedule.find(
          (round) => !completedRounds.includes(round.roundNumber)
        ) || null
      );
    },

    displayRoundData() {
      return this.currentRoundData || this.upcomingRoundData || null;
    },
  },
  methods: {
    getHorseInLane(lane) {
      if (!this.displayRoundData) return null;

      const horse = this.displayRoundData.horses.find((h) => h.lane === lane);
      return horse || null;
    },

    getHorseStyle(lane) {
      const horse = this.getHorseInLane(lane);
      if (!horse) return {};

      const leftMargin = 0;
      const rightMargin = 5;
      const availableWidth = 100 - leftMargin - rightMargin;
      const leftPosition = leftMargin + (horse.progress / 100) * availableWidth;
      const shouldAnimate =
        this.getRaceStatus === "racing" && horse.progress > 0;

      return {
        left: `${leftPosition}%`,
        transition: shouldAnimate ? "left 0.1s linear" : "none",
      };
    },

    getHorseKey(lane) {
      const round = this.displayRoundData?.roundNumber || "none";
      return `${round}-${lane}`;
    },

    getHorseColorStyle(lane) {
      const horse = this.getHorseInLane(lane);
      if (!horse) return {};

      return {
        backgroundColor: horse.color,
        WebkitMaskImage: `url(${this.horseIcon})`,
        maskImage: `url(${this.horseIcon})`,
      };
    },

    getLapText(roundNumber = null) {
      const round = roundNumber || this.getCurrentRound;
      if (!round) return "";
      const suffixes = ["", "st", "nd", "rd"];
      const suffix = round <= 3 ? suffixes[round] || "th" : "th";
      return `${round}${suffix} Lap`;
    },

    getCurrentDistance() {
      if (this.displayRoundData) {
        return this.displayRoundData.distance;
      }
      return 0;
    },
  },
};
</script>

<style scoped>
.race-track-container {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.track {
  flex: 1;
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 10px;
  position: relative;
  overflow: hidden;
}

.finish-line-vertical {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #f88d8d;
  z-index: 10;
  box-shadow: 0 0 4px rgba(255, 0, 0, 0.5);
}

.finish-line-vertical::before {
  content: "FINISH";
  position: absolute;
  right: 8px;
  bottom: 0;
  font-size: 11px;
  font-weight: bold;
  color: #f88d8d;
  white-space: nowrap;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2px 4px;
  border-radius: 2px;
  pointer-events: none;
}

.lane {
  display: flex;
  align-items: center;
  height: calc(10% - 2px);
  border-bottom: 2px dashed #ccc;
  position: relative;
}

.lane:last-child {
  border-bottom: none;
}

.lane-number {
  width: 40px;
  height: 30px;
  background-color: #6aa084;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 4px;
  margin-right: 10px;
}

.lane-content {
  flex: 1;
  height: 100%;
  position: relative;
}

.horse-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
}

.horse-icon-image {
  width: 36px;
  height: 36px;
  display: block;
  background-color: #000;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
}

.track-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  margin-top: 10px;
}

.lap-info {
  text-align: center;
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}
</style>
