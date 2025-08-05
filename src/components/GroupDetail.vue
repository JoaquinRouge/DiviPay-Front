<script setup>
import { onMounted, ref, computed } from 'vue'
import Header from './Header.vue'
import Spinner from './Spinner.vue'
import SpentCard from './SpentCard.vue'
import ConfirmDeleteGroup from './ConfirmDeleteGroup.vue'
import AddGroupMember from './AddGroupMember.vue'
import CreateSpent from './CreateSpent.vue'
import EditGroup from './editGroup.vue'
import LeaveGroup from './LeaveGroup.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const groupId = route.params.id
const token = localStorage.getItem("token")

const group = ref('')
const spents = ref('')
const total = ref('')
const users = ref([])
const owner = ref([])

const showDeleteGroup = ref(false)
const showCreateSpent = ref(false)
const showAddFriends = ref(false)
const showEditModal = ref(false)
const showLeaveGroup = ref(false)

const loading = ref(false)
const loadingSpents = ref(false)

const gradient = computed(() => getDeterministicGradient(groupId));

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
    router.push('/home')
  } finally {
    loading.value = false
    showEditModal.value = false
    showAddFriends.value = false
    fetchUsers()
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

async function getOwner() {
  try {
    const ownerResponse = await axios.get(`http://localhost:444/group-service/api/group/${groupId}/owner`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const ownerId = ownerResponse.data; // este sí es el número
    const idList = [ownerId];

    const response = await axios.post(
      `http://localhost:444/user-service/api/user/list`,
      idList,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    )

    owner.value = response.data[0];
  } catch (error) {
    console.error('Error during get owner:', error.response?.data || error.message)
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

// Computed property para calcular y simplificar las deudas
const debts = computed(() => {
  if (!spents.value || !users.value || spents.value.length === 0 || users.value.length === 0) return []

  const deudaMap = {} // { fromId: { toId: amount } }

  spents.value.forEach(({ amount, userId: payerId, members }) => {
    if (!members || members.length === 0) return

    const splitAmount = amount / members.length

    members.forEach(memberId => {
      if (memberId === payerId) return

      if (!deudaMap[memberId]) deudaMap[memberId] = {}
      if (!deudaMap[memberId][payerId]) deudaMap[memberId][payerId] = 0

      deudaMap[memberId][payerId] += splitAmount
    })
  })

  // Simplificar deudas mutuas
  const simplified = {}

  for (const fromId in deudaMap) {
    for (const toId in deudaMap[fromId]) {
      const amount = deudaMap[fromId][toId]

      if (simplified[toId]?.[fromId]) {
        if (simplified[toId][fromId] > amount) {
          simplified[toId][fromId] -= amount
        } else if (simplified[toId][fromId] < amount) {
          const diff = amount - simplified[toId][fromId]
          delete simplified[toId][fromId]
          if (!simplified[fromId]) simplified[fromId] = {}
          simplified[fromId][toId] = (simplified[fromId][toId] || 0) + diff
        } else {
          delete simplified[toId][fromId]
        }
      } else {
        if (!simplified[fromId]) simplified[fromId] = {}
        simplified[fromId][toId] = (simplified[fromId][toId] || 0) + amount
      }
    }
  }

  // Convertir a array plano para mostrar
  const result = []

  for (const fromId in simplified) {
    for (const toId in simplified[fromId]) {
      result.push({
        from: parseInt(fromId),
        to: parseInt(toId),
        amount: simplified[fromId][toId]
      })
    }
  }

  return result
})

function getUserName(id) {
  const user = users.value.find(u => u.id === id)
  return user ? user.fullName : `User ${id}`
}

onMounted(() => {
  fetchGroup()
  fetchSpents()
  fetchUsers()
  getTotal()
  getOwner()
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
        <div>
          <h1>{{ group.name }}</h1>
          <p>{{ group.description }}</p>
          <p>Creation: {{ new Date(group.createdAt).toLocaleDateString('es-AR') }}</p>
          <p v-if="group.members">{{ group.members.length }} members</p>
          <div class="owner">
            <p v-if="owner">Owner: </p>
            <p class="member-tag">{{ owner.fullName }}</p>
          </div>
          <p>{{ "$" + total }}</p>
        </div>
        <div class="buttons">
          <button @click="showAddFriends = true">Add</button>
          <button @click="showEditModal = true">Edit</button>
          <button @click="showLeaveGroup = true">Leave</button>
          <button @click="showDeleteGroup = true">Delete</button>
        </div>
      </div>

      <!-- Aquí mostramos las deudas -->
      <div class="debts-summary" v-if="debts.length">
        <h2>Debt Summary</h2>
        <ul>
          <li v-for="(debt, i) in debts" :key="i">
            {{ getUserName(debt.from) }} owes <strong>${{ debt.amount.toFixed(2) }}</strong> to {{ getUserName(debt.to) }}
          </li>
        </ul>
      </div>
      <div v-else class="debts-summary no-debts">
        <p>No debts to display.</p>
      </div>

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
        :groupId="groupId"
      />

      <AddGroupMember
        :visible="showAddFriends"
        @cancel="showAddFriends = false"
        @added="fetchGroup"
        :groupId="groupId"
      />

      <EditGroup
        :visible="showEditModal"
        :groupId="groupId"
        :name="group.name"
        :description="group.description"
        @updated="fetchGroup"
        @cancel="showEditModal = false"
      />

      <LeaveGroup
        :visible="showLeaveGroup"
        :groupId="groupId"
        @cancel="showLeaveGroup = false"
      />
    </div>
  </main>
</template>

<style scoped>
main {
  margin: 50px;
  margin-top: 110px;
  font-family: "Montserrat", sans-serif;
}

.owner{
  display: flex;
  align-items: center;
  gap: 10px;
}

.member-tag {
  background-color: #004182 !important;
  color: white !important;
  padding: 12px 12px !important;
  border-radius: 20px !important;
  font-size: 0.85rem !important;
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
  font-size: 2rem;
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
  color: white;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: #004182;
}

button:hover {
  background-color: #0a66c2;
}

.spents {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

/* Estilos para el resumen de deudas */
.debts-summary {
  margin-top: 30px;
  padding: 20px;
  border-radius: 12px;
  background-color: #f0f5fb;
  border: 1px solid #c5d7f5;
  max-width: 600px;
  font-family: 'Montserrat', sans-serif;
  color: #004182;
}

.debts-summary h2 {
  margin-bottom: 15px;
  font-weight: 700;
  font-size: 1.5rem;
}

.debts-summary ul {
  list-style: none;
  padding-left: 0;
}

.debts-summary li {
  padding: 10px 12px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #d9e6fb;
  box-shadow: 0 2px 5px rgb(0 65 130 / 0.15);
  font-weight: 400;
  font-size: 1rem;
}

.debts-summary li strong {
  color: #0a66c2;
}

.no-debts {
  font-style: italic;
  color: #666;
  font-weight: 500;
  max-width: 600px;
  margin-top: 30px;
}
</style>
