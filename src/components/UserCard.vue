<template>
  <div
    class="user-card"
    :class="{ selected: isSelected }"
    @click="$emit('toggle', user?.id)"
  >
    <div class="avatar">
      {{ user?.fullName?.charAt(0)?.toUpperCase() || '?' }}
    </div>
    <div class="info">
      <p class="name">{{ user?.fullName || 'Unknown' }}</p>
      <p class="email">{{ user?.email || 'No email' }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: Object,
  isSelected: Boolean
})
</script>


<style scoped>
.user-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  background-color: white;
  border: 2px solid transparent;
  cursor: pointer;
  transition: 0.3s ease;
  margin-bottom: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.user-card:hover {
  border-color: #0a66c2;
}

.user-card.selected {
  border-color: #0a66c2;
  background-color: #e6f0fa;
}

.avatar {
  background-color: #0a66c2;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.2rem;
}

.info .name {
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.info .email {
  font-size: 0.9rem;
  color: #555;
}
</style>
