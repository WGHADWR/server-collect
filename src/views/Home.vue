<template>
  <div class="home container-fluid">
    <div class="item-header"><h1>Server Status</h1></div>
    <div class="container-charts">
      <div class="row">
        <div class="col-12">
          <div class="item-header"><h3 class="item-title">Resource Usage</h3>
            <div class="item-header-plot">
              <button v-if="!!websocket" class="btn" @click="closeSocket">Disconnect</button>
              <button v-if="!websocket" class="btn" @click="connect">Connect</button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          <div class="chart-timeline item-container"><div id="chart-cpu-usage" class="chart-container"></div></div>
        </div>
        <div class="col-3">
          <div class="chart-timeline item-container"><div id="chart-mem-usage" class="chart-container"></div></div>
        </div>
        <div class="col-3"><ServerInfo v-bind:data="serverInfo" class="item-serverinfo item-container" /></div>
        <div class="col-3">
          <div class="item-container item-serverinfo">
            <div class="item-wrapper">
              <DiskPartition v-bind:data="serverInfo['disk_info']" class="item-partitions" /></div>
            </div>
          </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="item-header"><h3 class="item-title">Processes</h3>
            <div class="item-header-plot">
              <button class="btn" @click="refreshProces">Refresh</button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <Process ref="process" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import echarts from 'echarts';

import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import Process from '@/components/serverInfo/Process.vue';
import ServerInfo from '@/components/serverInfo/ServerInfo.vue';
import DiskPartition from '@/components/serverInfo/DiskPartition.vue';

import { AppConfig } from '@/config/AppConfig';
import { ServerInfoService } from '@/services/ServerInfoService';

@Component({
  components: {
    HelloWorld,
    Process,
    ServerInfo,
    DiskPartition,
  },
})
export default class Home extends Vue {

  private socket: any = null;
  private chartCpuUsage: any;
  private chartMemUsage: any;
  private timelineOptions: any = {
    title: '',
    seriesName: '',
  };

  private serverInfo: any = {};

  get websocket() {
    return this.socket;
  }

  set websocket(socket) {
    this.socket = socket;
  }

  get disks() {
    return [];
  }

  public mounted() {
    window.onresize = () => this.resize();
    this.chartCpuUsage = this.createTimelineChart('chart-cpu-usage', { title: 'CPU Usage', seriesName: 'CPU' });
    this.chartMemUsage = this.createTimelineChart('chart-mem-usage', { title: 'MEM Usage', seriesName: 'MEM' });
    this.connect();

    this.getServerInfo();
  }

  public beforeDestroy() {
    if (this.socket) {
      console.log('Close websocket connect.');
      this.socket.close();
    }
    window.onresize = null;
  }

  private resize() {
    if (this.chartCpuUsage) {
      this.chartCpuUsage.resize();
    }
    if (this.chartMemUsage) {
      this.chartMemUsage.resize();
    }
  }

  private connect() {
    this.websocket = new WebSocket(AppConfig.WebSocketURL + '/ws/server/status');
    this.socket.onopen = (ev: any) => {
      // socket.send(JSON.stringify({'connect: ': (new Date()).getTime()}));
      this.socket.send(JSON.stringify({action: 'GetStatus', items: ['CPU', 'MEM']}));
    };
    this.socket.onmessage = (ev: any) => {
      // console.log('Recive message:');
      const data = JSON.parse(ev.data);
      // console.log(data);
      this.onMessageHandler(data);
    };
    this.socket.onclose = (ev: any) => {
      // console.log('Connect closed.');
      // console.log(ev);
    };
    this.socket.onerror = (ev: any) => {
      console.log(ev);
      this.socket = null;
    };
  }

  private onMessageHandler(message: any) {
    const { CPU, MEM } = message;
    // this.serverInfo = {
    //   mem: MEM,
    // };
    if (MEM) {
      this.$set(this.serverInfo, 'mem', MEM.value);
    }
    if (CPU && this.chartCpuUsage) {
      this.addCpuUsageChartData(CPU);
    }
    if (MEM && this.chartMemUsage) {
      this.addMemUsageChartData(MEM);
    }
  }

