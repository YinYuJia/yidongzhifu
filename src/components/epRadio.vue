<template>
  <div class="mint-radiolist" @change="$emit('change', currentValue)">
    <label class="mint-radiolist-title" v-text="title"></label>
    <x-cell v-for="option in options" :key="options.value">
      <img slot="icon" :src="option.imgUrl" width="24" height="24">
      <label class="mint-radiolist-label" slot="title">
        <span
          :class="{'is-right': align === 'right'}"
          class="mint-radio">
          <input
            class="mint-radio-input"
            type="radio"
            v-model="currentValue"
            :disabled="option.disabled"
            :value="option.value || option">
          <span class="mint-radio-core"></span>
        </span>
        <span class="mint-radio-label" v-text="option.label || option"></span>
      </label>
    </x-cell>
  </div>
</template>

<script>
  import XCell from 'mint-ui/packages/cell/index.js';
  if (process.env.NODE_ENV === 'component') {
    require('mint-ui/packages/cell/style.css');
  }
  /**
   * mt-radio
   * @module components/radio
   * @desc 单选框列表，依赖 cell 组件
   *
   * @param {string[], object[]} options - 选项数组，可以传入 [{label: 'label', value: 'value', disabled: true}] 或者 ['ab', 'cd', 'ef']
   * @param {string} value - 选中值
   * @param {string} title - 标题
   * @param {string} [align=left] - checkbox 对齐位置，`left`, `right`
   *
   * @example
   * <mt-radio v-model="value" :options="['a', 'b', 'c']"></mt-radio>
   */
  export default {
    name: 'ep-radio',
    props: {
      title: String,
      align: String,
      options: {
        type: Array,
        required: true
      },
      defaultVal: String
    },
    data() {
      return {
        currentValue: 1   //默认值
      };
    },
    watch: {
      value(val) {
        this.currentValue = val;
      },

      currentValue(val) {
        this.$emit('input', val);
      }
    },
    components: {
      XCell
    }
  };
</script>

<style lang="css">
  label.mint-radiolist-label{
    display: inline;
  }
  .mint-radiolist-title{
    font-size: 16px;
    margin-left:0;
    padding-left:3%;
    color:#000;
  }
</style>
