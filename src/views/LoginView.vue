<template>
  <header class="hero"></header>

  <main class="card">
    <!-- Home -->
    <template v-if="vista==='home'">
      <h1>Bienvenido!!!</h1>
      <p class="lead">Myansite un lugar único donde el anime vive</p>
      <div class="btn-group">
        <button class="btn" @click="vista='login'">Iniciar sesión!</button>
        <button class="btn" @click="vista='registro'">Registro!</button>
        <button class="btn" @click="mostrarNoticias">Noticias Anime!</button>
      </div>
    </template>

    <!-- Login -->
    <form v-if="vista==='login'" @submit.prevent="login">
      <input type="email" v-model="correo" placeholder="Correo" required />
      <input type="password" v-model="contrasena" placeholder="Contraseña" required />
      <div class="form-btn-group">
        <button type="submit" class="btn btn-primary">Entrar</button>
        <button type="button" class="btn btn-outline" @click="vista='home'">Volver</button>
      </div>
    </form>

    <!-- Registro -->
    <form v-if="vista==='registro'" @submit.prevent="registrar">
      <input type="text" v-model="usuario" placeholder="Usuario" required />
      <input type="email" v-model="correo" placeholder="Correo" required />
      <input type="password" v-model="contrasena" placeholder="Contraseña" required />
      <div class="form-btn-group">
        <button type="submit" class="btn btn-primary">Registrarse</button>
        <button type="button" class="btn btn-outline" @click="vista='home'">Volver</button>
      </div>
    </form>

    <!-- Noticias -->
    <div v-if="vista==='noticias'">
      <h2>Noticias de Anime</h2>
      <div class="carousel-container">
        <div class="carousel-track">
          <div v-for="anime in noticias" :key="anime.mal_id" class="anime-card">
            <img :src="anime.images.jpg.large_image_url" :alt="anime.title" />
            <h3>{{ anime.title }}</h3>
          </div>
        </div>
      </div>
      <button class="btn btn-outline" @click="vista='home'">Volver</button>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue"
import { createClient } from "@supabase/supabase-js"
import axios from "axios"
import "@/assets/styles.css"

const supabase = createClient("https://neffqwnqpcydidpkysfi.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZmZxd25xcGN5ZGlkcGt5c2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Nzc5MTUsImV4cCI6MjA3MjM1MzkxNX0.I_fwrJYMhKoh2Irlhqub3B5Kn4-JxuJR-XnLhGjUykw")

// Estado
const vista = ref("home")
const usuario = ref("")
const correo = ref("")
const contrasena = ref("")
const noticias = ref([])

// Registro
async function registrar() {
  const { error } = await supabase.from("usuarios").insert([
    { nombre: usuario.value, correo: correo.value, contrasena: contrasena.value }
  ])
  if (error) alert("❌ Error: " + error.message)
  else {
    alert("✅ Usuario registrado")
    vista.value = "home"
  }
}

// Login
async function login() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("correo", correo.value)
    .maybeSingle()

  if (error) {
    alert("❌ Error: " + error.message)
  } else if (!data) {
    alert("⚠️ Usuario no encontrado")
  } else if (data.contrasena === contrasena.value) {
    alert("🎉 Bienvenido " + data.nombre)
    localStorage.setItem("usuario", JSON.stringify(data))
    window.location.href = "/contenido"
  } else {
    alert("⚠️ Contraseña incorrecta")
  }
}

// Noticias Anime
async function mostrarNoticias() {
  try {
    const res = await axios.get("https://api.jikan.moe/v4/top/anime?limit=10")
    noticias.value = res.data.data
    vista.value = "noticias"
  } catch (err) {
    console.error(err)
  }
}
</script>
