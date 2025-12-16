<script setup>
import { ref } from "vue";
import { login } from "@/api/auth.js";
import { useRouter } from "vue-router";
import { isLoggedIn } from "@/stores/auth.js"; // Atau pakai Pinia store

const email = ref("");
const password = ref("");
const msg = ref("");
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  msg.value = "";
  try {
    const response = await login({
      email: email.value,
      password: password.value,
    });
    
    // Simpan Token & User Info
    localStorage.setItem("token", response.data.token);
    // Simpan data user untuk ditampilkan di dashboard (opsional tapi bagus)
    localStorage.setItem("user", JSON.stringify(response.data.user));
    
    isLoggedIn.value = true; // Update global state
    router.push("/onboarding");
  } catch (err) {
    msg.value = err.response?.data?.message || "Email atau password salah.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl border border-gray-100">
        <div class="text-center mb-8">
            <router-link to="/" class="block text-3xl font-bold text-emerald-600 mb-2">UASCV.</router-link>
            <h2 class="text-xl font-semibold text-gray-800">Selamat Datang Kembali</h2>
            <p class="text-gray-500 text-sm mt-1">Masuk untuk mengelola karir Anda</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
            <div v-if="msg" class="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center">
                {{ msg }}
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input v-model="email" type="email" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-gray-800" placeholder="nama@email.com" />
            </div>
            <div>
                <div class="flex justify-between mb-1.5">
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                </div>
                <input v-model="password" type="password" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-gray-800" placeholder="••••••••" />
            </div>

            <button :disabled="loading" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-emerald-100 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
                {{ loading ? 'Memproses...' : 'Masuk' }}
            </button>
        </form>

        <div class="mt-8 pt-6 border-t border-gray-100 text-center">
            <p class="text-sm text-gray-500">
                Belum punya akun? <router-link to="/auth/register" class="text-emerald-600 font-bold hover:underline">Daftar sekarang</router-link>
            </p>
        </div>
    </div>
  </div>
</template>