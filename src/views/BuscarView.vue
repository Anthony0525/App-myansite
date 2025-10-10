<template>
  <IonPage>
    <IonContent>
      <!-- Contenido normal de la pantalla -->
      <main class="main-content">
        <div v-for="pub in publicaciones" :key="pub.id" class="card">
          <div class="card-header">
            <img
              :src="pub.perfiles?.icono_url || 'https://i.pravatar.cc/40'"
              class="perfil-icono"
            />
            <span>{{ pub.perfiles?.nombre_perfil || "Anónimo" }}</span>
          </div>
          <h2>{{ pub.nombre_publicacion }}</h2>
          <p>{{ pub.descripcion }}</p>
          <img v-if="pub.media_url" :src="pub.media_url" class="media" />
        </div>
      </main>

      <!-- Loader -->
      <div v-if="cargando" class="loader">Cargando...</div>

      <!-- Infinite Scroll -->
      <IonInfiniteScroll
        @ionInfinite="cargarMasPublicaciones"
        :disabled="!hayMasDatos"
      >
        <IonInfiniteScrollContent
          loading-spinner="bubbles"
          loading-text="Cargando más publicaciones..."
        ></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </IonContent>

    <!-- Input fijo abajo -->
    <div class="search-bar">
      <IonInput
        v-model="searchQuery"
        placeholder="Buscar"
        @click="openModal"
      >
        <IonIcon name="search-outline" slot="start"></IonIcon>
      </IonInput>
    </div>

    <!-- Modal con slider -->
    <IonModal :is-open="showModal" @didDismiss="closeModal">
      <IonHeader>
        <IonToolbar>
          <IonSegment v-model="activeTab">
            <IonSegmentButton value="posts"> Contenido </IonSegmentButton>
            <IonSegmentButton value="profiles"> Perfiles </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <!-- PUBLICACIONES -->
        <div v-if="activeTab === 'posts'" class="grid-container">
          <div
            v-for="pub in publicaciones"
            :key="'modal-pub-' + pub.id"
            class="grid-item"
          >
            <img
              v-if="pub.media_url"
              :src="pub.media_url"
              alt="post"
              class="media"
            />
            <h3>{{ pub.nombre_publicacion }}</h3>
            <p>{{ pub.descripcion }}</p>
          </div>
        </div>

        <!-- PERFILES -->
        <div v-else class="grid-container">
          <div v-for="i in 6" :key="'profile-' + i" class="grid-item">
            <img
              :src="`https://i.pravatar.cc/100?img=${i}`"
              alt="profile"
              class="perfil-icono"
            />
            <p>Usuario {{ i }}</p>
          </div>
        </div>
      </IonContent>
    </IonModal>
  </IonPage>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { createClient } from "@supabase/supabase-js";
import {
  IonPage,
  IonContent,
  IonModal,
  IonInput,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/vue";

// ✅ Conexión a Supabase
const supabase = createClient(
  "https://neffqwnqpcydidpkysfi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZmZxd25xcGN5ZGlkcGt5c2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Nzc5MTUsImV4cCI6MjA3MjM1MzkxNX0.I_fwrJYMhKoh2Irlhqub3B5Kn4-JxuJR-XnLhGjUykw"
);

// 📌 Estado
const publicaciones = ref([]);
const cargando = ref(false);
const pagina = ref(0);
const limite = 5;
const hayMasDatos = ref(true);
const searchQuery = ref("");

// 📌 Modal
const showModal = ref(false);
const activeTab = ref("posts");

const openModal = () => (showModal.value = true);
const closeModal = () => (showModal.value = false);

// 📌 Cargar publicaciones de Supabase
async function cargarPublicaciones() {
  if (cargando.value) return;

  cargando.value = true;

  const startIndex = pagina.value * limite;
  const endIndex = startIndex + limite - 1;

  const { data, error } = await supabase
    .from("publicaciones")
    .select(
      `id, nombre_publicacion, descripcion, media_url, perfiles (nombre_perfil, icono_url)`
    )
    .order("created_at", { ascending: false })
    .range(startIndex, endIndex);

  cargando.value = false;

  if (error) {
    console.error("Error al cargar publicaciones:", error);
    hayMasDatos.value = false;
    return;
  }

  if (data && data.length) {
    publicaciones.value.push(...data);
    pagina.value++;
    if (data.length < limite) {
      hayMasDatos.value = false;
    }
  } else {
    hayMasDatos.value = false;
  }
}

async function cargarMasPublicaciones(event) {
  if (!hayMasDatos.value) {
    event.target.complete();
    return;
  }

  await cargarPublicaciones();
  event.target.complete();
}

onMounted(() => {
  cargarPublicaciones();
});
</script>

<style scoped>
:root{
     background: url("C:\Users\ellen\Downloads\App Myansite\Myansite Ionic\Myansite\Myansite\src\assets\WhatsApp Image 2025-08-24 at 4.21.32 PM.jpeg") no-repeat center center fixed;
  background-size: cover;  /* 👈 hace que la imagen se escale */
}
/* Input fijo abajo */
.search-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 8px;
  border-top: 1px solid #ccc;
}

/* Loader */
.loader {
  text-align: center;
  padding: 20px;
  color: #666;
}
/* ===== Cards más pequeñas y consistentes ===== */
.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 320px;   /* 👈 tamaño máximo más pequeño */
  min-width: 280px;   /* 👈 tamaño mínimo */
  text-align: center;
  margin: 0 auto 20px auto; /* centrado + espacio abajo */
  align-self: center;
}

.card h2 {
  margin: 0 0 8px;
  font-size: 1.2em;   /* 👈 título más compacto */
  color: #000;
}

.card p {
  color: #333;
  font-size: 0.95em; /* 👈 texto más pequeño */
}

/* Grid responsive */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  padding: 16px;
}

.grid-item {
  border-radius: 12px;
  background: #f1f1f1;
  padding: 10px;
  text-align: center;
}

.grid-item img {
  width: 100%;
  border-radius: 8px;
}
.perfil-icono {
  border-radius: 50%;
}
</style>
