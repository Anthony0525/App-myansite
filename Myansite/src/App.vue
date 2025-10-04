<template>
  <IonApp>
    <!-- Loading global -->
    <LoadingScreen v-if="loadingState === 'loading'" />

    <!-- Contenido principal con rutas -->
    <router-view v-else /> <!-- Solo router-view normal -->
  </IonApp>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { IonApp } from "@ionic/vue"
import LoadingScreen from "./views/PantallaCarga.vue"

const loadingState = ref("loading")
const router = useRouter()

onMounted(() => {
  // Tiempo inicial de carga al abrir la app
  setTimeout(() => {
    loadingState.value = "loaded"
  }, 3000) // puedes ajustar a tu gusto

  // Mostrar loading en cada navegación
  router.beforeEach((to, from, next) => {
    loadingState.value = "loading"
    next()
  })

  router.afterEach(() => {
    setTimeout(() => {
      loadingState.value = "loaded"
    }, 500) // un pequeño delay para suavizar transición
  })
})
</script>
