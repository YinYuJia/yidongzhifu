<template>
   <div class="edit-div"
         v-html="innerText"
         :placeholder="placeholder"
         :contenteditable="canEdit"
         @focus="isLocked = true"
         @blur="isLocked = false"
         @input="changeText">
    </div>
</template>
<script>
export default {
  name: 'editDiv',
  props: {
    value: {
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      required:true,
    }
  },
  data(){
    return {
      innerText: this.value,
      isLocked: false
    }
  },
  watch: {
    'value'(){
      if (!this.isLocked || !this.innerText) {
          this.innerText = this.value;
      }
    }
  },
  methods: {
    changeText(){
      this.$emit('input', this.$el.innerHTML,this.code);
    }
  }
};
</script>
<style scoped>
  .edit-div {
      width: 100%;
      height: 100%;
      overflow: auto;
      word-break: break-all;
      outline: none;
      user-select: text;
      white-space: pre-wrap;
      text-align: right;
    }
    .edit-div[contenteditable=true] {
        user-modify: read-write-plaintext-only;
    }
    .edit-div:empty::before {
        content: attr(placeholder);
    }
</style>
