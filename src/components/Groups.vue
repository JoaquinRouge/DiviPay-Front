<script setup>
import GroupCard from './GroupCard.vue'
import Spinner from './Spinner.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  groups: {
    type: Array,
    default: () => []
  },
  loading: Boolean
})

function goToDetails(id) {
  router.push(`/group/${id}/`)
}

</script>

<template>
  <main>
    <Spinner top-color="#0a66c2" v-if="loading" />
    <div class="groups">
      <div class="cards">
        <p v-if="!loading && groups.length == null">¡You have 0 groups!</p>
        <GroupCard @click="goToDetails(group.id)" v-for="group in groups" :key="group.id" :group="group" />
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

    .cards{
      display: flex;
      gap: 50px;
    }

</style>