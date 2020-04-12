<template>
  <div class="custom-textarea">
    <transition name="slide-to-left">
      <span class="custom-textarea__label" v-show="textareaValue && textareaValue.length > 0">{{ placeholder }}</span>
    </transition>
    <i 
      class="custom-textarea__icon" 
      :class="`flaticon-${icon}`" 
      @touchstart="revealPassword = true" 
      @touchend="revealPassword = false"
      v-if="icon">
    </i>
    <span 
      class="custom-textarea__placeholder" 
      :class="{ pl15: icon }" 
      v-show="!textareaValue"
      @click="focusTextarea">{{ placeholder }}
    </span>
    <p
      ref="textarea"
      :class="{ pl15: icon }"
      spellcheck="false" 
      contenteditable="true"
      @input="onTextInput">
    </p>
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
      autocomplete: {
        type: String, 
        default: () => 'off'
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
    data() {
      return {
        textareaValue: this.value,
      }
    }, 
    methods: {
      focusTextarea() {
        this.$refs.textarea.focus();
      },
      onTextInput() {
        this.textareaValue = event.target.innerText;
        this.$emit('type', this.textareaValue);
      }
    }
  }
</script>

<style lang="scss" scoped>
  
  .custom-textarea {
    position: relative;
  }

  .custom-textarea__label {
    position: absolute;
    top: -3px;
    font-weight: 500;
    font-size: 10px;
    color: #74B9F5;
  }

  .custom-textarea__icon {
    font-size: 14px;
    position: absolute;
    top: 24px;
  }

  .custom-textarea__placeholder {
    opacity: .3;
    font-size: 13px;
    position: absolute;
    top: 22px;
    z-index: 0;
  }

  p {
    border-bottom: 1px solid #74B9F5; 
    padding-bottom: 12px;
    padding-top: 20px;
    font-size: 13px;
  }

  p:focus {
    outline: none;
    border-bottom: 1px solid white;
  }
</style>