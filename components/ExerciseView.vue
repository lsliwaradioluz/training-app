<template>
  <div class="exercise-view column j-end" :style="{ backgroundImage: exercise.image ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${exercise.image.url}')` : 'none' }">
    <div class="p11">
      <div class="row j-between a-center">
        <div class="dupa">
          <MovingText>
            <h3 class="m00">{{ exercise.name }}</h3>
          </MovingText>
          <p class="m00 t-small">{{ exercise.alias }}</p>
        </div>
        <ContextMenu v-if="$store.state.auth.user.admin" bottom>
          <template v-slot:trigger>
            <i class="flaticon-vertical-dots"></i>
          </template>
          <template v-slot:options>
            <span>
              <button type="button" @click="showDescription = true" v-show="!showDescription">
                <i class="flaticon-up fs-09" style="margin-right: .25rem" />
                Rozwiń opis
              </button>
              <button type="button" @click="showDescription = false" v-show="showDescription">
                <i class="flaticon-down-arrow-1 fs-09" style="margin-right: .25rem" />
                Zwiń opis
              </button>
            </span>
            <nuxt-link tag="button" type="button" to="edit" append>
              <i class="flaticon-writing fs-09" style="margin-right: .25rem" />
              Edytuj
            </nuxt-link>
            <button type="button" @click="deleteExercise">
              <i class="flaticon-trash fs-09" style="margin-right: .25rem" />
              Usuń
            </button>
          </template>
        </ContextMenu>
        <button 
          class="exercise-view__arrow-button ml1" 
          :class="{ rotation: showDescription }" 
          type="button" 
          @click="showDescription = !showDescription"
          v-else>
          <i class="flaticon-down-arrow" />
        </button>
      </div>
      <transition name="accordion">
        <div class="mt1" v-show="showDescription">
          <p class="m00 t-small" v-if="exercise.description">{{ exercise.description }}</p>
          <p class="m00 t-small" v-else>To ćwiczenie nie ma jeszcze opisu. To znaczy, że Twój trener się obija i musisz go pogonić!</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>

  export default {
    props: {
      exercise: {
        type: Object,
        default: () => {
          return { name: '', technique: '' }
        }
      },
    },
    data() {
      return {
        client: this.$apollo.getClient(),
        showButtonsPanel: false,
        showDescription: true,
      }
    },
    methods: {
      async deleteExercise() {
        if (await this.$root.$confirm('Na pewno chcesz usunąć to ćwiczenie?')) {
          const input = {
            where: {
              id: this.exercise.id
            }
          }

          this.client.mutate({ mutation: deleteExercise, variables: { input: input } })
            .then(res => {
              this.$router.go(-1);
            });
        }
      }, 
    },
  }
</script>

<style lang="scss" scoped>

  .exercise-view {
    height: 100vh;
    overflow: hidden;
    background-size: cover;
    background-position: center;
  }

  .exercise-view__arrow-button {
    transition: transform 0.3s;
  }

  .rotation {
    transform: rotate(180deg);
  }

  .dupa {
    overflow: hidden;
  }

</style>