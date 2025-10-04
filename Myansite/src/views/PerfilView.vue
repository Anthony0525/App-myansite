<!-- eslint-disable vue/no-deprecated-slot-attribute -->

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Perfil</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent class="ion-padding">
      <IonCard>
        <!-- Imagen de fondo -->
        <IonImg src="" alt="Fondo del perfil" />

        <IonCardContent>
          <!-- Acordeones -->
          <IonAccordionGroup>
            <!-- Acordeón Gustos -->
            <IonAccordion value="gustos">
              <template #header>
                <IonItem button>
                  <IonLabel>Gustos</IonLabel>
                  <IonIcon :icon="chevronDown" slot="end" />
                </IonItem>
              </template>

              <template #content>
                <div class="ion-padding">
                  <ul>
                    <li
                      v-for="(gusto, index) in profileData.gustos"
                      :key="index"
                    >
                      {{ gusto }}
                    </li>
                  </ul>
                </div>
              </template>
            </IonAccordion>

            <!-- Acordeón Logros -->
            <IonAccordion value="logros">
              <template #header>
                <IonItem button>
                  <IonLabel>Logros</IonLabel>
                  <IonIcon :icon="chevronDown" slot="end" />
                </IonItem>
              </template>

              <template #content>
                <div class="ion-padding">
                  <ul>
                    <li
                      v-for="(logro, index) in profileData.logros"
                      :key="index"
                    >
                      {{ logro }}
                    </li>
                  </ul>
                </div>
              </template>
            </IonAccordion>
          </IonAccordionGroup>

          <!-- Avatar y usuario -->
          <div class="user-info-section">
            <div class="user-avatar-container" @click="changeAvatar">
              <IonAvatar>
                <IonImg
                  :src="profileData.avatar_url"
                  alt="Avatar del usuario"
                />
              </IonAvatar>
              <input
                type="file"
                ref="avatarInput"
                style="display: none"
                @change="handleFileChange"
                accept="image/*"
              />
            </div>
            <IonLabel class="username">{{ profileData.username }}</IonLabel>
          </div>
        </IonCardContent>
      </IonCard>
    </IonContent>
  </IonPage>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonIcon,
  IonAccordion,
  IonAccordionGroup,
  IonImg,
  IonAvatar,
} from "@ionic/vue";
import { chevronDown } from "ionicons/icons";
import { createClient } from "@supabase/supabase-js";

// 👉 Supabase Client
const supabase = createClient(
  "https://neffqwnqpcydidpkysfi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // ⚠️ pon tu key real
);

// Perfil
const profileData = ref({
  username: "",
  avatar_url: "",
  gustos: [],
  logros: [],
});

const avatarInput = ref(null);

// 👉 Cambiar avatar
const changeAvatar = () => {
  avatarInput.value.click();
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const filePath = `avatars/${profileData.value.username}/${Date.now()}.${file.name.split(".").pop()}`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (error) throw error;

    const publicUrl = `https://neffqwnqpcydidpkysfi.supabase.co/storage/v1/object/public/${data.path}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("username", profileData.value.username);

    if (updateError) throw updateError;

    profileData.value.avatar_url = publicUrl;
    alert("✅ Imagen de perfil actualizada correctamente!");
  } catch (error) {
    console.error("Error al subir la imagen:", error.message);
    alert("❌ Error al subir la imagen. Inténtalo de nuevo.");
  }
};

// 👉 Cargar datos del perfil
const fetchProfileData = async () => {
  try {
    const usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioActual) {
      console.warn("No hay usuario autenticado.");
      return;
    }

    const { data, error } = await supabase
      .from("perfiles")
      .select("nombre_perfil, avatar_url, gustos, logros")
      .eq("nombre_perfil", usuarioActual.nombre)
      .single();

    if (error) throw error;

    if (data) {
      profileData.value.username = data.nombre_perfil;
      profileData.value.avatar_url = data.avatar_url;
      profileData.value.gustos = data.gustos || [];
      profileData.value.logros = data.logros || [];
    }
  } catch (error) {
    console.error("Error al cargar datos del perfil:", error.message);
  }
};

onMounted(() => {
  fetchProfileData();
});
</script>

<style scoped>
.user-info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
}

.user-avatar-container {
  cursor: pointer;
}

.username {
  margin-top: 8px;
  font-weight: bold;
}
</style>
