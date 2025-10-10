<template>
  <IonPage>
    <IonContent>
      <div class="container">
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

        <!-- 🔹 Barra lateral con sugeridos -->
        <aside class="sidebar">
          <div class="suggestions">
            <p class="suggestions-title">Sugeridos!</p>
            <div class="suggestions-list">
              <div
               
  v-for="perfil in sugeridos"
  :key="perfil.id"
  class="suggestion-icon"
  :style="`background-image: url('${perfil.icono_url}')`"

></div>

              
            </div>
          </div>
        </aside>
      </div>

      <!-- Scroll infinito -->
      <IonInfiniteScroll
        @ionInfinite="cargarMasPublicaciones"
        :disabled="!hayMasDatos"
      >
        <IonInfiniteScrollContent
          loading-spinner="bubbles"
          loading-text="Cargando más publicaciones..."
        ></IonInfiniteScrollContent>
      </IonInfiniteScroll>

      <div v-if="cargando" class="loader">Cargando...</div>
    </IonContent>
  </IonPage>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { createClient } from "@supabase/supabase-js";
import {
  IonPage,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/vue";
import "../assets/contenido.css";

// 🔧 Configuración Supabase
const supabase = createClient(
  "https://neffqwnqpcydidpkysfi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZmZxd25xcGN5ZGlkcGt5c2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Nzc5MTUsImV4cCI6MjA3MjM1MzkxNX0.I_fwrJYMhKoh2Irlhqub3B5Kn4-JxuJR-XnLhGjUykw"
);

const publicaciones = ref([]);
const sugeridos = ref([]);
const cargando = ref(false);
const pagina = ref(0);
const limite = 5;
const hayMasDatos = ref(true);

// 📥 Cargar publicaciones
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
    if (data.length < limite) hayMasDatos.value = false;
  } else {
    hayMasDatos.value = false;
  }
}

// ⚙️ Cargar más publicaciones (scroll infinito)
async function cargarMasPublicaciones(event) {
  if (!hayMasDatos.value) {
    event.target.complete();
    return;
  }

  await cargarPublicaciones();
  event.target.complete();
}

// 🧩 Cargar perfiles sugeridos
async function cargarSugeridos() {
  const { data, error } = await supabase
  .from("perfiles")
  .select("id,icono_url")
  .neq("icono_url", "x")   // 👈 Evita registros con "x"
  .not("icono_url", "is", null)
    .limit(6);

  if (error) {
    console.error("Error al cargar sugeridos:", error);
    return;
  }

  sugeridos.value = data;
}

// 🚀 Montaje inicial
onMounted(() => {
  cargarPublicaciones();
  cargarSugeridos();
});
</script>

<style scoped>
.loader {
  text-align: center;
  padding: 20px;
  color: #ccc;
}

/* 🎨 Estilos para la sidebar */
.suggestions {
  padding: 10px;
}

.suggestions-title {
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.suggestion-icon {
  width: 50px;
  height: 50px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}
</style>
