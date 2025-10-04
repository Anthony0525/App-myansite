import { createRouter, createWebHashHistory } from "vue-router"
import MainLayout from "@/layouts/MainLayout.vue"
import LoginView from "@/views/LoginView.vue"

const routes = [
  { path: "/login", component: LoginView },
  {
    path: "/app",
    component: MainLayout,
    children: [
      { path: "contenido", component: () => import("@/views/ContenidoView.vue") },
      { path: "perfil", component: () => import("@/views/PerfilView.vue") },
      { path: "chats", component: () => import("@/views/ChatsView.vue") }
    ]
  },
  { path: "/", redirect: "/app/contenido" }
]

export default createRouter({
  history: createWebHashHistory(), // 👈 así funciona en localhost y en APK
  routes
})
// import { createRouter, createWebHistory } from "vue-router" --- IGNORE ---
// import MainLayout from "@/layouts/MainLayout.vue" --- IGNORE ---
// import LoginView from "@/views/LoginView.vue" --- IGNORE ---
// --- IGNORE ---
// const routes = [ --- IGNORE ---