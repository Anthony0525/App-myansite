<template>
  <IonPage>
    <!-- Fondo tipo hero -->
    <div class="hero"></div>

    <IonContent class="ion-padding">
      <div class="card">
        <h1>Crear Publicación</h1>
        <p class="lead">Comparte algo nuevo con tu comunidad</p>

        <form @submit.prevent="handleSubmit">
          <IonItem lines="none">
            <IonLabel position="floating">Título</IonLabel>
            <IonInput v-model="nombre_publicacion" required />
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="floating">Descripción</IonLabel>
            <IonTextarea v-model="descripcion" />
          </IonItem>

          <div class="mt-3">
            <IonLabel>Selecciona una imagen</IonLabel>
            <input
              type="file"
              accept="image/*"
              @change="onFileChange"
              class="mt-2"
            />

            <!-- Vista previa con límite de 160px -->
            <div v-if="previewUrl" class="preview-container mt-3">
              <img
                :src="previewUrl"
                alt="Vista previa"
                class="preview-img"
              />
            </div>
          </div>

          <div class="form-btn-group">
            <IonButton
              type="submit"
              expand="block"
              color="primary"
              :disabled="loading"
            >
              <IonSpinner v-if="loading" name="dots" />
              <span v-else>Publicar</span>
            </IonButton>
          </div>
        </form>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup>
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonSpinner,
} from "@ionic/vue";
import { ref } from "vue";
import { createClient } from "@supabase/supabase-js";

// Configura tu conexión Supabase
const supabase = createClient(
  "https://neffqwnqpcydidpkysfi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
);

const nombre_publicacion = ref("");
const descripcion = ref("");
const file = ref(null);
const previewUrl = ref(null);
const loading = ref(false);

const onFileChange = (e) => {
  const selected = e.target.files[0];
  if (selected) {
    file.value = selected;
    previewUrl.value = URL.createObjectURL(selected);
  }
};

const handleSubmit = async () => {
  try {
    loading.value = true;

    // Obtener usuario activo
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("No hay sesión activa.");

    // Subir imagen al bucket
    let media_url = null;
    if (file.value) {
      const fileName = `${Date.now()}_${file.value.name}`;
      const { error: uploadError } = await supabase.storage
        .from("publicaciones")
        .upload(fileName, file.value);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("publicaciones")
        .getPublicUrl(fileName);
      media_url = publicUrl.publicUrl;
    }

    // Insertar en tabla publicaciones
    const { error: insertError } = await supabase.from("publicaciones").insert([
      {
        nombre_publicacion: nombre_publicacion.value,
        descripcion: descripcion.value,
        media_url,
        perfil_id: user.id,
      },
    ]);

    if (insertError) throw insertError;

    alert("✅ Publicación creada correctamente");
    nombre_publicacion.value = "";
    descripcion.value = "";
    file.value = null;
    previewUrl.value = null;
  } catch (error) {
    console.error(error);
    alert("❌ Error al publicar");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 🔹 Fondo difuminado */
.hero {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: url("C:\Users\ellen\Downloads\App Myansite\Myansite Ionic\Myansite\Myansite\src\assets\WhatsApp Image 2025-08-24 at 4.21.32 PM.jpeg") center/cover
    no-repeat;
  filter: blur(8px) brightness(0.7);
  width: 100%;
  height: 100%;
  z-index: -1;
}

/* 🔹 Tarjeta central */
.card {
  position: relative;
  z-index: 2;
  background: #ffffffcc;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  text-align: center;
}

.card h1 {
  font-size: 1.8rem;
  color: #222;
  margin-bottom: 0.5rem;
}

.lead {
  color: #555;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

/* 🔹 Vista previa */
.preview-container {
  display: flex;
  justify-content: center;
}
.preview-img {
  max-height: 160px;
  width: auto;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
  object-fit: cover;
}

/* 🔹 Botones */
.form-btn-group {
  margin-top: 1rem;
}

/* 🔹 Responsive */
@media (max-width: 500px) {
  .card {
    max-width: 95vw;
    padding: 1.2rem;
  }
}
</style>
