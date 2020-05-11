<template>
  <div class="custom-textarea">
    <transition name="slide-to-left">
      <p class="custom-textarea__label" v-show="value && value.length > 0">{{ placeholder }}</p>
    </transition>
    <span 
      class="custom-textarea__icon" 
      :class="`flaticon-${icon}`" 
      @touchstart="revealPassword = true" 
      @touchend="revealPassword = false"
      v-if="icon">
    </span>
    <textarea
      :class="{ pl15: icon}"
      rows="2"
      ref="textarea"
      :placeholder="placeholder"
      spellcheck="false"
      :value="value"
      @input="$emit('input', $event.target.value)">
    </textarea>
  </div>
</template>

<script>
  export default {
    props: {
      icon: {
        type: String,
      },
      value: {
        type: String, 
      },
      placeholder: {
        type: String, 
      },
      spellcheck: {
        type: Boolean, 
        default: () => false
      }, 
      showStatus: {
        type: Boolean, 
        default: () => true, 
      },
    },
  }
</script>

<style lang="scss" scoped>

  .custom-textarea__label {
    font-weight: 500;
    font-size: 10px;
    color: color(faded);
    margin-bottom: 0;
  }

  .custom-textarea__icon {
    font-size: 14px;
    position: absolute;
    top: 24px;
  }

  textarea {
    border-bottom: 1px solid color(faded); 
    padding-bottom: 12px;
    padding-top: 12px;
    font-size: 14px;
    color: white;
    font-weight: 400;
  }

  textarea:focus {
    outline: none;
    border-bottom: 1px solid color(headers);
  }
</style>