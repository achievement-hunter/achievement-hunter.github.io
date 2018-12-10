<template>
  <div class="app">
    <notification-list class="app__notification__list" />
    <options-icons class="app__notification__options-icons" />
    <div class="app__game-mechanic-container">
      <div :class="backgroundClassObject" />
      <transition name="app__fade-in" mode="out-in">
        <component :is="mechanicComponent" class="app__game-mechanic" />
      </transition>
      <transition name="app__fade-in">
        <div
            v-if="unlockedMechanics.length > 0"
            :class="mechanicNameClassObject"
        >
          <span
              v-if="unlockedMechanics.length > 1"
              class="arrow arrow-left"
              @click="previousMechanic"
          />
          <div class="app__game-mechanic-title">{{mechanicName}}</div>
          <span
              v-if="unlockedMechanics.length > 1"
              class="arrow arrow-right"
              @click="nextMechanic"
          />
        </div>
      </transition>
      <tooltip class="app__tooltip" />
    </div>
    <div class="app__sidebar">
      <upgrade-list class="app__upgrade-list" />
      <achievement-list class="app__achievement-list" />
    </div>
    <audio v-if="musicOn" src="assets/sounds/titerman.mp3" autoplay loop />
  </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue} from "vue-property-decorator";
    import UpgradeList from "./UpgradeList";
    import AchievementList from "./AchievementList";
    import TheButtonView from "./TheButtonView.vue";
    import {GameEvent} from "../game/game-event";
    import Tooltip from "./Tooltip.vue";
    import NotificationList from "./NotificationList.vue";
    import OptionsIcons from "./OptionsBar.vue";
    import GameState from "../game/game-state";
    import {GameMechanic} from "../game/game-mechanic";
    import TheDiceView from "./TheDiceView.vue";
    import TheSwitchView from "./TheSwitchView.vue";

    @Component({
        components: {
            NotificationList,
            OptionsIcons,
            TheButtonView,
            TheDiceView,
            TheSwitchView,
            Tooltip,
            UpgradeList,
            AchievementList
        }
    })
    export default class AppDecorator extends Vue {
        @Prop() @Provide() tooltip!: any;

        lightsOn = GameState.current.lightsOn;
        musicOn = GameState.current.musicOn;
        unlockedMechanics = GameState.current.unlockedMechanics.slice();
        currentMechanic = GameMechanic.THE_BUTTON;

        [GameEvent.GAME_MECHANIC_UNLOCKED](value: GameMechanic) {
            this.unlockedMechanics.push(value);
            this.currentMechanic = value;
        }

        get mechanicComponent() {
            if (this.unlockedMechanics.length === 0) return "";
            switch (this.currentMechanic) {
                case GameMechanic.THE_BUTTON: return "the-button-view";
                case GameMechanic.THE_DICE: return "the-dice-view";
                case GameMechanic.THE_SWITCH: return "the-switch-view";
            }
            return "";
        }

        get mechanicName() {
            if (this.unlockedMechanics.length === 0) return "";
            switch (this.currentMechanic) {
                case GameMechanic.THE_BUTTON: return "The Button";
                case GameMechanic.THE_DICE: return "The Dice";
                case GameMechanic.THE_SWITCH: return "The Switch";
            }
            return "";
        }

        nextMechanic() {
            const mechanics = this.unlockedMechanics;
            const currentIndex = mechanics.indexOf(this.currentMechanic);
            const nextIndex = currentIndex === mechanics.length - 1 ? 0 : currentIndex + 1;
            this.currentMechanic = mechanics[nextIndex];
        }

        previousMechanic() {
            const mechanics = this.unlockedMechanics;
            const currentIndex = mechanics.indexOf(this.currentMechanic);
            const nextIndex = currentIndex === 0 ? mechanics.length - 1 : currentIndex - 1;
            this.currentMechanic = mechanics[nextIndex];
        }

        [GameEvent.MUSIC_ON]() {
            this.musicOn = true;
        }

        [GameEvent.MUSIC_OFF]() {
            this.musicOn = false;
        }

        [GameEvent.THE_SWITCH_SWITCH](value: boolean) {
            this.lightsOn = value;
        }

        get backgroundClassObject() {
            return {
                "app__background": true,
                "app__background--dark": !this.lightsOn
            }
        }

        get mechanicNameClassObject() {
            return {
                "app__game-mechanic-name": true,
                "app__game-mechanic-name--light": !this.lightsOn
            }
        }
    }
</script>

<style scoped lang="scss">

  .app {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
  }

  .app__notification__options-icons {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
  }

  .app__notification__list {
    position: fixed;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 10;
  }

  .app__game-mechanic-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .app__background {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: -1;
  }

  .app__background--dark {
    background-color: dimgray;
  }

  .app__game-mechanic-name {
    flex-shrink: 0;
    margin-bottom: 2rem;
    font-size: 4rem;
    pointer-events: none;
    color: black;
    border-color: black;
    display: flex;
    flex-direction: row;
  }

  .app__game-mechanic-title {
    min-width: 30rem;
    text-align: center;
  }

  .app__game-mechanic-name--light {
    color: whitesmoke;
    border-color: whitesmoke;
  }

  .app__tooltip {
    position: absolute;
    top: 1rem;
    right: 0;
    transform: translateX(-10rem);
  }

  .app__game-mechanic {
    flex-grow: 1;
  }

  .app__fade-in-enter-active {
    transition: opacity .5s;
  }

  .app__fade-in-enter {
    opacity: 0;
  }

  .app__sidebar {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .app__upgrade-list {
    position: absolute;
    left: -8rem;
    top: 0;
    height: 100%;
    box-shadow: -.3rem 0 .5rem 0 rgba(0, 0, 0, 0.5);
  }

  .app__achievement-list {
    flex-grow: 1;
    box-shadow: -.4rem 0 1rem 0 rgba(0, 0, 0, 0.75);
  }

  .arrow {
    border: solid;
    border-width: 0 1rem 1rem 0;
    display: inline-block;
    padding: 1rem;
    pointer-events: auto;
    width: 1rem;
    height: 1rem;
  }

  .arrow-right {
    transform: rotate(-45deg);
  }

  .arrow-left {
    transform: rotate(135deg);
  }
</style>