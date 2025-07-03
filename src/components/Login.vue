<script setup>
import { ref } from 'vue'
import logo from '../assets/images/logo.png'
import { useRouter } from 'vue-router'
import Spinner from './Spinner.vue'

const router = useRouter()

// Reactividad con Composition API
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

import axios from 'axios'

async function login() {

  loading.value = true

  try {
    const response = await axios.post('http://localhost:444/auth-service/api/auth/login', {
      email: email.value,
      password: password.value
    })

    const token = response.data.jwt
    localStorage.setItem('token', token)
    console.log('Token:', token)

    router.push("/home")

  } catch (error) {
    console.error('Error during log in:', error.response?.data?.message || error.message)
      errorMessage.value = 'Incorret email or password'

    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <img :src="logo" alt="Logo" class="logo" />
      <form @submit.prevent="login">
        <div class="inputs">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <hr />
        <div class="forg-pass">
          <a href="#">¿You forgot your password?</a>
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="submit" :disabled="loading">
            <template v-if="loading">
                <Spinner />
            </template>
            <template v-else>
                Log in
            </template>
        </button>
        <div class="new">
          <p>¿New to DiviPay?</p>
          <a href="#">Join now</a>
        </div>
      </form>
    </div>
  </div>
</template>


<style scoped>

* {
  box-sizing: border-box;
}

img{
    width: 100px;
    margin-bottom: 20px;
}

body {
    font-family: "Montserrat", sans-serif;
}

.error-message{
    font-family: "Montserrat", sans-serif;
    text-align: center;
    background-color: #E14434;
    padding: 11px;
    color: white;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.login-card {
    background-color: white;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  height: auto;
}

form{
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.inputs{
    display: flex;
    flex-direction: column;
    gap: 20px;
}

input{
    padding: 17px;
    font-size: 17px;
    border-radius: 5px;
    border: 1px solid black;
}

.new{
    display: flex;
    gap:5px;
    justify-content: center;
    font-family: "Montserrat", sans-serif;
}

a{
    color: #0a66c2;
    text-decoration: none;
    font-family: "Montserrat", sans-serif;
}

a:hover{
    text-decoration: underline;
}

button{
    background-color: #0a66c2;
    color: white;
    padding: 17px;
    border-radius: 30px;
    cursor: pointer;
    border: none;
    font-family: "Montserrat", sans-serif;
    font-size: 17px;
}

button:hover{
    background-color: #004182;
    transition: all 0.3s ease-out;
}

.forg-pass{
    text-align: center;
}
</style>
