<script setup>
import axios from 'axios'
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  groupId: Number,
  name: String,
  description: String
})

const emit = defineEmits(['cancel', 'updated'])

const token = localStorage.getItem("token")
const unauth = ref(false)

const name = ref(props.name)
const description = ref(props.description)

// Actualiza los campos si los props cambian
watch(() => props.name, (newVal) => name.value = newVal)
watch(() => props.description, (newVal) => description.value = newVal)

async function updateGroup() {
  try {
    await axios.put('http://localhost:444/group-service/api/group/update', {
      id: props.groupId,
      name: name.value,
      description: description.value
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    emit('updated')
  } catch (error) {
    unauth.value = true
    setTimeout(() => unauth.value = false, 4000)
    console.error("Error during updateGroup: ", error.response?.data || error.message)
  }
}
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>Edit Group</h3>
      <p v-if="unauth" class="unauth">You are not authorized to do this action</p>

      <form @submit.prevent="updateGroup">
        <input type="text" v-model="name" placeholder="New group name" required />
        <textarea v-model="description" placeholder="New description" rows="4" required></textarea>

        <div class="buttons">
          <button type="submit">Confirm</button>
          <button type="button" @click="emit('cancel')">Cancel</button>
        </div>
      </form>
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

.unauth {
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
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
}

input, textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  resize: none;
}

.buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

button {
  padding: 10px;
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

button:hover {
  background-color: #004182;
}
</style>
