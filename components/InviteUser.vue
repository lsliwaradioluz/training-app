<template>
  <div class="invite-user tab">
    <h3 class="mt0 t-green">Zaproś użytkownika</h3>
    <p class="mb2">Uzupełnij dane podopiecznego, aby wysłać mu zaproszenie do aplikacji Piti. Drogą mailową otrzyma link aktywacyjny, dzięki któremu dokończy rejestrację.</p>
    <CustomInput 
      class="mb05"
      v-model="user.fullname"
      placeholder="Imię i nazwisko"
      type="text"></CustomInput>
    <CustomInput 
      class="mb05"
      v-model="user.email"
      placeholder="Adres e-mail"
      type="email"></CustomInput>
    <div class="invite-user__buttons p00 pt2 row j-between t-green">
      <button class="button-primary" type="button" @click.once="sendInvitation">Zaproś</button>
      <button class="button-primary" type="button" @click="$emit('close')">Wróć</button>
    </div>
  </div>
</template>

<script>
export default {
    data() {
      return {
        user: {
          fullname: null, 
          email: null,
        }
      }
    },
    methods: {
      sendInvitation() {
        const link = process.env.NODE_ENV == 'development' ? `http://localhost:3000/register-trainee?name=${this.user.fullname}&email=${this.user.email}&coach=${this.$store.state.auth.user.id}` : `https://piti.live/register-trainee?name=${this.user.fullname}&email=${this.user.email}&coach=${this.$store.state.auth.user.id}`;
        const endpoint = process.env.NODE_ENV == 'development' ? 'http://localhost:1337/email' : 'https://piti-backend.herokuapp.com/email';
        this.$axios.$post(endpoint, {
          from: this.$store.state.auth.user.email,
          to: this.user.email, 
          subject: 'Piti: Trener Łukasz Śliwa zaprasza się do wspólnego trenowania!', 
          text: `<body style=" margin: 0; padding: 0; font-family: 'Arial', sans-serif; font-weight: lighter; font-size: 90%;"> <div style="padding: 3rem 0;"> <div style=" color: white; background-color: #222E50; padding: 3rem 2rem; border-radius: 5px; max-width: 400px;"> <img src="https://res.cloudinary.com/drsgb4wld/image/upload/v1585755359/logo_dlqplz.png"> <h4 style="color: #B0FE76; margin-top: 1rem; margin-bottom: 0;"> Cześć, ${this.user.fullname}! </h4> <p style="line-height: 1.2rem;">Twój trener ${this.$store.state.auth.user.fullname} wysyła Ci zaproszenie do aplikacji Piti, która umożliwi Wam dzielenie się rozpiskami treningowymi. Klikając przycisk poniżej przeniesiesz się do formularza ustalającego hasło dla Twojego konta.</p> <a href="${link}" style=" display: inline-block; text-decoration: none; font-family: inherit; padding: .5rem 1.5rem; border: 2px solid color(green); border-radius: 5px; color: #222E50; background-color: #B0FE76; border: none; ">Dokończ rejestrację</a> </div> </div> </body>`
        })
        .then(res => {
          this.$store.commit('main/setNotification', 'Link aktywacyjny został wysłany na podany adres email.');
          this.$emit('close');
        });
      },
    }
  }
</script>

<style lang="scss" scoped>

  .invite-user__buttons {
    button {
      width: 49%;
    }
  }
</style>