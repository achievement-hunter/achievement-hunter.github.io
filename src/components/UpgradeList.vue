<template>
  <div :class="classObject">
    <div class="upgrade-list__list">
      <upgrade
          v-for="id in upgrades"
          :key="id"
          :id="id"
      />
    </div>
  </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import Upgrade from "./Upgrade.vue";
    import {Upgrades} from "../game/upgrade";
    import {GameEvent} from "../game/game-event";

    @Component({
        components: {
            Upgrade
        }
    })
    export default class UpgradeList extends Vue {
        private visibilityTimeout = -1;
        isVisible = Upgrades.unlockedIds.length > 0;
        upgrades = Upgrades.unlockedIds;

        [GameEvent.UPGRADE_UNLOCKED]() {
            this.updateUnlockedUpgrades();
        }

        [GameEvent.UPGRADE_PURCHASED]() {
            this.updateUnlockedUpgrades();
        }

        updateUnlockedUpgrades() {
            this.upgrades = Upgrades.unlockedIds;
            if (this.upgrades.length > 0) {
                this.isVisible = true;
                clearTimeout(this.visibilityTimeout);
            }
            else {
                this.visibilityTimeout = setTimeout(() => {
                    this.isVisible = false;
                }, 500);
            }
        }

        get classObject() {
            return {
                "upgrade-list": true,
                "upgrade-list--hidden": !this.isVisible
            };
        }
    }
</script>

<style scoped lang="scss">
  .upgrade-list {
    display: flex;
    flex-direction: column;
    width: 8rem;
    transition: transform .5s;
  }

  .upgrade-list--hidden {
    transform: translateX(10rem);
  }

  .upgrade-list__list {
    display: flex;
    flex-direction: column;
    background: darkslateblue;
    align-items: center;
    padding: 1rem;
    flex-grow: 1;
  }

  .upgrade-list__list > * {
    margin-top: 1rem;
  }

  .upgrade-list__list > *:first-child {
    margin-top: 0;
  }
</style>