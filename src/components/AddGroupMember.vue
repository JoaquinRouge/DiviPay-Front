<script setup>
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import UserCard from './UserCard.vue'

const token = localStorage.getItem("token")
const friendsIds = ref([])
const friends = ref([])
const selected = ref([])
const limit = ref(false)
const error = ref('')

const emit = defineEmits(['cancel', 'added'])

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
    const response = await axios.get(`http://localhost:444/friends-service/api/friends`, {
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
    limit.value = false
    error.value = ''
    emit('added')
  } catch (err) {
    // Asegurar que error sea string
    let msg = ''
    if (err.response && err.response.data) {
      if (typeof err.response.data === 'string') {
        msg = err.response.data
      } else if (typeof err.response.data.message === 'string') {
        msg = err.response.data.message
      } else {
        msg = JSON.stringify(err.response.data)
      }
    } else {
      msg = err.message || 'Unknown error'
    }

    console.error("Error al agregar miembros: ", msg)

    limit.value = true
    error.value = msg

    // Mostrar mensaje 4 segundos
    setTimeout(() => {
      limit.value = false
      error.value = ''
    }, 4000)
  }
}

onMounted(async () => {
  if (props.visible) {
    await fetchFriendsIds()
    await fetchFriends()
  }
})

watch(() => props.visible, async (newVal) => {
  if (newVal) {
    await fetchFriendsIds()
    await fetchFriends()
  }
})

</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3 style="margin-bottom: 20px;">Agregar amigos al grupo</h3>
      <p class="limit" v-if="limit">{{ error }}</p>
      <div class="friends">
        <p v-if="friends.length === 0">You must have friends to add people</p>
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

.limit {
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
