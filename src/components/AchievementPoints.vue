<template>
  <span>
    <img class="shield-icon" /> {{amount}}
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
</style>