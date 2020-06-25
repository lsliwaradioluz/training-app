<template>
  <div class="base-textarea">
    <transition name="slide-to-left">
      <p class="label" v-show="value && value.length > 0 && showLabel">
        {{ placeholder }}
      </p>
    </transition>
    <span
      v-if="icon"
      class="icon"
      :class="`flaticon-${icon}`"
      @touchstart="revealPassword = true"
      @touchend="revealPassword = false"
    />
    <textarea
      ref="textarea"
      class="textarea"
      :class="{ pl15: icon }"
      :rows="rows"
      :placeholder="placeholder"
      spellcheck="false"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
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
      default: () => false,
    },
    showStatus: {
      type: Boolean,
      default: () => true,
    },
    showLabel: {
      type: Boolean,
      default: () => true,
    },
    rows: {
      type: Number,
      default: () => 3,
    },
  },
  methods: {
    focus() {
      this.$refs.textarea.focus()
    },
  },
}
</script>

<style lang="scss" scoped>
.label {
  font-weight: 500;
  font-size: 10px;
  color: color(faded);
  margin-bottom: .5rem;
}

.icon {
  font-size: 14px;
  position: absolute;
  top: 24px;
}

.textarea {
  border-bottom: 1px solid color(faded);
  padding-bottom: 12px;
  padding-top: 12px;
  font-size: 14px;
  color: white;
  font-weight: 400;
}

.textarea:focus {
  outline: none;
  border-bottom: 1px solid color(headers);
}
</style>
