<script setup>
import { onMounted , ref} from 'vue';
import Header from './Header.vue';
import Spinner from './Spinner.vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute()

const groupId = route.params.id
const token = localStorage.getItem("token")

const group = ref('')
const spents = ref('')

const loading = ref(false)

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
    
  }
}

onMounted(() => {
    fetchGroup()
    fetchSpents()
})

</script>
<template>
    <Header/>
    <main>
        <Spinner top-color="#0a66c2" v-if="loading"/>
        <p>{{group.name}}</p>
        <p>{{ spents }}</p>
    </main>
</template>

<style scoped>
    main{
        margin-top: 50px;
    }
</style>