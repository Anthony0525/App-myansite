import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"

/* Importa IonicVue */
import { IonicVue } from "@ionic/vue"

/* CSS base de Ionic */
import "@ionic/vue/css/core.css"

/* CSS opcionales de Ionic (muy recomendados) */
import "@ionic/vue/css/normalize.css"
import "@ionic/vue/css/structure.css"
import "@ionic/vue/css/typography.css"

/* Utilidades de Ionic */
import "@ionic/vue/css/padding.css"
import "@ionic/vue/css/float-elements.css"
import "@ionic/vue/css/text-alignment.css"
import "@ionic/vue/css/text-transformation.css"
import "@ionic/vue/css/flex-utils.css"
import "@ionic/vue/css/display.css"

/* Tus estilos personalizados */
import "./assets/styles.css"
import "./assets/contenido.css"

const app = createApp(App)

app.use(IonicVue)
app.use(router)

router.isReady().then(() => {
  app.mount("#app")
})
