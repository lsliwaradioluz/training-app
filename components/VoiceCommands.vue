<template>
</template>

<script>
  export default {
    methods: {
      startRecording() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition = new SpeechRecognition();
        recognition.interimResults = true;

        setTimeout(() => {
          recognition.addEventListener('result', e => {
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

          recognition.addEventListener('end', recognition.start);
          recognition.start();
        }, 1000); 
      }
    },
    mounted() {
      this.startRecording();
    }
  }
</script>