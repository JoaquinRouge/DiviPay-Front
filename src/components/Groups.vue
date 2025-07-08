<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Spinner from './Spinner.vue'
import GroupCard from './GroupCard.vue'

const token = localStorage.getItem('token')
const loading = ref(true)
const errorMessage = ref('')
const groups = ref([])

async function fetchGroups() {
  loading.value = true

  try {
    const response = await axios.get('http://localhost:444/group-service/api/group/owner', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    groups.value = response.data
    console.log('Grupos recibidos:', groups.value)

  } catch (error) {
    console.error('Error obtaining the groups:', error.response?.data || error.message)
    errorMessage.value = error.response?.data || 'Unexpected error'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchGroups()
})
</script>

<template>
    <main>
        <Spinner top-color="#0a66c2" v-if="loading"/>
        <div class="groups">
            <div>
                <p v-if="!loading && groups.length == 0">¡You have 0 groups!</p>
                <GroupCard v-for="grupo in groups" :key="grupo.id" :group="grupo"/>
            </div>
        </div>
    </main>
</template>

<style scoped>

    main{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 50px;
    }

    p{
      font-family: 'Montserrat',sans-serif;
    }

</style>