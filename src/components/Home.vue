<script setup>

import Header from './Header.vue';
import Groups from './Groups.vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const token = localStorage.getItem("token")

if (token == null) {
    router.push("/")
}

</script>

<template>

<Header/>
<Groups/>
</template>