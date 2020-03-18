<template>
  <div class="context-menu">
    <button type="button">
      <i class="flaticon-vertical-dots" :class="[`trigger-button_${randomID}`, { 'fs-09': smallIcon }]" @click="showButtons = !showButtons"></i>
    </button>
    <transition name="roll">
      <div class="context-menu__panel row" v-if="showButtons">
        <slot></slot>
      </div>
    </transition>
  </div>  
</template>

<script>
  export default {
    props: {
      smallIcon: {
        type: Boolean, 
        default: () => false
      }
    },
    data() {
      return {
        showButtons: false,
        // generate random ID for the trigger button
        randomID: Math.random().toString(36).substr(2, 9),
      }
    },
    mounted() {
      window.addEventListener('click', () => {
        // if you click an element other than trigger button with given randomID, close the panel
        if (!event.target.classList.contains(`trigger-button_${this.randomID}`)) {
          this.showButtons = false;
        }
      });
    }
  }
</script>

<style lang="scss" scoped>
  
  .context-menu {
    position: relative;
  }

  .context-menu__panel {
    background-color: white;
    border: 1px solid color(black);
    color: color(black);
    border-radius: 5px;
    position: absolute;
    right: 125%;
    top: 0;
    padding: 5px 2.5px;
  }
</style>