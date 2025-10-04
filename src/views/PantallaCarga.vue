<template>
  <IonPage>
    <IonContent class="ion-no-padding ion-no-margin">
      <div class="loading-container" :class="{ 'fade-out': isLoading }">
        <div class="logo">
          <span
            v-for="(letter, index) in letters"
            :key="index"
            class="letter"
            :style="{ 'animation-delay': (index * 0.1) + 's' }"
          >
            {{ letter }}
          </span>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'

const letters = ref(['M', 'y', 'a', 'n', 's', 'i', 't', 'e', '!'])
const isLoading = ref(true)

onMounted(() => {
  // Simula el tiempo de carga
  setTimeout(() => {
    isLoading.value = false
  }, 2000) // Ajusta según tu animación
})
</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--ion-color-dark); /* Usa color de Ionic */
  z-index: 9999;
  transition: opacity 1s ease-in-out;
}

.loading-container.fade-out {
  opacity: 0;
  pointer-events: none;
}

.logo {
  display: flex;
  font-size: 3rem;
  color: var(--ion-color-primary); /* Color Ionic */
  font-family: 'Arial Black', sans-serif;
}

.letter {
  opacity: 0;
  animation: bounce-in 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
  animation-delay: var(--animation-delay, 0s);
  display: inline-block;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
