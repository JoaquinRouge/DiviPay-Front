<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  }
})

function getInitials(name) {
  if (!name) return '?'
  const words = name.trim().split(' ')
  return words.slice(0, 2).map(w => w?.charAt(0).toUpperCase()).join('')
}
</script>

<template>
  <div class="user-card">
    <div class="avatar-circle">
      {{ getInitials(user.fullName) }}
    </div>
    <div class="info">
      <p class="name">{{ user.fullName }}</p>
      <p class="email">{{ user.email }}</p>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #f4f6f8;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.avatar-circle {
  background-color: #004182;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: bold;
}

.email {
  font-size: 0.9rem;
  opacity: 0.7;
}
</style>
