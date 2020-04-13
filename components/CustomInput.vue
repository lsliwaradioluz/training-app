<template>
  <div class="custom-input">
    <transition name="slide-to-left">
      <label v-show="value && value.length > 0 || showLabel">{{ placeholder }}</label>
    </transition>
    <i 
      class="custom-input__icon" 
      :class="[`flaticon-${icon}`, { faded: disabled }]" 
      @touchstart="revealPassword = true" 
      @touchend="revealPassword = false"
      v-if="icon"></i>
    <i class="custom-input__status flaticon-check-mark" v-if="showStatus && showTick"></i>
    <input
      :class="{ pl15: icon, faded: disabled }"
      :value="value"
      :placeholder="placeholder"
      :type="revealPassword && type == 'password' ? 'text' : type" 
      :autocomplete="autocomplete"
      :disabled="disabled"
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
      disabled: {
        type: Boolean, 
        default: () => false,
      }, 
      showStatus: {
        type: Boolean, 
        default: () => true, 
      },
      showLabel: {
        type: Boolean, 
        default: () => false,
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
    margin-bottom: 1rem;
    transition: margin 0.3s;
    color: color(text);
    label {
      position: absolute;
      top: -3px;
      font-weight: 500;
      font-size: 10px;
      color: color(faded);
    }
  }

  .custom-input__icon {
    font-size: 10px;
    position: absolute;
    top: 22px;
  }

  .custom-input__status {
    font-size: 8px;
    position: absolute;
    top: 22px;
    right: 0;
    color: white;
  }

  input {
    display: block;
    width: 100%;
    padding-top: .5rem;
    padding-bottom: 0;
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    transition: all .25s ease;
    color: color(text);
    border-bottom: 1px solid color(faded);
  }

  input:focus {
    border-bottom: 1px solid color(headers);
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active  {
    -webkit-transition-delay: 9999s;
    transition-delay: 9999s;
  }
</style>