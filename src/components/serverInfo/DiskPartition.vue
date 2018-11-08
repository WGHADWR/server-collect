<template>
  <div class="disk-info">
    <h3>Disk Partitions</h3>
    <div class="item-part" v-for="(item, index) in info" :key="index" v-if="item.fstype">
      <p>
        <label>{{item.device}}</label>&nbsp;&nbsp;
        <span>Total: {{item.usage.total}}GB, Free: {{item.usage.free}}GB, {{item.usage.percent}}%</span>
        &nbsp;&nbsp;&nbsp;<span>{{item.fstype}}</span>
      </p>
      <Progress :value="item.usage.percent" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Progress from '@/components/progress/Progress.vue';

@Component({
  components: {
    Progress,
  },
})
export default class DiskPartition extends Vue {

  @Prop({type: Array, default: () => []})
  private data: any;

  get info() {
    const disks = (this.data || []).map((item: any, index: number) => {
      let { usage = {} } = item;
      if (!usage) {
        usage = {};
      }
      const {total = 0, used = 0, free = 0, percent = 0} = usage;
      usage = {
        total: (total / 1024 / 1024 / 1024).toFixed(1),
        used: (used / 1024 / 1024 / 1024).toFixed(1),
        free: (free / 1024 / 1024 / 1024).toFixed(1),
        percent,
      };
      return {
        ...item,
        usage,
      };
    });
    return disks;
  }

}
</script>
<style lang="scss">
.disk-info {
  font-size: 1rem;
  .item-part {
    margin-bottom: 1rem;
  }
  h3 {
    margin-top: 0;
  }
  p {
    margin: 3px 0;
  }
}
</style>
