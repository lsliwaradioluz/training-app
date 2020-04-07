<template>
  <div class="custom-input">
    <transition name="slide-to-left">
      <span class="t-green" v-show="value && value.length > 0">{{ placeholder }}</span>
    </transition>
    <span class="row j-between">
      <i 
        class="custom-input__icon" 
        :class="`flaticon-${icon}`" 
        @touchstart="revealPassword = true" 
        @touchend="revealPassword = false"></i>
      <span v-if="showStatus">
        <em v-if="!showTick">(wymagane)</em>
        <i class="custom-input__check flaticon-check-mark t-green" v-else></i>
      </span>
    </span>
    <input
      :value="value"
      :placeholder="placeholder"
      :type="revealPassword ? 'text' : type" 
      :autocomplete="autocomplete"
      :spellcheck="spellcheck"
      @input="$emit('input', $event.target.value)"
      @blur="verifyInput">
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
      type: {
        type: String, 
        default: () => 'text'
      }, 
      autocomplete: {
        type: String, 
        default: () => 'on'
      }, 
      spellcheck: {
        type: Boolean, 
        default: () => false
      }, 
      showStatus: {
        type: Boolean, 
        default: () => true, 
      }
    }, 
    data() {
      return {
        showTick: false,
        revealPassword: false,
      }
    }, 
    methods: {
      verifyInput() {
        this.value && this.value.length > 0 ? this.showTick = true : this.showTick = false;
      }
    }
  }
</script>

<style lang="scss" scoped>

  .custom-input {
    position: relative;
  }

  span:first-child {
    position: absolute;
    top: -3px;
    font-weight: 500;
    font-size: 10px;
  }

  .custom-input__icon, 
  .custom-input__check,
  em {
    font-size: 10px;
    position: absolute;
    top: 22px;
  }

  em {
    right: 0;
    opacity: 0.3;
  }

  .custom-input__check {
    right: 0;
    color: color(grass);
  }

  input {
    background-color: transparent;
    border: none;
    outline: 0;
    display: block;
    width: 100%;
    border-bottom: 1px solid rgba(230, 230, 230, 0.08);
    border-radius: 0;
    padding-left: 30px;
    padding-bottom: 0;
    font-size: 13px;
    height: 50px;
    line-height: 50px;
    transition: all .25s ease;
  }

  input:focus {
    border-bottom: 1px solid white;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active  {
    -webkit-transition-delay: 9999s;
    transition-delay: 9999s;
  }
</style>