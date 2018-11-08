<template>
  <div class="server-info">
    <div class="info-wrapper">
      <h3>CPU & Memory</h3>
      <div class="item-inner">
        <div class="item-info cpu-info">
          <p><label>CPU Count: </label><span>{{cpu['cpu_count']}}</span></p>
          <p><label>Logical Count: </label><span>{{cpu['cpu_logical_count']}}</span></p>
          <p><label>Max Freq: </label><span>{{cpu.cpu_freq.max}} GHZ</span></p>
        </div>
        <div class="item-info mem-info">
          <p><label>Total: </label><span>{{mem['total']}} GB</span></p>
          <p><label>Available: </label><span>{{mem['available']}} GB</span></p>
          <p><label>Used: </label><span>{{mem['used']}} GB</span></p>
          <p><label>Percent: </label><span>{{mem['percent']}} %</span></p>
        </div>
      </div>
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
    const { mem: {total = 0, available = 0, used = 0, percent = 0.0} = {} } = this.data || {};
    return {
      total: (total / 1024 / 1024 / 1024).toFixed(1),
      available: (available / 1024 / 1024 / 1024).toFixed(1),
      used: (used / 1024 / 1024 / 1024).toFixed(1),
      percent,
    };
  }

  get cpu() {
    const data = this.data['cpu_info'] || {};
    const cpu_freq = { ...(data.cpu_freq || { max: 0 })};
    if (cpu_freq.max) {
      cpu_freq.max = (cpu_freq.max / 1000).toFixed(2);
    }
    return { ...data, cpu_freq };
  }

  @Watch('data', { deep: true })
  public memInfo(oldValue: any, newValue: any) {
    console.log(JSON.stringify(newValue));
  }
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

    h3 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
    }
    .item-inner {
      display: flex;
    }
    .item-info {
      flex: 1;
      font-size: 12px;

      p {
        display: flex;
        margin: 0 0 1.5rem 0;
        span {
          flex: 1;
          display: inline-block;
          text-align: right;
        }
      }
    }
    .cpu-info {
      padding-right: 15px;
    }
    .mem-info {
      border-left: 1px solid #434343;
      padding-left: 15px;
      flex: none;
      width: 47%;
    }

    @media screen and (min-width: 1440px) {
      .mem-info {
        flex: 1;
        width: auto;
      }
    }
  }
}

</style>
