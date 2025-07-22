<script setup>
import { onMounted, ref, computed} from 'vue'
import Header from './Header.vue'
import Spinner from './Spinner.vue'
import SpentCard from './SpentCard.vue'
import ConfirmDeleteGroup from './ConfirmDeleteGroup.vue'
import CreateSpent from './CreateSpent.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const gradient = computed(() => getDeterministicGradient(groupId));

const groupId = route.params.id
const token = localStorage.getItem("token")

const group = ref('')
const spents = ref('')
const total = ref('')
const users = ref([])

const showDeleteGroup = ref(false)
const showCreateSpent = ref(false)

const loading = ref(false)
const loadingSpents = ref(false)

async function fetchGroup() {
  loading.value = true
  try {
    const response = await axios.get(`http://localhost:444/group-service/api/group/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    group.value = response.data
  } catch (error) {
    console.error('Error obtaining the group:', error.response?.data || error.message)
  } finally {
    loading.value = false
  }
}

async function fetchSpents() {
  loadingSpents.value = true
  try {
    const response = await axios.get(`http://localhost:444/spent-service/api/spent/group/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    spents.value = response.data
  } catch (error) {
    console.error('Error obtaining the spents:', error.response?.data || error.message)
  } finally {
    loadingSpents.value = false
  }
}

async function fetchUsers() {
  try {
    const usersIdsResponse = await axios.get(`http://localhost:444/group-service/api/group/${groupId}/members`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const userIds = usersIdsResponse.data

    const response = await axios.post(
      `http://localhost:444/user-service/api/user/list`,
      userIds,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      console.log(response.data)
      users.value = response.data
  } catch (error) {
    console.error('Error obtaining users:', error.response?.data || error.message)
  }
}


async function getTotal() {
  try {
    const response = await axios.get(`http://localhost:444/spent-service/api/spent/total/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    total.value = response.data
  } catch (error) {
    console.error('Error during getPrice:', error.response?.data || error.message)
  }
}

function getDeterministicGradient(key) {
  const gradients = [
    "linear-gradient(135deg, #0a66c2, #004182)",
    "linear-gradient(135deg, #0a66c2, #1a75d1)",
    "linear-gradient(135deg, #004182, #003366)",
    "linear-gradient(135deg, #004182, #6699cc)",
    "linear-gradient(135deg, #0a66c2, #cce6ff)",
    "linear-gradient(135deg, #0a66c2, #00bcd4)",
    "linear-gradient(135deg, #004182, #4caf50)",
    "linear-gradient(135deg, #004182, #ff9800)",
    "linear-gradient(135deg, #004182, #6a1b9a)",
    "linear-gradient(135deg, #004182, #f5f5f5)",
    "linear-gradient(135deg, #6699cc, #cce6ff)",
    "linear-gradient(135deg, #003366, #1a75d1)",
    "linear-gradient(135deg, #1a75d1, #00bcd4)",
    "linear-gradient(135deg, #004182, #1a75d1)"
  ];

  let hash = 0;
  const str = key.toString();
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

function getInitials(phrase) {
  if (!phrase) return "";
  
  const words = phrase.trim().split(/\s+/);
  const firstTwo = words.slice(0, 2);
  
  return firstTwo.map(word => word.charAt(0).toUpperCase()).join('');
}


onMounted(() => {
  fetchGroup()
  fetchSpents()
  fetchUsers()
  getTotal()
})

</script>

<template>
  <Header/>
  <main>
    <Spinner top-color="#0a66c2" v-if="loading"/>
    <div class="info">
      <div class="info-group">
        <div class="initials" :style="{ background: gradient }">
          <p>{{ getInitials(group.name) }}</p>
        </div>
          <div >
            <h1>{{ group.name }}</h1>
            <p>{{ group.description }}</p>
            <p>{{ "$" + total }}</p>
          </div>
          <div class="buttons">
            <button>Members</button>
            <button>Edit</button>
            <button @click="showDeleteGroup = true">Delete</button>
          </div>
      </div>
      <div>
        
    <Spinner top-color="#0a66c2" v-if="loadingSpents"/>
    <button @click="showCreateSpent = true">Create Spent</button>
    <div class="spents">
      <SpentCard 
        v-for="spent in spents"
        :spent="spent"
        :usersInGroup="users"
        :key="spent.id"
        @spentDeleted="fetchSpents(); getTotal()" />
    </div>
    <CreateSpent
      :visible="showCreateSpent"
      :users="users"
      :groupId="groupId"
      @cancel="showCreateSpent = false"
      @created="fetchSpents(); getTotal()"
    />
    <ConfirmDeleteGroup
      :visible="showDeleteGroup"
      @cancel="showDeleteGroup = false"
      :groupId="groupId"/>
      </div>
    </div>
  </main>
</template>


<style scoped>
main {
  margin: 50px;
  margin-top: 110px;
  font-family: "Montserrat", sans-serif;
}

.info {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px 40px;
  border-radius: 12px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.info-group {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
}

.initials {
  position: absolute;
  top: -90px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #0a66c2;
  color: white !important; /* Asegura que no se sobreescriba */
  display: grid;
  place-items: center;
  font-size: 3.5rem !important; /* Más proporcional que 80px */
  font-weight: 700;
  line-height: 1;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 3px solid white;
  z-index: 2;
  user-select: none;
}

.initials p {
  font-size: 2.7rem !important;
  font-weight: 700 !important;
  color: white !important;
  line-height: 1;
  margin: 0;
  user-select: none;
  text-align: center;
}


.info-group > div:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 500px;
}

.info-group h1 {
  font-size: 1.8rem;
  color: #004182;
  margin: 0;
}

.info-group p {
  font-size: 1rem;
  color: #333;
  margin: 0;
}

.info-group p:last-of-type {
  font-size: 1.3rem;
  color: #0a66c2;
  font-weight: 600;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  background-color: #0a66c2;
  color: white;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #004182;
}

.spents {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}
</style>
