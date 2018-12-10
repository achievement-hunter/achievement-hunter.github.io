<template>
  <div class="the-button-view__container">
    <button
        class="the-button"
        @click="handleClick"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
    />
    <audio ref="downSound" src="assets/sounds/button-down.mp3" />
    <audio ref="upSound" src="assets/sounds/button-up.mp3" />
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {GameEvent} from "../game/game-event";
    import EventHub from "../event-hub";
    import GameState from "../game/game-state";

    @Component
    export default class TheButtonView extends Vue {
        soundsOn = GameState.current.soundsOn;

        handleClick() {
            EventHub.dispatch(GameEvent.THE_BUTTON_CLICK);
        }

        handleMouseEnter() {
            EventHub.dispatch(GameEvent.THE_BUTTON_MOUSE_ENTER);
        }

        handleMouseLeave() {
            EventHub.dispatch(GameEvent.THE_BUTTON_MOUSE_LEAVE);
        }

        handleMouseDown() {
            EventHub.dispatch(GameEvent.THE_BUTTON_MOUSE_DOWN);
            if (this.soundsOn) {
                (<HTMLAudioElement>this.$refs.downSound).play();
            }
        }

        handleMouseUp() {
            EventHub.dispatch(GameEvent.THE_BUTTON_MOUSE_UP);
            if (this.soundsOn) {
                (<HTMLAudioElement>this.$refs.upSound).play();
            }
        }

        [GameEvent.SOUNDS_ON]() {
            this.soundsOn = true;
        }

        [GameEvent.SOUNDS_OFF]() {
            this.soundsOn = false;
        }
    }
</script>

<style scoped lang="scss">
  .the-button-view__container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .the-button {
    width: 15rem;
    height: 15rem;
    outline: none;
    background-color: red;
    color: darkred;
    border: .1rem solid gray;
    border-radius: 50%;
    box-shadow: inset 0 0 1rem 0, -0.25rem 0.5rem 0rem 0rem #999;
  }

  .the-button::-moz-focus-inner {
    border: 0;
  }

  .the-button:hover {
    box-shadow: inset 0 0 2rem 0, -0.25rem 0.5rem 0rem 0rem #999;
  }

  .the-button:active {
    box-shadow: inset 0 0 2rem 0, -0.1rem 0.2rem 0rem 0rem #666;
    transform: translateX(-0.2rem) translateY(0.3rem);
  }
</style>