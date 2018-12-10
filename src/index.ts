import Vue from "vue";
import App from "./components/App.vue";
import Game from "./game/game";
import GameState from "./game/game-state";
import {Achievements} from "./game/achievement";
import {GameEvent} from "./game/game-event";
import EventHub from "./event-hub";

Vue.mixin({
    created(): void {
        const events = Object.values(GameEvent);
        for (let key in this) {
            if (this.hasOwnProperty(key) && events.includes(key)) {
                // @ts-ignore
                let handler = this[key];
                EventHub.ui.on(<GameEvent>key, (...args: any[]) => handler(...args), this);
            }
        }
    },
    destroyed(): void {
        EventHub.ui.offAll(this);
    }
});

const firstPlay = !GameState.load();

const v = new Vue({
    el: "#app",
    template: `<app :tooltip="tooltip" />`,
    data: {
        tooltip: {
            visible: false,
            name: "",
            details: "Test",
            amount: 0,
            amountError: false
        }
    },
    components: {
        App
    }
});

window.onload = () => {
    const game = new Game();
    if (firstPlay) {
        game.start();
    }
    else {
        Achievements.subscribeUnlocked();
        EventHub.dispatch(GameEvent.PAGE_RELOAD)
    }
    game.run();
};
