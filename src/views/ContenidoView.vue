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

        <aside class="sidebar">
          <div class="suggestions">
            <p class="suggestions-title">Sugeridos!</p>
            <div class="suggestions-list">
              <div
                v-for="i in 6"
                :key="i"
                class="suggestion-icon"
                :style="`background-image:url(https://i.pravatar.cc/50?img=${i})`"
              ></div>
            </div>
          </div>
        </aside>
      </div>

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
    IonInfiniteScrollContent // 👈 Importa los componentes de Infinite Scroll
} from "@ionic/vue";
import "../assets/contenido.css";

// Revisa que tengas estos componentes importados en MainLayout.vue
// import { IonPage, IonHeader, IonToolbar, IonContent, IonRouterOutlet } from "@ionic/vue";

const supabase = createClient(
  "https://neffqwnqpcydidpkysfi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZmZxd25xcGN5ZGlkcGt5c2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Nzc5MTUsImV4cCI6MjA3MjM1MzkxNX0.I_fwrJYMhKoh2Irlhqub3B5Kn4-JxuJR-XnLhGjUykw"
);

const publicaciones = ref([]);
const cargando = ref(false);
const pagina = ref(0);
const limite = 5;
const hayMasDatos = ref(true); // Controla si ya no hay más para cargar

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
    // Si la cantidad de datos es menor que el límite, asumimos que no hay más páginas
    if (data.length < limite) {
        hayMasDatos.value = false;
    }
  } else {
    // Si no hay datos, deshabilitamos la carga infinita
    hayMasDatos.value = false;
  }
}

// 💡 FUNCIÓN LLAMADA POR IONIC
async function cargarMasPublicaciones(event) {
    // Si no hay más datos, detenemos la función.
    if (!hayMasDatos.value) {
        // Debemos completar el evento, aunque no haya cargado nada.
        event.target.complete(); 
        return;
    }
    
    await cargarPublicaciones();

    // 🔑 IMPORTANTE: Finaliza el evento de carga de Ionic
    event.target.complete();
}


onMounted(() => {
  // Solo se carga la primera página al montar, el scroll lo manejará el IonInfiniteScroll
  cargarPublicaciones();
  // ❌ Se eliminó la función handleScroll y el window.addEventListener("scroll", handleScroll)
});
</script>

<style scoped>
/* Tu CSS específico aquí (si lo tuvieras, además del import) */
.loader {
    text-align: center;
    padding: 20px;
    color: #ccc;
}
</style>