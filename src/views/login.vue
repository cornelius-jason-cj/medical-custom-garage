<template>
<div id="loginPage">
  <v-card id="positionForm">
    <v-row >
      <v-col cols="12" sm="12" md="12" id="logoForm">
        <v-img src="../assets/medicalcustom.jpg"></v-img>
        <v-form>
          <div v-if="$v.form.username.$error">
            <span style="color:red"> Username is required</span>
          </div>
          <div v-if="$v.form.password.$error">
            <span style="color:red"> Password is required</span>
          </div>
          <v-text-field
            v-model="form.username"
            @blur="$v.form.username.$touch()"
            label="Username"
            prepend-icon="mdi-account"
          >
          </v-text-field>

          <v-text-field
            v-model="form.password"
            @blur="$v.form.password.$touch()"
            prepend-icon="mdi-lock"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            label="Password"
            @click:append="show1 = !show1"
          >
          </v-text-field>

          <v-btn
          id="loginButton"
          @click.prevent="login"
          :disabled="isFormInvalid"
          >
            Log In
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-card>
</div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
  export default {
    data () {
      return {
        show1: false,
        form: {
          username: null,
          password: null
        }
      }
    },
    validations: {
      form: {
        username: {
          required
        },
        password: {
          required
        }
      }
    },
    computed: {
      isFormInvalid() {
        return this.$v.form.$invalid
      }
    },
    methods: {
      login () {
        this.$v.form.$touch()
        this.$store.dispatch('auth/loginWithEmailAndPassword', this.form)
        .then(()=> this.$store.dispatch('auth/getAuthUser'))
        .then(() => this.$router.push('/home'))
        .catch((err) => console.log(err))
      }
    }
  }
</script>

<style scoped>
#positionForm {
  box-shadow: 0px 0px 10px #5eb1ff;
  border-radius: 30px;
  width: 80%;
  max-width: 600px;
  margin: 5% auto 0 auto;
  }

.v-form {
  margin: 20px auto;
  max-width: 400px;
}

h3 {
  text-align: center;
}

.v-image {
  max-width: 200px;
  margin: 20px auto;
}

#loginButton {
  width: 100%;
  background-color: #40a0cc;
  margin-top: 40px;
  color: white;
}

#loginButton:hover {
  background-color: #50c8ff;
  color: white;
}
</style>