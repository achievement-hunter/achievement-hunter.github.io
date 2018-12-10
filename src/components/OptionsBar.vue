import {GameEvent} from "../game/game-event";
import {GameEvent} from "../game/game-event";
import {GameEvent} from "../game/game-event";
import {GameEvent} from "../game/game-event";
<template>
  <div class="options-bar" @mouseleave="handleBarMouseLeave">
    <div class="options-icons">
      <img
          src="assets/images/gear.svg"
          :class="gearClassObject"
          @mouseenter="handleGearMouseEnter"
      />
      <transition name="options-icons__save">
        <img
            v-if="saveVisible"
            src="assets/images/save.svg"
            class="options-icons__save"
        />
      </transition>
    </div>
    <transition name="options-popover">
      <div v-if="popoverVisible" class="options-popover">
        <button @click="save">
          <img src="assets/images/save.svg">
        </button>
        <button @click="toggleSound">
          <img :src="soundIcon">
        </button>
        <button @click="hardReset">
          <img src="assets/images/reload.svg">
        </button>
        <a
            href="https://github.com/achievement-hunter/achievement-hunter.github.io"
            target="_blank"
            rel="noopener noreferrer"
            @click="openRepoLink"
        >
          <img src="assets/images/github.svg">
        </a>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {GameEvent} from "../game/game-event";
    import EventHub from "../event-hub";
    import GameState from "../game/game-state";

    @Component
    export default class OptionsBar extends Vue {
        saveVisible = false;
        hideTimeout = 0;
        popoverVisible = false;
        soundsOn = GameState.current.soundsOn;

        [GameEvent.SAVE]() {
            clearTimeout(this.hideTimeout);
            this.saveVisible = true;
            this.hideTimeout = setTimeout(() => this.saveVisible = false, 1000);
        }

        handleGearMouseEnter() {
            EventHub.dispatch(GameEvent.OPTIONS_OPENED);
            this.popoverVisible = true;
        }

        handleBarMouseLeave() {
            this.popoverVisible = false;
        }

        get gearClassObject() {
            return {
                "options-icons__gear": true,
                "options-icons__gear--rotating": this.popoverVisible,
            }
        }

        save() {
            GameState.save();
        }

        hardReset() {
            GameState.hardReset();
        }

        [GameEvent.SOUNDS_ON]() {
            this.soundsOn = true;
        }

        [GameEvent.SOUNDS_OFF]() {
            this.soundsOn = false;
        }

        toggleSound() {
            const gameState = GameState.current;
            gameState.soundsOn = !gameState.soundsOn;
            EventHub.dispatch(gameState.soundsOn ? GameEvent.SOUNDS_ON : GameEvent.SOUNDS_OFF);
        }

        get soundIcon() {
            return `assets/images/sound-${this.soundsOn ? "on" : "off"}.svg`
        }

        openRepoLink() {
            EventHub.dispatch(GameEvent.OPEN_REPO_LINK);
        }
    }
</script>

<style scoped lang="scss">
  .options-bar {
    display: flex;
    flex-direction: column;
    padding: .2rem;
  }

  .options-icons {
    display: flex;
    flex-direction: row;
  }

  .options-icons > * {
    margin: .3rem;
    width: 2.4rem;
    height: 2.4rem;
  }

  .options-icons__gear { }

  .options-icons__gear--rotating {
    animation: options-icons__gear 4s linear infinite;
  }

  @keyframes options-icons__gear {
    100% { transform: rotate(360deg); }
  }

  .options-icons__save {
    transition: opacity 1s;
  }

  .options-icons__save-enter, .options-icons__save-leave-to {
    opacity: 0;
  }

  .options-popover {
    display: flex;
    flex-direction: row;
    padding: .3rem;
    margin-top: .3rem;
    border: .2rem solid;
    border-radius: 0.3rem;
    background-color: #a0ffa8;
    transition: max-height 0.2s ease-out, opacity 0.2s ease-out;
    max-height: 5.4rem;
    overflow: hidden;
  }

  .options-popover-enter, .options-popover-leave-to {
    max-height: 0;
    opacity: 0;
  }

  .options-popover > * {
    margin: .2rem;
    width: 4rem;
    height: 4rem;
    background-color: transparent;
    border: none;
    outline: none;
    transition: background-color 0.2s;
    border-radius: .2rem;
    padding: .3rem;
    box-sizing: border-box;
    cursor: default;
  }

  .options-popover > * > * {
    width: 3.4rem;
    height: 3.4rem;
  }

  .options-popover > *::-moz-focus-inner {
    border: 0;
  }

  .options-popover > *:hover {
    background-color: #00b400;
  }

  .options-popover > *:active {
    background-color: #00d700;
  }

  .options-popover__save {
    background-image: url("/assets/images/save.svg");
  }
</style>