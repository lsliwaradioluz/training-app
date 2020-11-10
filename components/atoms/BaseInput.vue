<template>
  <div class="custom-input">
    <transition name="slide-to-left">
      <label class="label" v-show="(value && value.length > 0) || showLabel">
        {{ placeholder }}
      </label>
    </transition>
    <span
      v-if="icon"
      class="icon"
      :class="[`flaticon-${icon}`, { blind: disabled }]"
      @touchstart="revealPassword = true"
      @touchend="revealPassword = false"
    />
    <span
      v-if="showStatus && showTick"
      class="status flaticon-tick"
    />
    <button
      v-if="showClearBtn"
      class="status flaticon-cancel"
      type="button"
      @click="clearInput"
    />
    <input
      ref="input"
      class="input"
      :class="{ pl15: icon, blind: disabled }"
      :value="value"
      :placeholder="placeholder"
      :type="revealPassword && type == 'password' ? 'text' : type"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :spellcheck="spellcheck"
      @input="$emit('input', $event.target.value)"
      @blur="verifyInput"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
    },
    icon: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    type: {
      type: String,
      default: () => "text",
    },
    autocomplete: {
      type: String,
      default: () => "on",
    },
    spellcheck: {
      type: Boolean,
      default: () => false,
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
    },
    showClearBtn: {
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
    focus() {
      this.$refs.input.focus()
    },
    verifyInput() {
      this.value && this.value.length > 0
        ? (this.showTick = true)
        : (this.showTick = false)
    },
    clearInput() {
      this.$emit('input', '')
    }
  },
}
</script>

<style lang="scss" scoped>
.custom-input {
  position: relative;
  margin-bottom: 1rem;
  transition: margin 0.3s;
  color: color(text);
}

.label {
  position: absolute;
  top: -3px;
  font-weight: 500;
  font-size: 10px;
  color: color(faded);
}

.icon {
  font-size: 10px;
  position: absolute;
  top: 22px;
}

.status {
  font-size: 8px;
  position: absolute;
  top: 22px;
  right: 0;
  color: white;
}

.input {
  display: block;
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 0;
  padding-right: 1rem;
  font-size: 14px;
  height: 45px;
  transition: all 0.25s ease;
  color: color(text);
  border-bottom: 1px solid color(faded);
  word-break: break-word;
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-transition-delay: 9999s;
    transition-delay: 9999s;
  }
  &:focus {
    border-bottom: 1px solid color(headers);
  }
}
</style>
