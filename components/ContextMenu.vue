<template>
  <div class="context-menu">
    <div class="context-menu-wrapper">
      <button :id="[`trigger-button_${randomID}`]" type="button"  @click="showButtons = !showButtons">
        <slot name="trigger"></slot>
      </button>
      <transition name="roll">
        <div 
          class="context-menu__panel column"
          :style="{
            top: top && !bottom ? '0' : 'initial', 
            bottom: bottom ? '0' : 'initial',
            right: left && !right ? '120%' : 'initial',
            left: right ? '120%' : 'initial',
            transformOrigin: transformOrigin
          }"
          v-if="showButtons">
          <slot name="options"></slot>
        </div>
      </transition>
    </div>
  </div>  
</template>

<script>
  export default {
    props: {
      fromBottom: {
        type: Boolean, 
        default: () => true, 
      },
      left: {
        type: Boolean, 
        default: () => true, 
      }, 
      right: {
        type: Boolean, 
        default: () => false,
      }, 
      top: {
        type: Boolean, 
        default: () => true, 
      }, 
      bottom: {
        type: Boolean, 
        default: () => false,
      }
    },
    data() {
      return {
        showButtons: false,
        // we generate random ID for the trigger button
        randomID: Math.random().toString(36).substr(2, 9),
      }
    },
    computed: {
      transformOrigin() {
        const vertical = this.top && !this.bottom ? 'top' : 'bottom';
        const horizontal = this.left && !this.right ? 'right' : 'left';
        return `${vertical} ${horizontal}`;
      }
    },
    watch: {
      showButtons(value) {
        this.$emit('toggled', value);
      }
    },
    methods: {
      showEvent() {
        console.log(event);
      }
    },
    mounted() {
      window.addEventListener('click', () => {
        // if you click an element other than trigger button with given randomID, close the panel
        if (!event.target.offsetParent || event.target.offsetParent.id != `trigger-button_${this.randomID}`) {
          this.showButtons = false;
        }
      });
    }
  }
</script>

<style>
  
  .context-menu {
    margin-left: 1rem;
    display: flex;
    align-items: flex-start;
  }

  .context-menu-wrapper {
    position: relative;
  }

  .context-menu__panel {
    background-color: white;
    color: rgba(0, 0, 0, 0.774);
    border-radius: 5px;
    position: absolute;
    top: 0;
    padding: .125rem;
    padding-right: 3rem;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.233);
    z-index: 1000;
  }

  .context-menu__panel button,
  .context-menu__panel a {
    text-align: left;
    padding: 0.25rem;
    font-size: .75rem;
  }

  .context-menu__panel i {
    font-size: .75rem;
    margin-right: .25rem;
  }


  .roll-enter-active {
    animation: roll 0.2s;
    overflow: hidden;
  }

  @keyframes roll {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }
</style>