<script setup>
import { ref, onMounted } from "vue";
import { getAllCv, createCv, deleteCv } from "@/api/cv.js";
import { useRouter } from "vue-router";
import NavbarDashboard from '@/components/NavbarDashboard.vue';

const cvs = ref([]);
const loading = ref(false);
const creating = ref(false);
const router = useRouter();

// --- Logic API ---
const fetchCvs = async () => {
  loading.value = true;
  try {
    const res = await getAllCv();
    cvs.value = res.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleCreate = async () => {
    creating.value = true;
    try {
        // Default template & level (Phase 1 logic)
        await createCv({ career_level: 'fresh_graduate' }); 
        await fetchCvs(); // Refresh list
    } catch(err) {
        alert("Gagal membuat CV");
    } finally {
        creating.value = false;
    }
}

const handleDelete = async (id) => {
    if(!confirm("Yakin hapus?")) return;
    try {
        await deleteCv(id);
        await fetchCvs();
    } catch(err) {
        alert("Gagal hapus");
    }
}

const goToDetail = (id) => router.push(`/basicdetails/${id}`);

onMounted(fetchCvs);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <NavbarDashboard />

    <main class="p-4 sm:p-8 max-w-6xl mx-auto">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">CV Saya</h1>
                <p class="text-gray-500 mt-1">Kelola dan edit daftar riwayat hidup Anda.</p>
            </div>
            <button @click="handleCreate" :disabled="creating" class="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 shadow-md flex items-center gap-2 transition disabled:opacity-50">
                <span class="text-xl leading-none">+</span> {{ creating ? 'Membuat...' : 'Buat CV Baru' }}
            </button>
        </div>

        <div v-if="loading" class="text-center py-20 text-gray-500">Memuat data CV...</div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div v-for="cv in cvs" :key="cv.id" class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition group relative overflow-hidden flex flex-col justify-between">
                <div :class="['absolute top-0 left-0 w-1 h-full', cv.status === 'published' ? 'bg-emerald-500' : 'bg-gray-300']"></div>
                
                <div>
                    <div class="flex justify-between items-start mb-3 pl-2">
                        <span :class="['px-2.5 py-1 text-xs font-bold rounded uppercase', cv.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600']">
                            {{ cv.status }}
                        </span>
                        <button @click.stop="handleDelete(cv.id)" class="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                    <h3 class="pl-2 text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition truncate">{{ cv.title || 'Tanpa Judul' }}</h3>
                    <p class="pl-2 text-sm text-gray-500 mb-6">Level: {{ cv.career_level === 'fresh_graduate' ? 'Fresh Graduate' : 'Profesional' }}</p>
                </div>

                <button @click="goToDetail(cv.id)" class="w-full border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition bg-white">
                    Edit Detail
                </button>
            </div>

            <button @click="handleCreate" class="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50/50 transition h-full min-h-[220px]">
                <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition">
                    <span class="text-2xl font-light">+</span>
                </div>
                <span class="font-medium">Tambah CV Baru</span>
            </button>

        </div>
    </main>
  </div>
</template>