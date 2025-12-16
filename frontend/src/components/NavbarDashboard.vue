<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
// HAPUS useCounterStore, GANTI dengan isLoggedIn
import { isLoggedIn } from '@/stores/auth'; 

const userInitials = computed(() => {
    // Ambil data user dari localStorage (disimpan saat login)
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if(user.fullname) {
            return user.fullname.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
        }
    } catch (e) {
        return 'ME';
    }
    return 'ME';
});

const userName = computed(() => {
     try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.fullname || 'Pengguna';
     } catch (e) {
        return 'Pengguna';
     }
});

const router = useRouter();

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Update state global agar redirect berfungsi
    isLoggedIn.value = false; 
    
    router.push('/auth/login');
}
</script>

<template>
  <nav class="bg-white border-b border-gray-200 px-4 sm:px-8 h-16 flex justify-between items-center sticky top-0 z-30">
    <router-link to="/onboarding" class="font-bold text-xl text-emerald-600 tracking-tight flex items-center gap-1">
      UASCV.<span class="text-gray-400 font-normal text-sm">Dashboard</span>
    </router-link>
    
    <div class="flex items-center gap-4">
        <div class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition group">
            <div class="text-right hidden sm:block">
                <div class="text-sm font-bold text-gray-800">{{ userName }}</div>
                <div class="text-xs text-emerald-500 font-medium">Online</div>
            </div>
            <div class="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border border-emerald-200 shadow-sm">
                {{ userInitials }}
            </div>
        </div>
        <button @click="logout" class="text-gray-400 hover:text-red-500 text-sm font-medium ml-2 transition">
            Keluar
        </button>
    </div>
  </nav>
</template>