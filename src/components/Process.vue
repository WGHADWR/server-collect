<template>
  <div class="process">
    <table class="table-proc">
      <thead>
        <tr>
          <th style="width: 45px;">#</th>
          <th style="width: 225px;">Name</th>
          <th style="width: 145px;">PId</th>
          <th style="width: 145px;">Mem(MB)</th>
          <th class="proc-exe">Command</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in dataList" :key="index">
          <td class="td-c">{{index + 1}}</td>
          <td>{{data.name}}</td>
          <td class="td-c">{{data.pid}}</td>
          <td class="td-c">{{data.mem_usage}}</td>
          <td class="proc-exe">{{data.exe}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { AppConfig } from '@/config/AppConfig';

@Component
export default class Process extends Vue {

  private dataList: any[] = [];

  public mounted() {
    this.renderProcess();
  }

  public refresh(): void {
    this.renderProcess();
  }

  private async renderProcess() {
    const dataList = await this.getData();
    dataList.map((item: any, index: number) => {
      const { memory_info = [] } = item;
      const memUsage = Math.round((memory_info[0] || 0) / 1024 / 1024);
      item.mem_usage = memUsage;
    });
    this.dataList = dataList;
  }

  private async getData() {
    const url = AppConfig.ServerURL + '/server/info?action=get_process';
    const response = await fetch(url);
    return await response.json();
  }
}
</script>
<style lang="scss" scoped>
.process {
  color: #aaa;
  .table-proc {
    width: 100%;
    border-collapse: collapse;
  }
  .table-proc tr td,
  .table-proc tr th {
    border: 1px solid #555;
    padding: 8px;
    word-break: break-all;
  }
  .table-proc tbody tr td {
    font-size: .7rem;
  }
  .table-proc .td-c {
    text-align: center;
  }
}

@media screen and (max-width: 1024px) {
  .table-proc {
    .proc-exe {
       display: none;
    }
  }
}
</style>
