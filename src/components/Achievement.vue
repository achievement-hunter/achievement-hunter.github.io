<template>
  <div
      v-show="isUnlocked"
      :class="classObject"
      @click="handleClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      ref="achievement"
  >
    <div v-if="progress !== 0" class="achievement__progress-container">
      <div class="achievement__progress-bar" :style="progressBarStyleObject" />
      <span class="achievement__progress-percents">{{progressPercents}}</span>
    </div>
    <div class="achievement__content">
      <div class="achievement__id">{{achievement.id}}</div>
      <div class="achievement__name">{{achievement.name}}</div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Inject, Prop, Vue} from "vue-property-decorator";
    import {AchievementInfo} from "../game/achievement";
    import {TooltipViewModel} from "./tooltip-view-model";
    import EventHub from "../event-hub";
    import {GameEvent} from "../game/game-event";

    @Component
    export default class Achievement extends Vue {
        @Prop() id!: number;
        @Prop() disableAutoScroll!: boolean;
        @Inject() tooltip!: TooltipViewModel;

        get achievement() {
            return new AchievementInfo(this.id);
        }

        isUnlocked = this.achievement.isUnlocked || this.achievement.isCompleted;
        isCompleted = this.achievement.isCompleted;
        progress = this.achievement.hasGoal ? this.achievement.progressFraction : 0;

        hover = false;

        handleClick() {
            EventHub.dispatch(GameEvent.ACHIEVEMENT_CLICKED, this.achievement);
        }

        handleMouseEnter() {
            this.hover = true;
            let tooltip = this.tooltip;
            let achievement = this.achievement.data;
            tooltip.visible = true;
            tooltip.name = achievement.name;
            tooltip.amount = achievement.points;
            tooltip.details = this.achievement.isCompleted || achievement.hintVisible ? achievement.hint : "";
            EventHub.dispatch(GameEvent.ACHIEVEMENT_MOUSE_ENTER, this.achievement);
        }

        handleMouseLeave() {
            this.hover = false;
            this.tooltip.visible = false;
        }

        [GameEvent.ACHIEVEMENTS_UNLOCKED](achs: AchievementInfo[]) {
            let id = this.id;
            if (achs.find(a => a.id === id) !== undefined) {
                this.isUnlocked = true;
                this.scrollIntoView();
                Vue.nextTick(() => {
                    if (this.achievement.isCompleted) {
                        this.scrollIntoView();
                    }
                })
            }
        }

        [GameEvent.ACHIEVEMENT_PROGRESS](ach: AchievementInfo) {
            if (this.id === ach.id) {
                this.progress = ach.progressFraction;
            }
        }

        [GameEvent.ACHIEVEMENT_COMPLETED](ach: AchievementInfo) {
            if (this.id !== ach.id) return;
            this.isCompleted = true;
            this.progress = 0;
            if (this.hover) {
                this.tooltip.details = this.achievement.data.hint;
            }
            this.scrollIntoView();
        }

        scrollIntoView() {
            if (this.disableAutoScroll) return;
            const el = <HTMLElement>this.$refs.achievement;
            el.scrollIntoView();
        }

        get classObject() {
            return {
                "achievement": true,
                "achievement--unlocked": this.isCompleted
            }
        }

        get progressPercents() {
            const progress = Math.floor(this.progress * 100);
            return (progress === 0 ? 1 : progress)+ "%";
        }

        get progressBarStyleObject() {
            return {
                width: this.progress * 100 + "%"
            }
        }
    }
</script>

<style scoped lang="scss">
  .achievement {
    //background-image: linear-gradient(to right, #009cff, deepskyblue);
    background-color: deepskyblue;
    color: white;
    margin: .2rem 0;
    position: relative;
  }

  .achievement--unlocked {
    background-image: linear-gradient(to right, darkorange, #ffc967);
  }

  .achievement__content {
    // To show above progress bar
    position: relative;
    display: flex;
    flex-direction: row;
    padding: .2rem;
    font-weight: bold;
  }

  .achievement__id {
    width: 4rem;
    text-align: center;
    background-color: #1181ff;
    pointer-events: none;
  }

  .achievement--unlocked > * > .achievement__id {
    background-color: #ce7b00;
  }

  .achievement__name {
    // To show above progress bar
    position: relative;
    margin-left: .25rem;
    pointer-events: none;
    text-shadow: 0 0 .2rem #333333;
  }

  .achievement__progress-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .achievement__progress-bar {
    background-color: #009cff;
    position: absolute;
    height: 100%;
  }

  .achievement__progress-percents {
    position: absolute;
    height: 100%;
    width: 100%;
    text-align: right;
    font-size: 2rem;
    color: #009cff;
  }
</style>