<script setup>
import { ref } from 'vue'
import Spinner from './Spinner.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  visible: Boolean
})

const emit = defineEmits(['cancel', 'created'])

const loading = ref(false)
const name = ref('')
const description = ref('')
const errorMessage = ref('')

const token = localStorage.getItem("token")

async function createGroup() {
  loading.value = true

  try {
    await axios.post(
      'http://localhost:444/group-service/api/group/create',
      {
        name: name.value,
        description: description.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    emit("created")
    router.push("/home")

  } catch (error) {
    console.error('Error during registration:', error.response?.data || error.message)
      errorMessage.value = error.response.data

    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>Create Group</h3>
      <form @submit.prevent="createGroup">
        <div class="inputs">
          <input
            v-model="name"
            type="text"
            placeholder="Name"
            maxlength="30"
            required
          />
          <input
            v-model="description"
            type="text"
            placeholder="Description"
            maxlength="100"
            required
          />
        </div>
        <div v-if="!loading" class="send">
            <div v-if="errorMessage" class="errorMessage">
                <p class="error-message">{{ errorMessage }}</p>
            </div>
            <div class="buttons">
                <button type="submit">Create</button>
                <button @click="$emit('cancel')">Cancel</button>
            </div>
        </div>
      </form>
      <div class="spinner">
        <Spinner top-color="#0a66c2" v-if="loading" />
      </div>
    </div>
  </div>
</template>


<style scoped>

h3{
    margin-bottom: 20px;
    font-size: 25px;
}

.errorMessage{
    font-family: "Montserrat", sans-serif;
    text-align: center;
    background-color: #E14434;
    padding: 20px;
    color: white;
    margin-bottom: 20px;
}

.spinner{
    margin-top: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  font-family: "Montserrat", sans-serif;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  width: 90%;
  max-width: 350px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.buttons {
  display: flex;
  justify-content: space-around;
}

button {
  padding: 15px;
  border: none;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  width: 100px;
  background-color: #0a66c2;
  color: white;
  transition: all 0.3s ease-out;
  font-size: 17px;
}

button:hover{
    background-color: #004182;
    transition: all 0.3s ease-out;
}

p{
    margin: 20px;
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

</style>