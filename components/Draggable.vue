<template>
  <div
    class="draggable"
    ref="draggable"
    @touchstart="onStart"
    @touchmove="onMove"
    @touchend="onEnd"
    @mousedown="onStart"
    @mousemove="onMove"
    @mouseup="onEnd"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array, 
    }, 
    button: {
      type: String,
    }
  },
  data() {
    return {
      touchStart: null,
      verticalMoveLength: 0, 
      horizontalMoveLength: 0,
      moveCount: 0,
      movingElement: null,
      movingElementIndex: null,
      movingElementSiblings: null,
      nextSibling: null,
      previousSibling: null,
      mousedown: false,
    };
  },
  methods: {
    animateElement(element) {
      element.style.transition = `transform .3s`;
      setTimeout(() => {
        element.style.transition = ``;
      }, 300);
    },
    moveElement() {
      const valueCopy = [...this.value]
      const element = valueCopy[this.movingElementIndex]
      const newElementIndex = this.movingElementIndex + this.moveCount
      valueCopy.splice(this.movingElementIndex, 1)
      valueCopy.splice(newElementIndex, 0, element)
      this.$emit("input", valueCopy)
    },
    deleteElement() {
      const valueCopy = [...this.value]
      valueCopy.splice(this.movingElementIndex, 1)
      this.movingElement.style.transform = `translateX(-500px)`
      setTimeout(() => {
        this.$emit("input", valueCopy)
      }, 300)
    },
    setSiblings() {
      if (this.moveCount > 0) {
        this.nextSibling = this.movingElementSiblings[
          this.movingElementIndex + 1 + this.moveCount
        ];
        this.previousSibling = this.movingElementSiblings[
          this.movingElementIndex + this.moveCount
        ];
      } else if (this.moveCount == 0) {
        this.nextSibling = this.movingElementSiblings[this.movingElementIndex + 1];
        this.previousSibling = this.movingElementSiblings[this.movingElementIndex - 1];
      } else if (this.moveCount < 0) {
        this.nextSibling = this.movingElementSiblings[
          this.movingElementIndex + this.moveCount
        ];
        this.previousSibling = this.movingElementSiblings[
          this.movingElementIndex - 1 + this.moveCount
        ];
      }
    },
    onStart() {
      if (this.button && !event.target.classList.contains(this.button)) {
        return
      } 

      if (event.target == this.$refs.draggable) {
        return
      } else {
        this.movingElement = event.target.closest(".draggable > *")
        this.movingElement.classList.add('moving')
      }

      
      document.querySelector("html").style.overflow = "hidden";
      if (event.type == "touchstart") {
        this.touchStart = { vertical: event.touches[0].screenY, horizontal: event.touches[0].screenX } ;
      } else {
        this.touchStart = { vertical: event.screenY, horizontal: event.screenX }
        this.mousedown = true
      }

      this.movingElementSiblings = this.$refs.draggable.children;
      for (let i = 0; i < this.movingElementSiblings.length; i++) {
        if (this.movingElement == this.movingElementSiblings[i]) {
          this.movingElementIndex = i
        }
      }
      this.nextSibling = this.movingElementSiblings[this.movingElementIndex + 1];
      this.previousSibling = this.movingElementSiblings[this.movingElementIndex - 1];
      this.$emit("dragging")
    },
    onMove() {
      if (!this.movingElement) {
        return
      }
      const movingElementTop = this.movingElement.getBoundingClientRect().top;
      const movingElementBottom =
        movingElementTop + this.movingElement.getBoundingClientRect().height;
      let nextSiblingBottom, previousSiblingTop;

      if (this.nextSibling) {
        nextSiblingBottom =
          this.nextSibling.getBoundingClientRect().top +
          this.nextSibling.getBoundingClientRect().height;
      }
      if (this.previousSibling) {
        previousSiblingTop = this.previousSibling.getBoundingClientRect().top;
      }


      if (event.type == "touchmove") {
        this.verticalMoveLength = event.touches[0].screenY - this.touchStart.vertical;
        this.horizontalMoveLength = event.touches[0].screenX - this.touchStart.horizontal
      } else if (event.type == "mousemove" && this.mousedown == true) {
        this.verticalMoveLength = event.screenY - this.touchStart.vertical
        this.horizontalMoveLength = event.screenX - this.touchStart.horizontal
      }

      this.movingElement.style.transform = `translate(${this.horizontalMoveLength < 0 ? this.horizontalMoveLength : 0}px, ${this.verticalMoveLength}px)`;
      
      if (this.nextSibling && movingElementBottom >= nextSiblingBottom) {
        this.animateElement(this.nextSibling);
        const nextSiblingTransform = this.nextSibling.style.transform;
        if (nextSiblingTransform) {
          this.nextSibling.style.transform = "";
        } else {
          this.nextSibling.style.transform = `translateY(${
            nextSiblingTransform - this.movingElement.offsetHeight
          }px)`;
        }
        this.moveCount++;
        this.setSiblings();
      }

      if (this.previousSibling && movingElementTop <= previousSiblingTop) {
        this.animateElement(this.previousSibling);
        const previousSiblingTransform = this.previousSibling.style.transform;
        if (previousSiblingTransform) {
          this.previousSibling.style.transform = "";
        } else {
          this.previousSibling.style.transform = `translateY(${
            previousSiblingTransform + this.movingElement.offsetHeight
          }px)`;
        }
        this.moveCount--;
        this.setSiblings();
      }
    },
    onEnd() {  
        if (!this.movingElement) {
          return
        }

        for (let sibling of this.movingElementSiblings) {
          sibling.style.transform = "";
        }

        if (this.horizontalMoveLength < -100) {
          this.animateElement(this.movingElement);
          this.deleteElement()
        } else if (this.moveCount != 0) {
          this.moveElement()
        } else {
          this.animateElement(this.movingElement);
        }

        this.moveCount = 0;
        this.movingElement.classList.remove("moving")
        this.movingmovingElementIndex = null;
        this.movingElement = null
        this.movingElementSiblings = null;
        this.nextSibling = null;
        this.previousSibling = null;
        document.querySelector("html").style.overflow = "auto";
    },
  },
};
</script>

<style lang="scss" scoped>
.draggable {
  display: flex;
  flex-direction: column;
}

.moving {
  transition: box-shadow .3s;
  box-shadow: 3px 3px 10px black;
}
</style>
