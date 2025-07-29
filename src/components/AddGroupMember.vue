<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import UserCard from './UserCard.vue'

const router = useRouter()

const token = localStorage.getItem("token")
const userId = localStorage.getItem("userId")
const friendsIds = ref([])
const friends = ref([])
const selected = ref([])

const props = defineProps({
  visible: Boolean,
  groupId: Number
})

function toggleSelection(id) {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter(i => i !== id)
  } else {
    selected.value.push(id)
  }
}

async function fetchFriendsIds() {
  try {
    const response = await axios.get(`http://localhost:444/friends-service/api/friends/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    friendsIds.value = response.data
  } catch (error) {
    console.error("Error during fetch friends ids: ", error.response?.data || error.message)
  }
}

async function fetchFriends() {
  try {
    const response = await axios.post(
      `http://localhost:444/user-service/api/user/list`,
      friendsIds.value,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    friends.value = response.data
  } catch (error) {
    console.error("Error during fetch friends list: ", error.response?.data || error.message)
  }
}

async function confirmSelection() {
  try {
    await axios.post(
      `http://localhost:444/group-service/api/group/${props.groupId}/add-members`,
      selected.value,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    selected.value = []
    emit('cancel')
  } catch (error) {
    console.error("Error al agregar miembros: ", error.response?.data || error.message)
  }
}

const emit = defineEmits(['cancel'])

onMounted(async () => {
  await fetchFriendsIds()
  await fetchFriends()
})
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3 style="margin-bottom: 20px;">Agregar amigos al grupo</h3>
      <div class="friends">
        <UserCard
          v-for="friend in friends"
          :key="friend.id"
          :user="friend"
          :isSelected="selected.includes(friend.id)"
          @toggle="toggleSelection"
        />
      </div>
      <div class="buttons">
        <button @click="confirmSelection">Confirmar</button>
        <button @click="$emit('cancel')">Cancelar</button>
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
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.friends {
  margin-bottom: 20px;
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

button:hover {
  background-color: #004182;
  transition: all 0.3s ease-out;
}
</style>
