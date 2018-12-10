<template>
  <transition-group name="notification-list" class="notification-list" tag="div">
    <div v-for="notification in notifications" :key="notification.title" class="notification">
      <span class="notification__title">{{notification.title}}</span>
      <span class="notification__description">{{notification.description}}</span>
      <audio v-if="soundsOn" src="assets/sounds/click.mp3" autoplay />
    </div>
  </transition-group>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {GameEvent} from "../game/game-event";
    import {AchievementInfo} from "../game/achievement";
    import GameState from "../game/game-state";

    type NotificationViewModel = { title: string, description?: string };

    @Component
    export default class NotificationList extends Vue {
        notifications: NotificationViewModel[] = [];
        soundsOn = GameState.current.soundsOn;

        [GameEvent.ACHIEVEMENT_COMPLETED](ach: AchievementInfo) {
            this.addNotification(ach.data.name, ach.data.hint);
        }

        addNotification(title: string, description?: string) {
            this.notifications.push({
                title: title,
                description: description
            });
            setTimeout(() => this.notifications.shift(), 3000);
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
  .notification-list {
    display: flex;
    flex-direction: column-reverse;
    padding: .5rem;
    box-sizing: border-box;
    pointer-events: none;
  }

  .notification {
    display: flex;
    flex-direction: row;
    min-width: 50rem;
    max-width: 50rem;
    max-height: 2.3rem;
    background-image: linear-gradient(#6cb6ff, dodgerblue);
    color: white;
    padding: .2rem .5rem;
    align-items: baseline;
  }

  .notification__title {
    font-weight: bold;
    flex-grow: 1;
  }

  .notification__description {
    flex-shrink: 0;
    font-size: 1.2rem;
  }

  .notification-list-move {
    transition: transform 1s;
  }

  .notification-list-enter {
    max-height: 0;
  }

  .notification-list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .notification-list-enter-active, .notification-list-leave-active {
    transition: transform 1s, opacity 1s, max-height 0.2s;
  }

  .notification-list-leave-active {
    position: absolute;
  }
</style>