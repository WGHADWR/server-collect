<template>
  <div class="server-info">
    <div class="info-wrapper">
    <h3>Memory</h3>
    <p><label>Total: </label>{{mem['total']}} GB</p>
    <p><label>Available: </label>{{mem['available']}} GB</p>
    <p><label>Used: </label>{{mem['used']}} GB</p>
    <p><label>Percent: </label>{{mem['percent']}} %</p>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { ServerInfoService } from '@/services/ServerInfoService';

@Component
export default class ServerInfo extends Vue {

  @Prop({ type: Object, default: () => {} })
  private data: any;

  private memory: any = {};

  get mem() {
    const { mem: { total = 0, available = 0, used = 0, percent = 0.0 } = {} } = this.data;
    return {
      total: (total / 1024 / 1024 / 1024).toFixed(1),
      available: (available / 1024 / 1024 / 1024).toFixed(1),
      used: (used / 1024 / 1024 / 1024).toFixed(1),
      percent,
    };
  }

  // @Watch('data', { deep: true })
  // public memInfo(oldValue: any, newValue: any) {
  // }
}
</script>
<style lang="scss" scoped>
.server-info {
  color: #aaa;
  height: 100%;
  overflow: hidden;
  font-size: 1rem;

  .info-wrapper {
    padding: 15px;
  }
  h3 {
    margin: 0px 0 10px 0;
    font-size: 1rem;
  }
  p label {
    display: inline-block;
    width: 80px;
  }
}
</style>
