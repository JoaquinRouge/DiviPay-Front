<script setup>

import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const token = localStorage.getItem("token")

const props = defineProps({
    visible: Boolean,
    groupId:Number
})


async function deleteGroup() {
  try {
    const response = await axios.delete(`http://localhost:444/group-service/api/group/delete/${props.groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    router.push("/home")

  } catch (error) {
    console.error("Error during deleteGroup: ", error.response?.data || error.message)
  }
}

</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>Delete Group</h3>
      <p>¿Are you sure you want to delete this group?</p>
      <div class="buttons">
        <button @click="deleteGroup">Confirm</button>
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