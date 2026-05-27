<template>
    <section class="min-h-screen">
        <div class="bg-orange-500 text-white py-16">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center ">
                <span class="text-6xl block mb-4 ">🐾</span>
                <h1 class="font-fredoka text-4xl sm:text-5xl mb-4">Sobre PetShop MX</h1>
                <p class="text-xl text-white/80 max-w-2xl mx-auto">
                    Somos una tienda en línea dedicada a ofrecer los mejores productos para tus mascotas. Desde 2020, miles de familias confían en nosotros para consentir a sus peludos.
                </p>
            </div>
        </div>

        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <div class="grid sm:grid-cols-3 gap-8 mb-16">
                <div v-for="value in values" :key="value.title" class="text-center p-6 bg-white rounded-2xl shadow-md border border-orange-100  transition-shadow product-card">
                    <span class="text-5xl block mb-4">{{ value.icon }}</span>
                    <h3 class="font-bold text-xl text-gray-800 mb-2">{{ value.title }}</h3>
                    <p class="text-gray-500 text-sm">{{ value.desc }}</p>
                </div>
            </div>

            <div class="text-center mb-12">
                <h2 class="font-fredoka text-3xl text-gray-800 mb-2">Nuestro Equipo 🐕‍🦺</h2>
                <p class="text-gray-500">Apasionados por las mascotas y expertos en su cuidado</p>
            </div>
            
            <div class="flex flex-wrap justify-center gap-6 mb-16">
                <div v-for="t in team" :key="t.name" class="w-full sm:w-64 text-center p-5 bg-white rounded-2xl shadow-sm border border-orange-100  ">
                    <img 
                        :src="t.image" 
                        :alt="t.name" 
                        class="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-orange-50 shadow-inner"
                    />
                    <h4 class="font-bold text-gray-800">{{ t.name }}</h4>
                    <p class="text-sm text-gray-400 font-semibold">{{ t.role }}</p>
                </div>
            </div>

            <div class="max-w-xl mx-auto">
                <div class="bg-white rounded-3xl shadow-lg p-8 border border-orange-100 ">
                    <h3 class="font-fredoka text-2xl text-gray-800 text-center mb-6">📬 Contáctanos</h3>
                    <form @submit.prevent="handleContact" class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-600 mb-1">Nombre</label>
                            <input v-model="contactForm.nombre" type="text" placeholder="Tu nombre" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400  outline-none" :disabled="enviando" required>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                            <input v-model="contactForm.email" type="email" placeholder="tu@email.com" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400  outline-none" :disabled="enviando" required>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-600 mb-1">Mensaje</label>
                            <textarea v-model="contactForm.mensaje" rows="4" placeholder="¿En qué podemos ayudarte?" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400  resize-none outline-none" :disabled="enviando" required></textarea>
                        </div>
                        <button
                            type="submit"
                            :disabled="enviando"
                            :class="[
                                'w-full py-3 font-bold rounded-xl ',
                                enviando
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-orange-500 text-white  '
                            ]"
                        >
                            <span v-if="enviando" class="flex items-center justify-center gap-2">
                                <svg class=" h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Enviando...
                            </span>
                            <span v-else>📨 Enviar Mensaje</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useToastStore } from '@/modules/public/stores/toastStore';

const toastStore = useToastStore();
const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;

const values = [
    { icon: '❤️', title: 'Amor por las mascotas', desc: 'Cada producto es seleccionado pensando en el bienestar de tu compañero peludo.' },
    { icon: '🌱', title: 'Sustentabilidad', desc: 'Trabajamos con marcas eco-friendly y empaques reciclables para cuidar el planeta.' },
    { icon: '🏆', title: 'Calidad Premium', desc: 'Solo ofrecemos marcas de primera calidad, con ingredientes naturales y duraderos.' },
];

// Array de equipo actualizado: cambiamos 'emoji' por 'image' con URLs reales
const team = [
    {
        name: 'Dr. Isaias',
        role: 'Veterinario',
        image: 'https://media-qro3-1.cdn.whatsapp.net/v/t61.24694-24/699952585_969657115666778_1828549817927507027_n.jpg?ccb=11-4&oh=01_Q5Aa4gEfDA44GCjNiUN9I8yYbf6Q46U6gxPbAhlZyiRg7snasg&oe=6A1B7C83&_nc_sid=5e03e0&_nc_cat=111'
    },
];

const contactForm = reactive({
    nombre: '',
    email: '',
    mensaje: ''
});

const enviando = ref(false);

const handleContact = async () => {
    enviando.value = true;

    try {
        const res = await fetch(`${URL_BACKEND}/contacto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: contactForm.nombre,
                correo: contactForm.email,
                mensaje: contactForm.mensaje
            })
        });

        const data = await res.json();

        if (res.ok) {
            toastStore.show(data.message || '¡Mensaje enviado correctamente!', 'success');
            contactForm.nombre = '';
            contactForm.email = '';
            contactForm.mensaje = '';
        } else {
            toastStore.show(data.error || 'Error al enviar el mensaje.', 'error');
        }
    } catch (err) {
        toastStore.show('No se pudo conectar con el servidor. Intenta más tarde.', 'error');
    } finally {
        enviando.value = false;
    }
};
</script>

<style scoped>
</style>