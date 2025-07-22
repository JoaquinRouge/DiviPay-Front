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
    <svg
      @click="showDeleteSpent = true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
    >
      <path
        d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 
          32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 
          6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 
          6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 
          25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 
          47.9-45L416 128z"
      />
    </svg>

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
  background-color: #0a66c2;
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

