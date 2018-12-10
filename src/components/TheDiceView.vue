<template>
  <div class="the-dice-container">
    <button
        v-if="!rollerOn"
        :class="rollClassObject"
        @click="roll"
    >Roll</button>
    <div ref="dice" class="the-dice" />
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {GameEvent} from "../game/game-event";
    import GameState from "../game/game-state";
    import EventHub from "../event-hub";

    @Component
    export default class TheDiceView extends Vue {
        soundsOn = GameState.current.soundsOn;
        dice = GameState.current.dice;
        rollEnabled = true;
        rollerOn = GameState.current.diceRollerOn;
        rollTimeout = 0;

        roll() {
            if (!this.rollEnabled) return;
            rollADie({
                element: <HTMLElement>this.$refs.dice,
                numberOfDice: this.dice,
                callback: values => {
                    clearTimeout(this.rollTimeout);
                    EventHub.dispatch(GameEvent.THE_DICE_ROLL, values);
                    this.rollEnabled = false;
                    this.rollTimeout = setTimeout(() => {
                        this.rollEnabled = true;
                        if (this.rollerOn) {
                            this.roll();
                        }
                    }, 800);
                },
                delay: 1000000000,
                noSound: !this.soundsOn
            })
        }

        [GameEvent.SOUNDS_ON]() {
            this.soundsOn = true;
        }

        [GameEvent.SOUNDS_OFF]() {
            this.soundsOn = false;
        }

        [GameEvent.THE_DICE_NEW_DIE]() {
            this.dice++;
        }

        [GameEvent.THE_DICE_ROLLER_UNLOCKED]() {
            this.rollerOn = true;
            this.roll();
        }

        mounted() {
            if (this.rollerOn) {
                this.roll();
            }
        }

        destroyed() {
            clearTimeout(this.rollTimeout);
        }

        get rollClassObject() {
            return {
                "the-dice__roll": true,
                "the-dice__roll-disabled": !this.rollEnabled
            }
        }
    }
</script>

<style scoped lang="scss">
  .the-dice-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
  }

  .the-dice {
    height: 50%;
  }

  .the-dice__roll {
    background-color: darkviolet;
    border: .2rem solid black;
    border-radius: .4rem;
    color: white;
    font-size: 3rem;
    outline: none;
  }

  .the-dice__roll::-moz-focus-inner {
    border: 0;
  }

  .the-dice__roll:hover {
    background-color: violet;
  }

  .the-dice__roll-disabled {
    background-color: dimgray;
  }

  .the-dice__roll-disabled:hover {
    background-color: dimgray;
  }
</style>