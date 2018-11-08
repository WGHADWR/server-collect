<template>
  <div class="progress">
    <div class="inner" :style="{width: value + '%'}"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Progress extends Vue {

  @Prop({ type: Number, default: () => 0})
  private value: any;

}
</script>
<style lang="scss" scoped>
.progress {
  height: 3px;
  background: #4a4a4a;
  // border-radius: 5px;
  overflow: hidden;

  .inner {
    width: 0;
    height: 100%;
    background: #5c778a;
  }
}
</style>
