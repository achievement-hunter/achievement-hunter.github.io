<template>
  <span>
    <img src="assets/images/shield.png" class="shield-icon" /> {{amount}}
  </span>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";

    @Component
    export default class AchievementPoints extends Vue {
        @Prop() amount!: number;
    }
</script>

<style scoped lang="scss">
  .shield-icon {
    height: 1em;
    width: auto;
    transform: translateX(0.2em) translateY(0.15em);
  }
</style>