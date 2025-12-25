<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { isLoggedIn } from '@/stores/auth';

const router = useRouter();

onMounted(() => {
    if (isLoggedIn.value) {
        router.push('/onboarding');
    }
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-100 fixed w-full top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <div class="text-2xl font-bold text-emerald-600 tracking-tight">UASCV.</div>
            <div class="flex items-center gap-6">
                <router-link to="/auth/login" class="text-gray-900 font-medium hover:text-emerald-600 transition">Masuk</router-link>
                <router-link to="/auth/register" class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-emerald-200 transition transform hover:-translate-y-0.5">
                    Daftar Sekarang
                </router-link>
            </div>
        </div>
    </nav>

    <div class="pt-32 pb-20 px-6">
        <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div>
                <div class="inline-block bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-emerald-100">
                    ✨ Buat CV dalam 5 Menit
                </div>
                <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                    Karir Impian Dimulai <br>
                    <span class="text-emerald-600">Dari Sini.</span>
                </h1>
                <p class="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                    Platform pembuat CV otomatis yang membantu mahasiswa dan profesional mendapatkan pekerjaan dengan template standar industri.
                </p>
                <div class="flex gap-4">
                    <router-link to="/auth/register" class="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition">
                        Buat CV Gratis
                    </router-link>
                </div>
            </div>
            
            <div class="relative hidden lg:block">
                <div class="absolute -top-10 -right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div class="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 relative transform rotate-2 hover:rotate-0 transition duration-500">
                    <div class="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                        Preview Template CV
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>