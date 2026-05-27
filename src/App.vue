<script setup>
  import { onMounted } from 'vue';
  import { useSessionStore } from '@/modules/auth/stores/sessionStore';
  import { useRecordsStore } from '@/modules/public/stores/recordsStore';
  import MainNavbar from '@/modules/public/components/MainNavbar.vue';
  import FooterComponent from '@/modules/public/components/FooterComponent.vue';
  import CartSidebar from '@/modules/public/components/CartSidebar.vue';
  import ToastSystem from '@/modules/public/components/ToastSystem.vue';

  const sessionStore = useSessionStore();
  const recordsStore = useRecordsStore();

  onMounted(async () => {
    await sessionStore.checkSession();
    await recordsStore.fetchProductos();
  });
</script>

<template>
  <div class="app-shell">
    <MainNavbar />
    <main class="contenedor-pagina">
      <RouterView />
    </main>
    <FooterComponent />
    <CartSidebar />
    <ToastSystem />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: radial-gradient(circle at top left, rgba(255, 107, 53, 0.08), transparent 40%),
              radial-gradient(circle at bottom right, rgba(78, 205, 196, 0.08), transparent 40%),
              linear-gradient(180deg, #fffaf5 0%, #f0faf9 100%);
}

.contenedor-pagina {
  min-height: calc(100vh - 80px);
}
</style>
