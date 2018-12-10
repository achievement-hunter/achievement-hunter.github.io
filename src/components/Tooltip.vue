<template>
  <div v-if="tooltip.visible" class="tooltip">
    <div class="tooltip__header">
      <span class="tooltip__name">{{tooltip.name}}</span>
      <achievement-points
          :amount="tooltip.amount"
          :amountError="tooltip.amountError"
          :class="amountClassObject"
      />
    </div>
    <span class="tooltip__details">{{tooltip.details}}</span>
  </div>
</template>

<script lang="ts">
    import {Vue, Component, Inject} from "vue-property-decorator";
    import AchievementPoints from "./AchievementPoints.vue";
    import {TooltipViewModel} from "./tooltip-view-model";

    @Component({
        components: {
            AchievementPoints
        }
    })
    export default class Tooltip extends Vue {
        @Inject() tooltip!: TooltipViewModel;

        get amountClassObject() {
            return {
                "tooltip__amount": true,
                "tooltip__amount-error": this.tooltip.amountError
            }
        }
    }
</script>

<style scoped lang="scss">
  .tooltip {
    color: black;
    background-color: aliceblue;
    border: .1rem solid lightgray;
    padding: .5rem;
    border-radius: .2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tooltip__header {
    display: flex;
    flex-direction: row;
  }

  .tooltip__name {
    font-size: 1.8rem;
    font-weight: bold;
  }

  .tooltip__amount {
    margin-left: 0.8rem;
    font-weight: bold;
  }

  .tooltip__amount-error {
    color: red;
  }

  .tooltip__details {
    font-size: 1.2rem;
    font-style: italic;
  }
</style>