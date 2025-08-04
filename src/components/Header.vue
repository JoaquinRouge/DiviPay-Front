<script setup>
import { ref } from 'vue'
import logo from '../assets/images/logo.png'
import ConfirmLogout from './ConfirmLogout.vue'
import CreateGroup from './CreateGroup.vue'
import FriendRequestsModal from './Notifications.vue'  // <-- importá tu modal

const showLogoutModal = ref(false)
const showCreateGroup = ref(false)

const emit = defineEmits(['group-created'])

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
        <svg class="clickable" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>
        
        <!-- Reemplazamos la campanita SVG por el componente -->
        <FriendRequestsModal />
        
        <svg class="clickable" @click="showLogoutModal = true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
          />
        </svg>
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
      width: 40px;
  }

  .bell{
    width: 50px;
  }

  .clickable{
      cursor: pointer;
  }

  .utils{
      display: flex;
      gap: 30px;
      position: relative; /* para que el modal posicionado en absolute quede relativo a utils */
  }
</style>

