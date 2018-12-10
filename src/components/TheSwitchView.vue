import {GameEvent} from "../game/game-event";
<template>
  <div class="the-switch-container">
    <div :class="switchClassObject" @click="handleClick" />
    <audio ref="onSound" src="assets/sounds/lights-on.mp3" />
    <audio ref="offSound" src="assets/sounds/lights-off.mp3" />
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import GameState from "../game/game-state";
    import {GameEvent} from "../game/game-event";
    import EventHub from "../event-hub";

    @Component
    export default class TheSwitchView extends Vue {
        isOn = GameState.current.lightsOn;
        soundsOn = GameState.current.soundsOn;

        [GameEvent.THE_SWITCH_SWITCH]() {
            this.isOn = GameState.current.lightsOn;
        }

        handleClick() {
            const isOn = !this.isOn;
            this.isOn = isOn;
            GameState.current.lightsOn = isOn;
            EventHub.dispatch(GameEvent.THE_SWITCH_SWITCH, isOn);
            if (!this.soundsOn) return;
            const audio = <HTMLAudioElement>(isOn ? this.$refs.onSound : this.$refs.offSound);
            audio.play();
        }

        get switchClassObject() {
            return {
                "the-switch": true,
                "the-switch--off": !this.isOn
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
  .the-switch-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .the-switch {
    display: block;
    position: relative;
    width: 70px;
    height: 100px;
    margin: 70px auto;

    border-radius: 50px;
    background: linear-gradient(#e6e3da, white);
    border: 1px solid rgba(0, 0, 0, 0.1);

    box-shadow:
        inset 0 7px 0 #fdfdfd,
        0 2px 3px rgba(170, 160, 140, 0.3);

    cursor: pointer;
  }

  .the-switch:before {
    content: "";
    position: absolute;
    top: -10px; bottom: -10px;
    left: -5px; right: -5px;
    z-index: -1;

    background: #f2f1ed;
    border-radius: inherit;

    box-shadow:
        0 1px 1px rgba(174, 163, 145, 0.2),
        0 3px 3px rgba(170, 160, 140, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.8),
        0 0 5px rgba(170, 160, 140, 0.5);
  }

  .the-switch:after {
    content: "";
    position:absolute;
    width: 60px;
    height: 70px;
    border-radius: 50%;
    z-index: -1;
    left: 18px;
    top: 10px;
    background: linear-gradient(160deg, rgba(170, 160, 140, 0.7), rgba(170, 160, 140, 0));
    -webkit-filter: blur(1px);
  }

  .the-switch--off {
    background: linear-gradient(#f7f6f4, #fff);
    box-shadow:
        inset 0 -5px 0 #dbd3c8,
        0 6px 5px rgba(170, 160, 140, 0.75),
        3px 16px 5px rgba(170,160,140, 0.3);
    border-bottom: none;
  }
</style>