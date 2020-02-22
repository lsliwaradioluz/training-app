<template>
<div class="feedback tab column j-center" :class="{ pb0: editFeedback }">
  <div class="row j-between">
    <div class="feedback__text">
      <p class="m00" v-if="!editFeedback && feedback">{{ feedback | shortenText }}</p>
      <textarea
        class="invisible--input"
        v-model="feedback" 
        ref="textarea"
        :rows="editFeedback ? 3 : 1"
        spellcheck="false" 
        placeholder="Dodaj wiadomość"
        :disabled="!editFeedback"
        v-else></textarea>
    </div>
    <div class="row a-center pl1" v-if="!editFeedback">
      <i class="flaticon-vertical-dots t-green" @click="editFeedback ? closeTextarea() : openTextarea()"></i>
    </div>
  </div>
  <transition name="accordion"> 
    <div class="feedback__panel row mt05 t-green t-small" v-if="editFeedback">
      <button type="button" @click="sendFeedback">Zapisz</button>
      <button type="button" @click="closeTextarea">Wróć</button>
    </div>
  </transition>
</div>
</template>

<script>
  import updateWorkout from '~/apollo/mutations/updateWorkout.gql';

  export default {
    props: ['workout'], 
    data() {
      return {
        feedback: this.workout.feedback,
        client: this.$apollo.getClient(),
        editFeedback: false,
      }
    },
    methods: {
      openTextarea() {
        this.editFeedback = true;
        setTimeout(() => {
          this.$refs.textarea.focus();
        });
      },
      closeTextarea() {
        this.editFeedback = false;
      },
      sendFeedback() {
        const input = {
          where: {
            id: this.workout.id,
          },
          data: {
            feedback: this.feedback
          }
        }

        this.client.mutate({ mutation: updateWorkout, variables: { input: input }  })
          .then(res => {
            window.location.reload(true);
          })     
      }
    }
  }
</script>

<style lang="scss" scoped>
  .feedback {
    transition: padding 0.3s;
  }

  .feedback__text {
    flex-basis: 100%;
  }

  .feedback__panel {
    border-top: 1px solid color(gray);

    button {
      flex-basis: 50%;
      padding: 1rem;
    } 
  }
</style>