  private closeSocket(): void {
    if (this.socket) {
      console.log('Close socket connect.');
      this.socket.close();
      this.socket = undefined;
    }
  }

  private refreshProces() {
    (this.$refs.process as any).refresh();
  }

  private async getServerInfo() {
    this.serverInfo = await ServerInfoService.getServerInfo();
  }

  private addCpuUsageChartData(data: any) {
    const value: any = data.value;
    data = { ...data, value: Math.round(value) };
    this.addTimelineChartData(this.chartCpuUsage, data);
  }

  private addMemUsageChartData(data: any) {
    const value = Math.round(data.value.percent);
    data = { ...data, value };
    this.addTimelineChartData(this.chartMemUsage, data);
  }

  private createTimelineChart(el: string, options: any = {}) {
    const settings = { ...this.timelineOptions, ...options };
    const option: any = {
      title: {
        text: settings.title,
        textStyle: {
          color: '#AAA',
          fontSize: 14,
        },
        top: 10,
      },
      backgroundColor: '#2c343c',
      textStyle: {
        color: 'rgba(255, 255, 255, 0.3)',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any[]) => {
          const data: any = params[0];
          const date = data.value[0];
          return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ': ' + data.value[1];
        },
        axisPointer: {
          animation: false,
        },
      },
      grid: {
        top: 50,
        left: 35,
        right: 30,
        bottom: 35,
      },
      xAxis: {
        type: 'time',
        axisLine: {
          lineStyle: {
            color: '#666',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#666',
          },
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        boundaryGap: [0, '100%'],
        axisLine: {
          lineStyle: {
            color: '#666',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#666',
          },
        },
      },
      series: [{
        name: settings.seriesName,
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        lineStyle: {
          color: '#E74C3C',
          width: 1,
        },
        areaStyle: {
          color: 'rgba(231, 76, 60, 0.4)',
        },
        data: [],
      }],
    };

    const chart = echarts.init(document.getElementById(el) as any);
    chart.setOption(option, true);
    return chart;
  }

  private addTimelineChartData(chart: any, data: any) {
    const { title = [], series = [] } = chart.getOption();

    const titleText = title[0].text.split(' - ')[0];
    const datas = series[0].data;

    let time = data.time.split(' ');
    const date = time[0].split('-');
    time = time[1].split(':');
    const y = parseInt(date[0], 10);
    const m = parseInt(date[1], 10) - 1;
    const d = parseInt(date[2], 10);
    const h = parseInt(time[0], 10);
    const mi = parseInt(time[1], 10);
    const s = parseInt(time[2], 10);
    const datetime = new Date(y, m, d, h, mi, s);
    const cdata = {
      name: data.time,
      value: [
        datetime,
        data.value,
      ],
    };
    if (datas.length >= 60) {
      datas.shift();
    }
    datas.push(cdata);
    chart.setOption({
      title: {
        text: titleText + ' - ' + data.value + '%',
      },
      series: [{
        data: datas,
      }],
    });
  }

}
</script>
<style lang="scss" scoped>
.home {
  position: relative;

  .item-container {
    height: 240px;
    overflow: hidden;
  }

  .item-header {
    position: relative;
    color: #AEAEAE;
    .item-title {
      margin: 0.5rem 0;
    }

    .item-header-plot {
      position: absolute;
      top: 3px;
      right: 0px;
    }
  }

  .item-wrapper {
    padding: 10px;
  }

  .item-serverinfo {
    background: #2c343c;
    color: #aaa;
  }
  .btn {
    padding: 5px 7px;
    border: 0;
    background: #34495E;
    color: #aaa;
  }
}
.container-charts {
  .chart-timeline {
    .chart-container {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style lang="scss">
.item-partitions {
  div {
    font-size: 12px;
  }
}
</style>

