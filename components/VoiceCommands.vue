<template>
</template>

<script>
  export default {
    data() {
      return {
        recognition: null,
      }
    },
    methods: {
      startRecording() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.interimResults = true;

        setTimeout(() => {
          this.recognition.addEventListener('result', e => {
            const isFinal = e.results[0].isFinal;
            const transcript = e.results[0][0].transcript.toLowerCase();
            
            if (isFinal) {
              if (transcript == 'next' || transcript == 'dalej' ) {
                this.$emit('next');
              } else if (transcript == 'back' || transcript == 'wróć') {
                this.$emit('previous');
              }
            }
          });

          this.recognition.addEventListener('end', this.recognition.start);
          this.recognition.start();
        }, 1000); 
      }
    },
    mounted() {
      this.startRecording();
    }
  }
</script>