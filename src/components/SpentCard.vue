<script setup>
import { ref } from 'vue'
import ConfirmDeleteSpent from './ConfirmDeleteSpent.vue'

const showDeleteSpent = ref(false)

const props = defineProps({
  spent: {
    type: Object
  },
  usersInGroup:Array
})

function getSpentMembers(spent) {
  if (!spent || !Array.isArray(spent.members)) return [];

  return props.usersInGroup
    .filter(user => spent.members.includes(user.id))
    .map(user => user.fullName);
}



const emit = defineEmits(['spentDeleted'])
</script>

<template>
  <div class="spent">
    <div class="spent-data">
      <div class="spent-header">
        <h3 class="description">{{ spent.description }}</h3>
        <p class="amount">${{ spent.amount }}</p>
      </div>
      <div class="members">
        <p class="members-label">Shared with:</p>
        <div class="member-tags">
          <span
            class="member-tag"
            v-for="name in getSpentMembers(spent)"
            :key="name"
          >
            {{ name }}
          </span>
        </div>
      </div>
    </div>
    <button @click="showDeleteSpent = true">Delete</button>

    <ConfirmDeleteSpent
      :visible="showDeleteSpent"
      @cancel="showDeleteSpent = false"
      @deleted="showDeleteSpent = false; emit('spentDeleted')"
      :spentId="props.spent.id"
    />
  </div>
</template>



<style scoped>
.spent {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 30px 40px;
  border: 1px solid #ccc;
  border-left: 6px solid #0a66c2;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: all 0.3s ease;
  gap: 20px;
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
  background-color: #004182;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #0a66c2;
}

.spent-data {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.spent-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.amount {
  font-size: 1.5rem;
  color: #0a66c2;
  font-weight: 700;
  margin: 0;
}

.description {
  font-size: 1.7rem;
  color: #004182;
  margin: 0;
  font-weight: 500;
}

.members {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 6px;
}

.members-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.member-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.member-tag {
  background-color: #004182;
  color: white;
  padding: 12px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
}

svg {
  width: 28px;
  fill: #555;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

svg:hover {
  fill: #0a66c2;
  cursor: pointer;
}
</style>

