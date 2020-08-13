<template>
  <div class="invite-user tab">
    <h3 class="mt0 t-green">
      Zaproś użytkownika
    </h3>
    <p class="mb2">
      Uzupełnij dane podopiecznego, aby wysłać mu zaproszenie do aplikacji Piti.
      Drogą mailową otrzyma link aktywacyjny, dzięki któremu dokończy
      rejestrację.
    </p>
    <BaseInput
      v-model="user.fullname"
      class="mb05"
      placeholder="Imię i nazwisko"
      type="text"
    />
    <BaseInput
      v-model="user.email"
      class="mb05"
      placeholder="Adres e-mail"
      type="email"
    />
    <div class="invite-user__buttons p00 pt2 row j-between t-green">
      <button class="button-primary" type="button" @click="sendInvitation">
        Zaproś
      </button>
      <button class="button-primary" type="button" @click="$emit('close')">
        Wróć
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        fullname: "",
        email: "",
      },
    };
  },
  methods: {
    sendInvitation() {
      const link =
        process.env.NODE_ENV == "development"
          ? `http://localhost:3000/register-trainee?name=${this.user.fullname}&email=${this.user.email}&coach=${this.$store.state.auth.user.id}`
          : `https://piti.live/register-trainee?name=${this.user.fullname}&email=${this.user.email}&coach=${this.$store.state.auth.user.id}`;

      const endpoint =
        process.env.NODE_ENV == "development"
          ? "http://localhost:1337/api/email"
          : "https://piti-api.herokuapp.com/api/email";

      const data = {
        from: "Piti@piti.live",
        to: this.user.email,
        subject: `Trener ${this.$store.state.auth.user.fullname} zaprasza się do wspólnego trenowania!`,
        html: `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email template</title>
            </head> 
            <body 
              style="
                margin: 0;
                padding: 0; 
                font-family: 'Helvetica Neue', sans-serif; 
                background-color: #F9F9F9;
                font-size: 90%;"> 
              <div style="padding: 3rem 0;">
                <div style="
                  color: white;
                  background-color: #23283C; 
                  padding: 3rem 2rem; 
                  margin: 0 auto; 
                  max-width: 400px;">
                  <img style="width: 100%;" src="https://images.unsplash.com/photo-1580086229554-1c2a34000456?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=994&q=80">
                  <h2 
                    style="
                      color: #FDDCBD; 
                      margin-top: 1rem; 
                      margin-bottom: 0;
                      font-weight: 500;"> 
                      Cześć, ${this.user.fullname}! 
                  </h2> 
                  <p style="line-height: 1.4;">
                    Twój trener ${this.$store.state.auth.user.fullname} wysyła Ci zaproszenie do aplikacji Piti, która umożliwi Wam dzielenie się rozpiskami treningowymi. Klikając przycisk poniżej przeniesiesz się do formularza ustalającego hasło dla Twojego konta.
                  </p> 
                  <a 
                    href="${link}" 
                    style="
                      display: inline-block; 
                      text-decoration: none;
                      padding: .5rem 1.5rem; 
                      border-radius: 6px; 
                      color: #222E50; 
                      background-color: #FDDCBD; 
                      border: none; 
                      font-weight: 400; 
                      font-size: 14px; 
                      line-height: 1.5;"> 
                      Dokończ rejestrację 
                  </a> 
                </div> 
              </div> 
            </body>
          </html>`,
      };

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          this.$store.commit(
            "main/setNotification",
            "Link aktywacyjny został wysłany na podany adres email."
          );
          this.$emit("close");
        })
        .catch((err) => {
          this.$store.commit(
            "main/setNotification",
            "Wysyłanie nie powiodło się. Sprawdź połączenie z Internetem."
          );
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.invite-user__buttons {
  button {
    width: 49%;
  }
}
</style>
