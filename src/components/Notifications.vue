<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import Spinner from './Spinner.vue'

const showNotifications = ref(false)
const requests = ref([])
const loading = ref(false)
const error = ref(null)
const userNames = ref({})

const token = localStorage.getItem('token')

const headers = {
  Authorization: `Bearer ${token}`
}

async function fetchRequests() {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get('http://localhost:444/friends-service/api/friends/received-requests', { headers })
    requests.value = res.data

    // Cargar los nombres de los usuarios
    const ids = requests.value.map(r => r.requesterId)
    if (ids.length > 0) {
      const response = await axios.post(
        'http://localhost:444/user-service/api/user/list',
        ids,
        { headers }
      )
      response.data.forEach(user => {
        userNames.value[user.id] = user.fullName
      })
    }

  } catch (e) {
    error.value = 'Error loading notifications'
  } finally {
    loading.value = false
  }
}

async function acceptRequest(requesterId) {
  try {
    await axios.post('http://localhost:444/friends-service/api/friends/accept', null, {
      headers,
      params: { requesterId }
    })
    requests.value = requests.value.filter(r => r.requesterId !== requesterId)
    delete userNames.value[requesterId]
  } catch (e) {
    alert('Error accepting request')
  }
}

async function ignoreRequest(requestId) {
  try {
    await axios.delete(`http://localhost:444/friends-service/api/friends/delete/${requestId}`, { headers })
    const removed = requests.value.find(r => r.id === requestId)
    requests.value = requests.value.filter(r => r.id !== requestId)
    if (removed) delete userNames.value[removed.requesterId]
  } catch (e) {
    alert('Error ignoring request')
  }
}

watch(showNotifications, (val) => {
  if (val) fetchRequests()
})
</script>

<template>
  <div class="notification-wrapper">
    <svg
      @click="showNotifications = !showNotifications"
      class="clickable bell-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
    >
      <path
        d="M320 64C302.3 64 288 78.3 288 96L288 99.2C215 114 160 178.6 160 256L160 277.7C160 325.8 143.6 372.5 113.6 410.1L103.8 422.3C98.7 428.6 96 436.4 96 444.5C96 464.1 111.9 480 131.5 480L508.4 480C528 480 543.9 464.1 543.9 444.5C543.9 436.4 541.2 428.6 536.1 422.3L526.3 410.1C496.4 372.5 480 325.8 480 277.7L480 256C480 178.6 425 114 352 99.2L352 96C352 78.3 337.7 64 320 64zM258 528C265.1 555.6 290.2 576 320 576C349.8 576 374.9 555.6 382 528L258 528z"
      />
    </svg>

    <div v-if="showNotifications" class="modal-notifications">
      <h4>Friend Requests</h4>
      <Spinner v-if="loading"/>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="!loading && requests.length === 0" class="empty"><i>No friend requests</i></div>

      <ul>
        <li v-for="req in requests" :key="req.id" class="request-item">
          <div class="info">
            <strong>From:</strong> {{ userNames[req.requesterId] || "Loading..." }}<br />
            <small>{{ new Date(req.createdAt).toLocaleString() }}</small>
          </div>
          <div class="actions">
            <button class="accept" @click="acceptRequest(req.requesterId)">Accept</button>
            <button class="ignore" @click="ignoreRequest(req.id)">Ignore</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.notification-wrapper {
  position: relative;
  display: inline-block;
}

.bell-icon {
  width: 50px;
  cursor: pointer;
  fill: black;
  transition: fill 0.3s;
}

.actions{
    display: flex;
    gap: 20px;
}

.modal-notifications {
  position: absolute;
  top: 55px;
  right: 0;
  width: 520px;
  max-height: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(10, 102, 194, 0.4);
  overflow-y: auto;
  padding: 1rem;
  z-index: 1000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.modal-notifications h4 {
  margin: 0 0 1rem 0;
  color: #004182;
  font-weight: 700;
  font-size: 1.2rem;
  border-bottom: 2px solid #0a66c2;
  padding-bottom: 0.25rem;
}

.request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.info strong {
  color: #0a66c2;
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

.actions .accept {
  background-color: #0a66c2;
  color: white;
}

.actions .accept:hover {
  background-color: #004182;
}

.actions .ignore {
  background-color: #eee;
  color: #333;
}

.actions .ignore:hover {
  background-color: #ccc;
}

.loading,
.error,
.empty {
  text-align: center;
  color: #555;
  font-size: 0.9rem;
  padding: 1rem 0;
}

</style>
