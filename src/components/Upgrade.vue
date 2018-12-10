<template>
  <img
      :src="imageSrc"
      class="upgrade"
      @click="handleClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
  >
</template>

<script lang="ts">
    import {Component, Inject, Prop, Vue} from "vue-property-decorator";
    import {UpgradeInfo} from "../game/upgrade";
    import {TooltipViewModel} from "./tooltip-view-model";
    import {GameEvent} from "../game/game-event";

    @Component
    export default class Upgrade extends Vue {
        @Prop() id!: number;
        @Inject() tooltip!: TooltipViewModel;

        hover = false;

        get upgrade() {
            return new UpgradeInfo(this.id);
        }

        get imageSrc() {
            return `assets/images/upgrades/${this.id}.png`
        }

        handleClick() {
            if (this.upgrade.purchase()) {
                this.clearTooltip();
            }
        }

        handleMouseEnter() {
            this.hover = true;
            let tooltip = this.tooltip;
            let upgrade = this.upgrade.data;
            tooltip.visible = true;
            tooltip.name = upgrade.name;
            tooltip.amount = upgrade.cost;
            tooltip.amountError = !this.upgrade.isAffordable;
            tooltip.details = upgrade.description;
        }

        handleMouseLeave() {
            this.clearTooltip();
        }

        clearTooltip() {
            this.hover = false;
            this.tooltip.visible = false;
            this.tooltip.amountError = false;
        }

        [GameEvent.ACHIEVEMENT_POINTS_CHANGED]() {
            if (this.hover) {
                this.tooltip.amountError = !this.upgrade.isAffordable;
            }
        }
    }
</script>

<style scoped lang="scss">
  .upgrade {
    width: 5rem;
    height: 5rem;
  }
</style>