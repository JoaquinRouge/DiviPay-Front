<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import Header from './Header.vue'
import ConfirmLogout from './ConfirmLogout.vue'
import UserCard from './UserCard.vue'
import Spinner from './Spinner.vue'  // Importo Spinner

const token = localStorage.getItem('token')
const userId = localStorage.getItem('userId')

const user = ref(null)
const friends = ref([])
const loading = ref(true)
const error = ref(null)
const activeSection = ref('profile')
const showLogoutModal = ref(false)

// Para Search Users
const searchEmail = ref('')
const searchResult = ref(null)
const searching = ref(false)
const searchError = ref(null)
const friendRequestLoading = ref(false)
const friendRequestSuccess = ref(false)
const friendRequestError = ref(null)

function getInitials(name) {
  if (!name) return ''
  return name.trim().charAt(0).toUpperCase()
}

async function fetchUser() {
  try {
    const res = await axios.post(
      'http://localhost:444/user-service/api/user/list',
      [userId],
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    user.value = res.data[0]
  } catch (e) {
    error.value = 'Error fetching user data'
    console.error(e.response?.data || e.message)
  } finally {
    loading.value = false
  }
}

async function fetchFriends() {
  try {
    const res = await axios.get('http://localhost:444/friends-service/api/friends', {
      headers: { Authorization: `Bearer ${token}` }
    })

    const friendIds = res.data

    if (friendIds.length === 0) {
      friends.value = []
      return
    }

    const userRes = await axios.post(
      'http://localhost:444/user-service/api/user/list',
      friendIds,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    friends.value = userRes.data
  } catch (e) {
    error.value = 'Error fetching friends'
    console.error(e.response?.data || e.message)
  }
}

function debounce(fn, delay) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const performSearch = debounce(async (emailInput) => {
  if (!emailInput || emailInput.length < 3) {
    searchResult.value = null
    searchError.value = null
    return
  }

  searching.value = true
  searchError.value = null
  searchResult.value = null
  friendRequestSuccess.value = false
  friendRequestError.value = null

  try {
    const res = await axios.get(
      `http://localhost:444/user-service/api/user/email/${encodeURIComponent(emailInput.trim())}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    searchResult.value = res.data
  } catch (e) {
    searchError.value = e.response?.data?.message || e.response?.data || e.message || 'Error searching user'
    console.error(e.response?.data || e.message)
  } finally {
    searching.value = false
  }
}, 500)



watch(searchEmail, (val) => {
  performSearch(val)
})

watch(activeSection, (val) => {
  if (val === 'friends') fetchFriends()
})

onMounted(() => {
  fetchUser()
})

async function sendFriendRequest(targetId) {
  friendRequestLoading.value = true
  friendRequestError.value = null
  friendRequestSuccess.value = false
  try {
    await axios.post(
      `http://localhost:444/friends-service/api/friends/request`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { targetId }
      }
    )
    friendRequestSuccess.value = true
  } catch (e) {
    friendRequestError.value = e.response?.data || e.message
  } finally {
    friendRequestLoading.value = false
  }
}
</script>

<template>
  <Header />
  <div class="dashboard">
    <aside class="sidebar">
      <div class="avatar">
        <div class="circle">{{ getInitials(user?.fullName) }}</div>
        <p class="name">{{ user?.fullName }}</p>
        <p class="email">{{ user?.email }}</p>
      </div>
      <nav class="menu">
        <button :class="{ active: activeSection === 'profile' }" @click="activeSection = 'profile'">My Profile</button>
        <button :class="{ active: activeSection === 'friends' }" @click="activeSection = 'friends'">Friends</button>
        <button :class="{ active: activeSection === 'search' }" @click="activeSection = 'search'">Search Users</button>
      </nav>
    </aside>

    <main class="main-content">
      <div v-if="loading" class="centered-spinner">
        <Spinner />
      </div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <section v-else>
        <div v-if="activeSection === 'profile'" class="section">
          <h2>My Profile</h2>
          <p><strong>Name:</strong> {{ user.fullName }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Member since:</strong> {{ new Date(user.createdAt).toLocaleDateString('es-AR') }}</p>
          <button class="logout" @click="showLogoutModal = true">Log Out</button>
        </div>

        <div v-else-if="activeSection === 'friends'" class="section">
          <h2>My Friends</h2>
          <div v-if="friends.length === 0" class="empty">No friends found</div>
          <div class="friends-list">
            <UserCard v-for="friend in friends" :key="friend.id" :user="friend" />
          </div>
        </div>

        <div v-else-if="activeSection === 'search'" class="section">
          <h2>Search Users</h2>
          <input
            type="email"
            v-model="searchEmail"
            placeholder="Enter user email"
            autocomplete="off"
            class="search-input"
          />

          <div v-if="searching" class="centered-spinner">
            <Spinner />
          </div>

          <div v-if="searchError" class="error modern-error">{{ searchError }}</div>

          <div v-if="searchResult" class="search-result">
            <UserCard :user="searchResult" />
            <button
              class="friend-request-btn"
              :disabled="friendRequestLoading"
              @click="sendFriendRequest(searchResult.id)"
            >
              {{ friendRequestLoading ? 'Sending...' : 'Send Friend Request' }}
            </button>
            <div v-if="friendRequestSuccess" class="success">Request sent successfully!</div>
            <div v-if="friendRequestError" class="error modern-error">{{ friendRequestError }}</div>
          </div>
        </div>
      </section>
    </main>
  </div>

  <ConfirmLogout :visible="showLogoutModal" @cancel="showLogoutModal = false" />
</template>

<style scoped>

*{
  font-family: 'Montserrat';
}

.dashboard {
  display: flex;
  height: 100vh;
  background: #f5f7fa;
  color: #1c1e21;
}

.sidebar {
  width: 200px;
  background-color: #004182;
  color: white;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 8px rgba(0,0,0,0.15);
}

.avatar {
  text-align: center;
  margin-bottom: 2rem;
}

.circle {
  width: 80px;
  height: 80px;
  background-color: #0a66c2;
  border-radius: 50%;
  font-size: 1.8rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  box-shadow: 0 3px 6px rgba(10, 102, 194, 0.6);
}

.name {
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.04em;
}

.email {
  font-size: 0.9rem;
  opacity: 0.85;
  font-style: italic;
  margin-top: 2px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.menu button {
  background: none;
  border: none;
  color: white;
  text-align: left;
  padding: 0.9rem 1.2rem;
  font-size: 1.1rem;
  cursor: pointer;
  border-radius: 10px;
  font-weight: 600;
  letter-spacing: 0.03em;
  transition: 0.35s ease;
  box-shadow: inset 0 0 0 0 transparent;
  user-select: none;
}

.menu button:hover,
.menu button.active {
  background-color: #0a66c2;
  box-shadow: inset 0 0 12px #0a66c2cc;
}

.logout {
  padding: 16px 0;
  border: none;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  width: 140px;
  background-color: #0a66c2;
  color: white;
  transition: background-color 0.3s ease-out, box-shadow 0.3s ease;
  margin-top: 1.5rem;
}

.logout:hover {
  background-color: #004182;
}

.main-content {
  flex-grow: 1;
  padding: 3rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.section {
  background-color: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.5s ease;
  min-height: 250px;
}

.friends-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.empty {
  opacity: 0.6;
  font-style: italic;
  margin-top: 1.25rem;
  font-size: 1.1rem;
  text-align: center;
}

h2 {
  color: #004182;
  margin-bottom: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  font-size: 1.8rem;
}

p {
  font-size: 1.05rem;
  margin: 0.5rem 0;
  line-height: 1.4;
}

.centered-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.5rem 0;
}

.loading {
  font-size: 1.25rem;
  font-weight: 600;
  color: #666;
  text-align: center;
}

.error {
  font-weight: 700;
  color: #bb2d3b;
  background-color: #ffe6e9;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(187, 45, 59, 0.3);
  font-size: 1rem;
  user-select: text;
  white-space: pre-wrap;
}

.modern-error {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: 0.015em;
}

.search-input {
  width: 96%;
  padding: 0.75rem 1.2rem;
  font-size: 1.1rem;
  border-radius: 12px;
  border: 1.8px solid #ccc;
  margin-bottom: 1.2rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.05);
  font-weight: 500;
}

.search-input:focus {
  outline: none;
  border-color: #0a66c2;
  box-shadow: 0 0 12px #0a66c2cc;
  background: #f0f6ff;
}

.friend-request-btn {
  margin-top: 1.4rem;
  padding: 14px 30px;
  background-color: #0a66c2;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.04em;
  box-shadow: 0 6px 20px #0a66c2bb;
  transition: background-color 0.3s ease-out, box-shadow 0.3s ease-out;
}

.friend-request-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}

.friend-request-btn:hover:not(:disabled) {
  background-color: #004182;
  box-shadow: 0 10px 26px #004182cc;
}

.success {
  margin-top: 1rem;
  font-weight: 700;
  color: #1b661b;
  background-color: #d7f0d7;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  box-shadow: 0 2px 10px rgba(27, 102, 27, 0.3);
  font-size: 1rem;
  user-select: text;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
