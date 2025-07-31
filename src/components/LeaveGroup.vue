<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const token = localStorage.getItem("token")

const props = defineProps({
  visible: Boolean,
  groupId: Number
})

const unauth = ref(false)

const emit = defineEmits(['cancel'])

async function leaveGroup() {
  try {
    const response = await axios.put(
      `http://localhost:444/group-service/api/group/leave/${props.groupId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    )
  } catch (error) {
    console.error('Error leaving group:', error.response?.data || error.message)
  } finally {
    router.push("/home")
  }
}


</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>Leave Group</h3>
      <p class="unauth">You can't undo this action. Leaving the group will remove you from your current expenses. Ownership may be transferred to another member</p>
      <p class="sure">¿Are you sure you want to leave group?</p>
      <div class="buttons">
        <button @click="leaveGroup(x)">Leave</button>
        <button @click="$emit('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>


<style scoped>

h3{
    font-size: 35px;
}

.sure{
    font-size: 20px;
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

.unauth{
  padding: 20px;
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