<template>
  <div class="main-layout">
    <!-- Navbar fijo -->
    <header class="header">
      <ul>
        <li>
          <router-link to="/app/contenido">
            <img src="@/assets/icons8-página-principal-60.png" alt="Inicio" class="icon" />
          </router-link>
        </li>
        <li>
          <router-link to="#">
            <img src="@/assets/icons8-brújula-100.png" alt="Búsqueda" class="icon" />
          </router-link>
        </li>
        <li>
          <router-link to="/app/chats">
            <img src="@/assets/icons8-burbuja-de-diálogo-100.png" alt="Chats" class="icon" />
          </router-link>
        </li>
        <li>
          <router-link to="#">
            <img src="@/assets/icons8-más-100.png" alt="Agregar" class="icon" />
          </router-link>
        </li>
        <li>
          <router-link to="/app/perfil">
            <img src="@/assets/icons8-perfil-de-gato-100.png" alt="Perfil" class="icon" />
          </router-link>
        </li>
      </ul>
    </header>

    <!-- Contenido dinámico -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Audio Lofi oculto -->
    <audio ref="lofiAudio" autoplay loop hidden>
      <source src="@/assets/lofi-background-music-326931.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const lofiAudio = ref(null);

onMounted(() => {
  if (lofiAudio.value) {
    const playMusic = async () => {
      try {
        await lofiAudio.value.play();
      } catch (e) {
        console.warn("Autoplay bloqueado, se reproducirá al interactuar:", e);
      }
    };
    playMusic();
  }
});
</script>

<style scoped>
.main-layout {
  padding-top: 50px; /* Deja espacio para el navbar fijo */
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: rgba(15, 15, 15, 0.75);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.header ul {
  display: flex;
  list-style: none;
  gap: 1.5rem;
  padding: 0;
  margin: 0;
}

.header ul li {
  display: flex;
  align-items: center;
}

.icon {
  width: 28px;
  height: 28px;
}

.main-content {
  min-height: calc(100vh - 50px);
}
</style>
