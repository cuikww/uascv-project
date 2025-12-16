<script setup>
import { ref, computed } from "vue";
import { register } from "@/api/auth.js";
import { useRouter } from "vue-router";

const fullname = ref("");
const email = ref("");
const password = ref("");
const msg = ref("");
const loading = ref(false); // Tambah state loading agar UX lebih bagus

const router = useRouter();

// Validasi Password
const passwordError = computed(() => {
  if (!password.value) return ""; // Jangan merah kalau belum ketik apa-apa
  if (password.value.length < 8) return "Password minimal 8 karakter";
  return "";
});

const handleRegister = async () => {
  // Double check validasi
  if (password.value.length < 8) return;

  loading.value = true;
  msg.value = "";
  
  try {
    await register({
      fullname: fullname.value,
      email: email.value,
      password: password.value,
    });

    msg.value = "Registrasi berhasil! Mengalihkan...";
    setTimeout(() => {
        router.push("/auth/login");
    }, 1500);
    
  } catch (err) {
    msg.value = err.response?.data?.message || "Gagal melakukan registrasi.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl border border-gray-100">
      
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-emerald-600 mb-2">UASCV.</h2>
        <h3 class="text-xl font-semibold text-gray-800">Buat Akun Baru</h3>
        <p class="text-gray-500 text-sm mt-1">Mulai perjalanan karir profesional Anda</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        
        <div v-if="msg" :class="['text-sm p-3 rounded-lg border text-center', msg.includes('berhasil') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100']">
            {{ msg }}
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
            <input 
                v-model="fullname" 
                type="text" 
                required
                placeholder="Contoh: I Nengah Dwi" 
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-gray-800"
            />
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input 
                v-model="email" 
                type="email" 
                required
                placeholder="nama@email.com" 
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-gray-800"
            />
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input 
                v-model="password" 
                type="password" 
                required
                placeholder="Minimal 8 karakter" 
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-gray-800"
                :class="{'border-red-500 focus:ring-red-200': passwordError}"
            />
            <p v-if="passwordError" class="text-xs text-red-500 mt-1">{{ passwordError }}</p>
        </div>

        <button 
            :disabled="!!passwordError || loading || !password" 
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-emerald-100 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
        >
            {{ loading ? 'Mendaftarkan...' : 'Daftar Sekarang' }}
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-gray-100 text-center">
        <p class="text-sm text-gray-500">
            Sudah punya akun? <router-link to="/auth/login" class="text-emerald-600 font-bold hover:underline">Masuk di sini</router-link>
        </p>
      </div>

    </div>
  </div>
</template>