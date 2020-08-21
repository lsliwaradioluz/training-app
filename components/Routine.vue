<template>
  <article class="routine" :class="{ 'routine--expanded': editor }">
    <section class="header">
      <h3>{{ section.name }}</h3>
      <aside>
        <slot name="section-buttons" />
      </aside>
    </section>
    <div class="complexes">
      <section
        v-for="(complex, complexindex) in section.complexes"
        :key="complexindex"
        class="complex"
        :class="{
          mb05: complexindex != section.complexes.length - 1,
          blind: currentComplex != null && currentComplex != complexindex,
        }"
      >
        <div class="complex__header">
          <h5 class="complex__header__name">{{ complex.name }}</h5>
          <aside class="complex__header__buttons">
            <!-- <button
              v-if="editor && section.complexes.length > 1"
              class="flaticon-arrows"
              type="button"
              @touchstart="onTouchStart(complexindex, 'complex')"
              @touchmove="onTouchMove(complexindex)"
              @touchend="onTouchEnd(complexindex, 'complex')"
            /> -->
            <div
              v-on="
                editor
                  ? {
                      touchstart: onTouchStart.bind(
                        this,
                        complexindex,
                        'complex'
                      ),
                      touchmove: onTouchMove.bind(this, complexindex),
                      touchend: onTouchEnd.bind(this, complexindex, 'complex'),
                    }
                  : {}
              "
            >
              <slot
                name="complex-buttons"
                :complex="complex"
                :complexindex="complexindex"
              />
            </div>
          </aside>
        </div>
        <div class="units">
          <div
            v-for="(unit, unitindex) in complex.units"
            :key="unitindex"
            class="unit"
          >
            <div>
              <p class="unit__exercise-name">{{ unit.exercise.name }}</p>
              <ul>
                <li>{{ setsAndReps(unit) }}</li>
                <li v-if="unit.remarks">{{ unit.remarks }}</li>
                <li class="t-faded" v-if="unit.rest">
                  Odpoczywaj {{ unit.rest }}s
                </li>
                <li class="t-faded" v-else>Bez odpoczynku</li>
                <li class="unit__feedback" v-if="unit.feedback">
                  {{ unit.feedback }}
                </li>
              </ul>
            </div>
            <aside class="unit__buttons">
              <div
                v-on="
                  editor
                    ? {
                        touchstart: onTouchStart.bind(this, unitindex, 'unit'),
                        touchmove: onTouchMove.bind(this, unitindex),
                        touchend: onTouchEnd.bind(
                          this,
                          unitindex,
                          'unit', 
                          complexindex
                        ),
                      }
                    : {}
                "
              >
                <slot
                  name="unit-buttons"
                  :unit="unit"
                  :unitindex="unitindex"
                  :complex="complex"
                  :complexindex="complexindex"
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
    <section v-if="section.complexes.length == 0">
      <p class="m00">
        Brak ćwiczeń w tej sekcji.
      </p>
    </section>
  </article>
</template>

<script>
export default {
  props: {
    section: {
      type: Object,
    },
    currentComplex: {
      type: Number,
    },
    editor: {
      type: Boolean,
      default: () => false,
    },
  },
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
    setsAndReps(unit) {
      let setsAndReps = unit.sets;
      if (unit.reps) setsAndReps += `x${unit.reps}`;
      if (unit.time) setsAndReps += `x${unit.time}s`;
      if (unit.distance) setsAndReps += `x${unit.distance}m`;
      return setsAndReps;
    },
    animateElement(element) {
      element.style.transition = `transform .3s`;
      setTimeout(() => {
        element.style.transition = `none`;
      }, 300);
    },
    onTouchStart(elementindex, type) {
      document.querySelector("html").style.overflow = "hidden";
      this.touchStart = event.touches[0].screenY;
      this.$emit("dragstart");

      this.movingElement = event.target.closest(`.${type}`);
      this.movingElementSiblings = this.movingElement.parentNode.children;
      this.nextSibling = this.movingElementSiblings[elementindex + 1];
      this.previousSibling = this.movingElementSiblings[elementindex - 1];
    },
    onTouchMove(elementindex) {
      const movingElementTop = this.movingElement.getBoundingClientRect().top;
      const movingElementBottom =
        movingElementTop + this.movingElement.getBoundingClientRect().height;
      let nextSiblingBottom, previousSiblingTop;

      const setSiblings = () => {
        if (this.moveCount > 0) {
          this.nextSibling = this.movingElementSiblings[
            elementindex + 1 + this.moveCount
          ];
          this.previousSibling = this.movingElementSiblings[
            elementindex + this.moveCount
          ];
        } else if (this.moveCount == 0) {
          this.nextSibling = this.movingElementSiblings[elementindex + 1];
          this.previousSibling = this.movingElementSiblings[elementindex - 1];
        } else if (this.moveCount < 0) {
          this.nextSibling = this.movingElementSiblings[
            elementindex + this.moveCount
          ];
          this.previousSibling = this.movingElementSiblings[
            elementindex - 1 + this.moveCount
          ];
        }
      };

      if (this.nextSibling) {
        nextSiblingBottom =
          this.nextSibling.getBoundingClientRect().top +
          this.nextSibling.getBoundingClientRect().height;
      }

      if (this.previousSibling) {
        previousSiblingTop = this.previousSibling.getBoundingClientRect().top;
      }

      const moveLength = event.touches[0].screenY - this.touchStart;
      this.movingElement.style.transform = `translateY(${moveLength}px)`;

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
        setSiblings();
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
        setSiblings();
      }
    },
    onTouchEnd(elementIndex, elementType, parentIndex) {
      document.querySelector("html").style.overflow = "auto";
      for (let sibling of this.movingElementSiblings) {
        sibling.style.transform = "";
      }
      if (this.moveCount != 0) {
        this.$emit("dragend", {
          elementIndex,
          moveCount: this.moveCount,
          type: elementType,
          parentIndex,
        });
      } else {
        this.animateElement(this.movingElement);
      }
      this.moveCount = 0;
      this.movingElement = null;
      this.movingElementSiblings = null;
      this.nextSibling = null;
      this.previousSibling = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.routine {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-bottom: 25px;
}

.routine--expanded {
  min-height: 200px;
  padding-bottom: 60px;
}

.header {
  display: flex;
  justify-content: space-between;
  h3 {
    margin: 0 0 1rem 0;
  }
  button {
    margin-left: 1rem;
  }
  * {
    color: color(headers);
  }
}

.complex__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 4px 0;
}

.complex__header__name {
  color: color(headers);
  margin: 0;
  font-size: 20px;
}

.complex__header__buttons {
  display: flex;
  justify-content: flex-end;
  // margin-left: 1rem;
  button {
    font-size: 14px;
  }
}

.unit {
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.unit__buttons {
  display: flex;
  margin-left: 1rem;
  button,
  a {
    font-size: 14px;
  }
}

.unit__exercise-name {
  margin: 0;
}

.unit__feedback {
  color: #5c946e;
}
</style>
