<template>
  <div class="home">
    <div class="tool-bar">
      <button v-if="!!websocket" @click="closeSocket">Disconnect</button>
      <button v-if="!websocket" @click="connect">Connect</button>
    </div>
    <div class="item-header"><h1>Server Status</h1></div>
    <div class="container-charts">
      <div id="chart-cpu-usage" class="chart-timeline"></div>
      <div id="chart-mem-usage" class="chart-timeline"></div>
      <div class="item-header"><h3>Processes</h3></div>
      <Process />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import echarts from 'echarts';

import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import Process from '@/components/Process.vue';
import { AppConfig } from '@/config/AppConfig';

@Component({
  components: {
    HelloWorld,
    Process,
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

  get websocket() {
    return this.socket;
  }

  set websocket(socket) {
    this.socket = socket;
  }

  public mounted() {
    this.chartCpuUsage = this.createTimelineChart('chart-cpu-usage', { title: 'CPU Usage', seriesName: 'CPU' });
    this.chartMemUsage = this.createTimelineChart('chart-mem-usage', { title: 'MEM Usage', seriesName: 'MEM' });
    this.connect();
  }

  public beforeDestroy() {
    if (this.socket) {
      console.log('Close websocket connect.');
      this.socket.close();
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
    };
  }

  private onMessageHandler(message: any) {
    const { CPU, MEM } = message;
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

  private addCpuUsageChartData(data: any) {
    const value: any = data.value;
    data = { ...data, value: Math.round(value) };
    this.addTimelineChartData(this.chartCpuUsage, data);
  }

  private addMemUsageChartData(data: any) {
    const value = Math.round(data.value[2]);
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

  .item-header {
    color: #AEAEAE;
  }
}
.container-charts {
  .chart-timeline {
    height: 240px;
    margin: 0 0 15px 0;
  }
}
.tool-bar {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 10;

  button {
    padding: 5px 7px;
    border: 0;
    background: #34495E;
    color: #aaa;
  }
}
</style>

