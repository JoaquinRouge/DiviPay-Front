<script setup>

import { ref } from 'vue'
import logo from '../assets/images/logo.png'
import { useRouter } from 'vue-router'
import Spinner from './Spinner.vue'
import axios from 'axios'

const router = useRouter()

const fullname = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)
const created = ref(false)

async function register() {

  loading.value = true

    try {
        
    const response = await axios.post('http://localhost:444/user-service/api/user/create', {
        fullName: String(fullname.value),
        email: String(email.value),
        password: String(password.value)
    })

    created.value = true

    setTimeout(() => {
        router.push("/login")
    }, 3000)


  } catch (error) {
    console.error('Error during registration:', error.response?.data|| error.message)
      errorMessage.value = error.response.data

    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <img :src="logo" alt="Logo" class="logo" />
      <form @submit.prevent="register">
        <div class="inputs">
          <input
            v-model="fullname"
            type="text"
            placeholder="Full name"
            maxlength="30"
            required
          />
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
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="created" class="created-message">Account created, redirecting to Log in</p>
        <button type="submit" :disabled="loading">
            <template v-if="loading">
                <Spinner />
            </template>
            <template v-else>
                Create account
            </template>
        </button>
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

.error-message,.created-message{
    font-family: "Montserrat", sans-serif;
    text-align: center;
    background-color: #E14434;
    padding: 11px;
    color: white;
}

.created-message{
    background-color: #72BF78;
    
}

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.register-card {
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

button{
    background-color: #0a66c2;
    color: white;
    padding: 17px;
    border-radius: 30px;
    cursor: pointer;
    border: none;
    font-family: "Montserrat", sans-serif;
    font-size: 17px;
    transition: all 0.3s ease-out;
}

button:hover{
    background-color: #004182;
    transition: all 0.3s ease-out;
}
</style>