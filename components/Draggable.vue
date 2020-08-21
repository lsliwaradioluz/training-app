<template>
  <div ref="dragContainer">
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      touchStart: null,
      moveCount: 0,
      movingElement: null,
      movingElementSiblings: null,
      nextSibling: null,
      previousSibling: null,
    };
  },
  methods: {
    setUpEventListener() {

    },
    animateElement(element) {
      element.style.transition = `transform .3s`;
      setTimeout(() => {
        element.style.transition = `none`;
      }, 300);
    },
    onTouchStart(elementindex, type) {
      console.log(event.target)
      // document.querySelector("body").style.overflow = "hidden";
      // this.touchStart = event.touches[0].screenY;
      // this.$emit("dragstart");

      // this.movingElement = event.target.closest(`.${type}`);
      // this.movingElementSiblings = this.movingElement.parentNode.children;
      // this.nextSibling = this.movingElementSiblings[elementindex + 1];
      // this.previousSibling = this.movingElementSiblings[elementindex - 1];
    },
    onTouchMove(elementindex) {
      // const movingElementTop = this.movingElement.getBoundingClientRect().top;
      // const movingElementBottom =
      //   movingElementTop + this.movingElement.getBoundingClientRect().height;
      // let nextSiblingBottom, previousSiblingTop;

      // const setSiblings = () => {
      //   if (this.moveCount > 0) {
      //     this.nextSibling = this.movingElementSiblings[
      //       elementindex + 1 + this.moveCount
      //     ];
      //     this.previousSibling = this.movingElementSiblings[
      //       elementindex + this.moveCount
      //     ];
      //   } else if (this.moveCount == 0) {
      //     this.nextSibling = this.movingElementSiblings[elementindex + 1];
      //     this.previousSibling = this.movingElementSiblings[elementindex - 1];
      //   } else if (this.moveCount < 0) {
      //     this.nextSibling = this.movingElementSiblings[
      //       elementindex + this.moveCount
      //     ];
      //     this.previousSibling = this.movingElementSiblings[
      //       elementindex - 1 + this.moveCount
      //     ];
      //   }
      // };

      // if (this.nextSibling) {
      //   nextSiblingBottom =
      //     this.nextSibling.getBoundingClientRect().top +
      //     this.nextSibling.getBoundingClientRect().height;
      // }

      // if (this.previousSibling) {
      //   previousSiblingTop = this.previousSibling.getBoundingClientRect().top;
      // }

      // const moveLength = event.touches[0].screenY - this.touchStart;
      // this.movingElement.style.transform = `translateY(${moveLength}px)`;

      // if (this.nextSibling && movingElementBottom >= nextSiblingBottom) {
      //   this.animateElement(this.nextSibling);
      //   const nextSiblingTransform = this.nextSibling.style.transform;
      //   if (nextSiblingTransform) {
      //     this.nextSibling.style.transform = "";
      //   } else {
      //     this.nextSibling.style.transform = `translateY(${
      //       nextSiblingTransform - this.movingElement.offsetHeight
      //     }px)`;
      //   }
      //   this.moveCount++;
      //   setSiblings();
      // }

      // if (this.previousSibling && movingElementTop <= previousSiblingTop) {
      //   this.animateElement(this.previousSibling);
      //   const previousSiblingTransform = this.previousSibling.style.transform;
      //   if (previousSiblingTransform) {
      //     this.previousSibling.style.transform = "";
      //   } else {
      //     this.previousSibling.style.transform = `translateY(${
      //       previousSiblingTransform + this.movingElement.offsetHeight
      //     }px)`;
      //   }
      //   this.moveCount--;
      //   setSiblings();
      // }
    },
    onTouchEnd(elementIndex, elementType, parentIndex) {
    //   document.querySelector("body").style.overflow = "auto";
    //   for (let sibling of this.movingElementSiblings) {
    //     sibling.style.transform = "";
    //   }
    //   if (this.moveCount != 0) {
    //     this.$emit("dragend", {
    //       elementIndex,
    //       moveCount: this.moveCount,
    //       type: elementType,
    //       parentIndex,
    //     });
    //   } else {
    //     this.animateElement(this.movingElement);
    //   }
    //   this.moveCount = 0;
    //   this.movingElement = null;
    //   this.movingElementSiblings = null;
    //   this.nextSibling = null;
    //   this.previousSibling = null;
    },
  },
};
</script>

<style lang="scss" scoped></style>
