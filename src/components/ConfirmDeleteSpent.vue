<script setup>
import axios from 'axios'
import { ref } from 'vue'

const token = localStorage.getItem("token")

const props = defineProps({
  visible: Boolean,
  spentId: Number
})

const unauth = ref(false)

const emit = defineEmits(['cancel', 'deleted'])

async function deleteSpent() {
  try {
    await axios.delete(`http://localhost:444/spent-service/api/spent/delete/${props.spentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    emit('deleted') // Emitir evento al eliminar
  } catch (error) {

    unauth.value = true

    setTimeout(() => {
        unauth.value  = false
    }, 4000)
    console.error("Error during deleteSpent: ", error.response?.data || error.message)
  }
}
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>Delete Spent</h3>
      <p v-if="unauth" class="unauth">You are not authorized to do this action</p>
      <p>¿Are you sure you want to delete this spent?</p>
      <div class="buttons">
        <button @click="deleteSpent">Confirm</button>
        <button @click="$emit('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
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

.unauth{
  padding: 10px;
  background-color: #E14434;
  margin: 10px;
  color: white;
  border-radius: 15px;
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
  margin-top: 1.5rem;
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
}

button:hover{
    background-color: #004182;
    transition: all 0.3s ease-out;
}

p{
    margin: 20px;
}

</style>