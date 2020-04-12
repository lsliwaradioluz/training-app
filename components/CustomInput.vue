<template>
  <div class="custom-input" :class="{ mt1: value && value.length > 0 && type != 'time' && type != 'date' }">
    <transition name="slide-to-left">
      <label v-show="value && value.length > 0 || showLabel">{{ placeholder }}</label>
    </transition>
    <i 
      class="custom-input__icon" 
      :class="[`flaticon-${icon}`, { faded: disabled }]" 
      @touchstart="revealPassword = true" 
      @touchend="revealPassword = false"
      v-if="icon"></i>
    <span class="custom-input__status" v-if="showStatus">
      <em v-if="!showTick">(wymagane)</em>
      <i class="flaticon-check-mark" v-else></i>
    </span>
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
    label {
      position: absolute;
      top: -3px;
      font-weight: 500;
      font-size: 10px;
      color: #74B9F5;
    }
  }

  .custom-input__icon {
    font-size: 10px;
    position: absolute;
    top: 22px;
  }

  .custom-input__status {
    font-size: 10px;
    position: absolute;
    top: 22px;
    right: 0;
    em {
      color: #74B9F5;
    }
    i {
      font-size: 10px;
    }
  }

  input {
    background-color: transparent;
    border: none;
    outline: 0;
    display: block;
    width: 100%;
    border-bottom: 1px solid #74B9F5; 
    border-radius: 0;
    padding-bottom: 0;
    padding-left: 0;
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