<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'
import Groups from './Groups.vue'
import axios from 'axios'

const router = useRouter()
const token = localStorage.getItem("token")

if (token == null) {
    router.push("/")
}

const groups = ref([])
const loading = ref(true)

async function fetchGroups() {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:444/group-service/api/group', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    groups.value = response.data
  } catch (error) {
    console.error('Error obtaining the groups:', error.response?.data || error.message)
  } finally {
    loading.value = false
  }
}


onMounted(() => {
    fetchGroups()
})
</script>

<template>
  <Header @group-created="fetchGroups" />
  <Groups :groups="groups" :loading="loading" />
</template>
