<template>
  <div class="achievement-list">
    <achievement-points
        :amount="points"
        class="achievement-list__points"
    />
    <div class="achievement-list__list" @mouseenter="handleListMouseEnter" @mouseleave="handleListMouseLeave">
      <achievement
          v-for="id in achievements"
          :key="id"
          :id="id"
          :disableAutoScroll="disableAutoScroll"
          class="achievement-list__achievement"
      />
    </div>
  </div>
</template>

<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import Achievement from "./Achievement"
    import {Achievements} from "../game/achievement";
    import AchievementPoints from "./AchievementPoints.vue";
    import Currency from "../game/currency";
    import {GameEvent} from "../game/game-event";

    @Component({
        components: {
            Achievement,
            AchievementPoints
        }
    })
    export default class AchievementList extends Vue {
        achievements = Achievements.allIds;
        points = Math.floor(Currency.achievementPoints);

        disableAutoScroll = false;

        [GameEvent.ACHIEVEMENT_POINTS_CHANGED]() {
            this.points = Math.floor(Currency.achievementPoints);
        }

        handleListMouseEnter() {
            this.disableAutoScroll = true;
        }

        handleListMouseLeave() {
            this.disableAutoScroll = false;
        }
    }
</script>

<style scoped lang="scss">
  .achievement-list {
    display: flex;
    flex-direction: column;
    width: 30rem;
    z-index: 1;
    overflow: hidden;
  }

  .achievement-list__points {
    flex-shrink: 0;
    background-color: cornflowerblue;
    border-bottom: .1rem solid #dadada;
    color: white;
    font-weight: bold;
  }

  .achievement-list__list {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background: dodgerblue;
    padding: .3rem;
    overflow-y: scroll;
    scroll-behavior: smooth;
  }

  .achievement-list__achievement {
    flex-shrink: 0;
  }
</style>