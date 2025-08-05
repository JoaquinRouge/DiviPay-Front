<script setup>
import { ref } from 'vue'
import logo from '../assets/images/logo.png'
import ConfirmLogout from './ConfirmLogout.vue'
import CreateGroup from './CreateGroup.vue'
import FriendRequestsModal from './Notifications.vue'
import { useRouter } from 'vue-router'

const showLogoutModal = ref(false)
const showCreateGroup = ref(false)
const router = useRouter()

const emit = defineEmits(['group-created'])

function goToProfile(){
  router.push('/profile')
}

function getInitials(name) {
  if (!name) return ''
  return name.trim().charAt(0).toUpperCase()
}

function handleGroupCreated() {
  showCreateGroup.value = false
  emit('group-created')
}
</script>

<template>
  <header>
    <nav>
      <div>
        <a href="/home">
          <img :src="logo" alt="logo" class="clickable" />
        </a>
      </div>
      <div class="utils">
        <svg class="clickable" @click="showCreateGroup = true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
        <FriendRequestsModal />
        <p class="clickable profile" @click="goToProfile">{{ getInitials("Joaquin ROuge") }}</p>
      </div>
    </nav>
    <ConfirmLogout
      :visible="showLogoutModal"
      @cancel="showLogoutModal = false"
    />
    <CreateGroup
      :visible="showCreateGroup"
      @cancel="showCreateGroup = false"
      @created="handleGroupCreated"
    />
  </header>
</template>

<style scoped>
  header{
      height: 120px;
      padding-left: 50px;
      padding-right: 50px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .profile{
    width: 50px;
    height: 50px;
    background-color: #0a66c2;
    border-radius: 50%;
    font-size: 1rem;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 0.5rem;
    font-family: 'Montserrat';
    color: white;
    margin-top: 7px;
  }

  nav{
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 120px;
  }

  img{
      width: 130px;
  }

  svg{
      width: 30px;
  }

  .bell{
    width: 50px;
  }

  .clickable{
      cursor: pointer;
  }

  .utils{
      display: flex;
      align-items: center;
      gap: 30px;
      position: relative; 
  }
</style>

