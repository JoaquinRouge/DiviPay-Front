<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const token = localStorage.getItem("token")
const userId = Number(localStorage.getItem("userId")) // 👈 user actual

const emit = defineEmits(['cancel', 'created'])

const props = defineProps({
  visible: Boolean,
  users: Array,
  groupId: Number
})

const name = ref('')
const description = ref(0)
const selectedUserIds = ref([])

watch(() => props.users, (newUsers) => {
  // Preseleccionar todos excepto el usuario actual
  selectedUserIds.value = newUsers
    .filter(user => user.id !== userId)
    .map(user => user.id)
}, { immediate: true })

const loading = ref(false)
const errorMessage = ref('')

function toggleUser(userIdToToggle) {
  if (selectedUserIds.value.includes(userIdToToggle)) {
    selectedUserIds.value = selectedUserIds.value.filter(id => id !== userIdToToggle)
  } else {
    selectedUserIds.value.push(userIdToToggle)
  }
}

async function createSpent() {
  const members = [...selectedUserIds.value]

  // Asegurarse de incluir el user actual
  if (!members.includes(userId)) {
    members.push(userId)
  }

  const payload = {
    description: name.value,
    amount: description.value,
    groupId: props.groupId,
    members
  }

  try {
    loading.value = true
    errorMessage.value = ''

    const response = await fetch('http://localhost:444/spent-service/api/spent/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al crear el gasto')
    }

    const result = await response.json()
    console.log('Gasto creado correctamente:', result)
    
    emit('created')
    emit('cancel')
  } catch (err) {
    errorMessage.value = err.message
    console.error('Error creando gasto:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>Create Spent</h3>
      <form @submit.prevent="createSpent">
        <div class="inputs">
          <input
            v-model="name"
            type="text"
            placeholder="Description"
            maxlength="30"
            required
          />
          <input
            v-model.number="description"
            type="number"
            placeholder="Amount"
            min="0"
            required
          />

          <div class="user-selector">
            <label>Select users</label>
            <div class="user-list">
              <div
                v-for="user in props.users.filter(u => u.id !== userId)"
                :key="user.id"
                class="user-item"
                :class="{ selected: selectedUserIds.includes(user.id) }"
                @click="toggleUser(user.id)"
              >
                <input
                  type="checkbox"
                  :checked="selectedUserIds.includes(user.id)"
                  @change.prevent
                />
                <div class="user-info">
                  <strong>{{ user.fullName }}</strong>
                  <small>{{ user.email }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!loading" class="send">
          <div v-if="errorMessage" class="errorMessage">
            <p class="error-message">{{ errorMessage }}</p>
          </div>
          <div class="buttons">
            <button type="submit">Create</button>
            <button @click="$emit('cancel')" type="button">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>


<style scoped>
h3 {
  margin-bottom: 20px;
  font-size: 25px;
}

.errorMessage {
  font-family: "Montserrat", sans-serif;
  text-align: center;
  background-color: #E14434;
  padding: 20px;
  color: white;
  margin-bottom: 20px;
}

.spinner {
  margin-top: 20px;
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
  font-size: 17px;
}

button:hover {
  background-color: #004182;
}

p {
  margin: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

input {
  padding: 17px;
  font-size: 17px;
  border-radius: 5px;
  border: 1px solid black;
}

/* === NUEVO ESTILO PARA USUARIO === */
.user-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 150px;
  overflow-y: auto;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid black;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.user-item.selected {
  background-color: #e6f0fa;
  border-color: #0a66c2;
}

.user-item input[type="checkbox"] {
  pointer-events: none;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-info strong {
  font-size: 14px;
}

.user-info small {
  font-size: 12px;
  color: #555;
}
</style>

