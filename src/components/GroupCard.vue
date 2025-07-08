<script setup>
import { computed,ref,onMounted } from 'vue'
import axios from 'axios';
import Spinner from './Spinner.vue';

const token = localStorage.getItem("token")
const total = ref(null)

const { group } = defineProps({
  group: {
    type: Object,
    required: true
  }
});

const gradient = computed(() => getDeterministicGradient(group.id));

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

async function getTotal() {

    try {
        
    const response = await axios.get(`http://localhost:444/spent-service/api/spent/total/${group.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    total.value = response.data

  } catch (error) {
    console.error('Error during getPrice:', error.response?.data|| error.message)
  }
}

function getInitials(phrase) {
  if (!phrase) return "";
  
  const words = phrase.trim().split(/\s+/);
  const firstTwo = words.slice(0, 2);
  
  return firstTwo.map(word => word.charAt(0).toUpperCase()).join('');
}

onMounted(() => {
  getTotal()
})

</script>

<template>
  <div class="group-card">
    <div :style="{ background: gradient }" class="color">
      <!-- Color at the top of the card -->
    </div>
    <div class="initials">
      <p>{{ getInitials(group.name) }}</p>
    </div>
    <div class="information">
      <h3>{{ group.name }}</h3>
      <p>{{ group.description }}</p>
      <div class="price">
        <p v-if="total !== null">${{ total }}</p>
        <p v-else><Spinner top-color="#0a66c2"/></p>
        <strong>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
            />
          </svg>
        </strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group-card {
  position: relative;
  background-color: white;
  border: 1px solid #d1d1d1;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;
  font-family: "Montserrat", sans-serif;
  cursor: pointer;
  height: auto;
  width: 450px;
  padding-bottom: 20px;
  transition: all 0.3s ease-out;
}

.color {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 100px;
}

.initials {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
  background-color: #0a66c2;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.initials p {
  color: white;
  font-weight: 600;
  font-size: 32px;
  margin: 0;
}

.information {
  padding-left: 20px;
  padding-top: 40px;
  padding-right: 40px;
}


.price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
}

.price p{
  color: black;
}

.price svg {
  margin-top: 10px;
}

.group-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-out;
}

h3 {
  margin: 0;
  color: black;
}

svg {
  width: 15px;
}

p {
  margin-top: 0.5rem;
  color: #666;
}
</style>

