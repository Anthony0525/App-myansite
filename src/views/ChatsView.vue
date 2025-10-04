<template>
  <IonPage class="chat-page">
    <!-- Header con Segment -->
    <IonHeader>
      <IonToolbar>
        <IonSegment v-model="selectedSegment">
          <IonSegmentButton value="comunes">
            <IonLabel>Comunes</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="importantes">
            <IonLabel>Importantes</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonToolbar>
    </IonHeader>

    <!-- Lista de chats -->
    <IonContent class="ion-padding chat-content">
      <IonList>
        <IonCard
          v-for="chat in filteredChats"
          :key="chat.id"
          @click="openChat(chat)"
          class="chat-card"
        >
          <IonItem lines="none">
            <!-- ✅ Migrado de slot="start" -->
            <template #start>
              <IonAvatar>
                <img :src="chat.user_avatar" alt="avatar" />
              </IonAvatar>
            </template>

            <IonLabel>
              <h2>{{ chat.username }}</h2>
              <p>{{ chat.last_message }}</p>
            </IonLabel>
          </IonItem>
        </IonCard>
      </IonList>
    </IonContent>

    <!-- Modal de chat -->
    <IonModal :is-open="selectedChat !== null" @didDismiss="closeChat">
      <IonHeader>
        <IonToolbar>
          <!-- ✅ Migrado de slot="start" -->
          <template #start>
            <IonButtons>
              <IonButton @click="closeChat">Cerrar</IonButton>
            </IonButtons>
          </template>

          <IonTitle v-if="selectedChat">{{ selectedChat.username }}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent class="chat-modal">
        <div class="chat-messages">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['chat-bubble', msg.sender_id === userId ? 'own' : 'other']"
          >
            <p>{{ msg.content }}</p>
          </div>
        </div>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonItem>
            <IonInput
              v-model="newMessage"
              placeholder="Escribe un mensaje..."
            />
            <!-- ✅ Migrado de slot="end" -->
            <template #end>
              <IonButton @click="sendMessage">Enviar</IonButton>
            </template>
          </IonItem>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  </IonPage>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonCard,
  IonItem,
  IonLabel,
  IonAvatar,
  IonButtons,
  IonButton,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonFooter,
  IonInput,
} from "@ionic/vue";
import { ref, computed, onMounted } from "vue";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "vue-router";

// 🔹 Conexión Supabase
const supabase = createClient(
  "https://neffqwnqpcydidpkysfi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // ⚠️ pon tu key real
);

const router = useRouter();

const selectedSegment = ref("comunes");
const chats = ref([]);
const selectedChat = ref(null);
const messages = ref([]);
const newMessage = ref("");
const userId = ref(null);

// 🔹 Validar usuario logeado
onMounted(async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    router.push("/login"); // Redirige a LoginView.vue
    return;
  }
  userId.value = data.user.id;

  // Cargar chats si hay usuario
  const { data: chatData } = await supabase.from("chats").select("*");
  chats.value = chatData || [];
});

const filteredChats = computed(() => {
  return chats.value.filter((c) => c.type === selectedSegment.value);
});

// 🔹 Abrir chat
const openChat = async (chat) => {
  selectedChat.value = chat;
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chat.id)
    .order("created_at", { ascending: true });
  messages.value = data || [];

  // Escuchar mensajes en tiempo real
  supabase
    .channel("chat-room-" + chat.id)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chat.id}`,
      },
      (payload) => {
        messages.value.push(payload.new);
      }
    )
    .subscribe();
};

// 🔹 Cerrar modal
const closeChat = () => {
  selectedChat.value = null;
  messages.value = [];
};

// 🔹 Enviar mensaje
const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedChat.value) return;

  await supabase.from("messages").insert([
    {
      chat_id: selectedChat.value.id,
      sender_id: userId.value,
      content: newMessage.value,
    },
  ]);

  newMessage.value = "";
};
</script>

<style scoped>
.chat-page {
  background: url("@/assets/WhatsApp Image 2025-08-24 at 4.21.32 PM.jpeg")
    center/cover no-repeat;
}

.chat-card {
  border-radius: 20px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
}

.chat-content {
  --background: transparent;
}

.chat-modal {
  --background: #f5f5f5;
}

.chat-messages {
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.chat-bubble {
  max-width: 75%;
  margin: 5px 0;
  padding: 10px;
  border-radius: 15px;
  font-size: 0.9rem;
}

.chat-bubble.own {
  align-self: flex-end;
  background: #5c6bc0;
  color: white;
}

.chat-bubble.other {
  align-self: flex-start;
  background: #e0e0e0;
}
</style>
