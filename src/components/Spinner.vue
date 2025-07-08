<script setup>
defineProps({
  topColor: {
    type: String,
    default: '#ffffff' // blanco si no se pasa
  }
})
</script>

<template>
  <div class="spinner" :style="{ borderTopColor: topColor }"></div>
</template>

<style scoped>
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(112, 150, 180, 0.2);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
  /* border-top-color dinámico con prop */
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

