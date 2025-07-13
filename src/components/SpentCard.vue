<script setup>
import { ref } from 'vue'
import ConfirmDeleteSpent from './ConfirmDeleteSpent.vue'

const showDeleteSpent = ref(false)

const props = defineProps({
  spent: {
    type: Object
  }
})

const emit = defineEmits(['spentDeleted'])
</script>

<template>
  <div class="spent">
    <div class="spent-data">
      <h3>{{ spent.description }}</h3>
      <p>${{ spent.amount }}</p>
    </div>
    <svg @click="showDeleteSpent = true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
    </svg>
  </div>
  <ConfirmDeleteSpent 
    :visible="showDeleteSpent"
    @cancel="showDeleteSpent = false"
    @deleted="showDeleteSpent = false; emit('spentDeleted')"
    :spentId="props.spent.id"
  />
</template>


<style scoped>

  .spent{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 55px;
    border-radius: 10px;
    border: 1px solid #ccc;
  }

  .spent-data{
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  svg{
    width: 30px;
    fill: black;
    transition: all 0.3s ease-out;
  }
  
  svg:hover{
    fill: #0a66c2;
    cursor: pointer;
    transition: all 0.3s ease-out;
  }

  h3{

  }

</style>