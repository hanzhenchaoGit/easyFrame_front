<template>
    <el-table-column v-if="column.type" :type="column.type">
    </el-table-column>
    <el-table-column v-else
    :prop="column.prop"
    :column-key="column.columnKey"
    :label="column.label"
    :fixed="column.fixed"
    :width="column.width"
    :render-header="column.renderHeader"
    :sortable="column.sortable"
    :sort-method="column.method"
    :resizable="column.resizable"
    :formatter="column.formatter"
    :show-overflow-tooltip="column.showOverflowTooltip"
    :align="column.align"
    :header-align="column.headerAlign || column.align"
    :class-name="column.className"
    :label-class-name="column.labelClassName"
    :selectable="column.selectable"
    :reserve-selection="column.reserveSelection"
    :filters="column.filters"
    :filter-placement="column.filterPlacement"
    :filter-multiple="column.filterMultiple"
    :filter-method="column.filterMethod"
    :filtered-value="column.filteredValue"
    >
  <template v-if="column.children">
    <c-column v-for="(item, index) in column.children"
      :key="index"
      :column="item"></c-column>
  </template>
  <template v-slot:default="slotProps">
    <span v-if="column.filter">
      {{ Vue.filter(column['filter'])(slotProps.row[column.prop]) }}
    </span>
    <span v-else-if="column.slotName">
      <slot :name="column.slotName" :row="slotProps.row" :$index="slotProps.$index" />
    </span>
    <span v-else>
      {{ column.render ? column.render(slotProps.row) : slotProps.row[column.prop] }}
    </span>
  </template>
  </el-table-column>
</template>

<script>
  import props from './props'
  import Vue from 'vue'
  export default {
    name: 'c-column',
    props,
    data() {
      return {
        singleSelect: ''
      }
    },
    computed: {
      newSlotScope() {
        return Number(Vue.version.replace(/\./g, '')) >= 250
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
