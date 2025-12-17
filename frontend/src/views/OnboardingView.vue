<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import NavbarDashboard from '@/components/NavbarDashboard.vue';
import { getAllCv, createCv, deleteCv } from "@/api/cv.js";

const cvs = ref([]);
const loading = ref(false);
const creating = ref(false);
const router = useRouter();

const fetchCvs = async () => {
  loading.value = true;
  try {
    const res = await getAllCv();
    cvs.value = res.data.data;
  } catch (err) { console.error(err); } 
  finally { loading.value = false; }
};

const handleCreate = async () => {
    creating.value = true;
    try {
        await createCv({ title: 'Untitled CV', template: 'modern' }); 
        await fetchCvs(); 
    } catch(err) { alert("Gagal membuat CV"); } 
    finally { creating.value = false; }
}

const handleDelete = async (id) => {
    if(!confirm("Yakin hapus CV ini?")) return;
    try {
        await deleteCv(id);
        await fetchCvs();
    } catch(err) { alert("Gagal hapus"); }
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
                        <span :class="['px-2.5 py-1 text-xs font-bold rounded uppercase', cv.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600']">{{ cv.status }}</span>
                        <button @click.stop="handleDelete(cv.id)" class="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition z-10">🗑️</button>
                    </div>
                    <h3 class="pl-2 text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition truncate">{{ cv.title || 'Tanpa Judul' }}</h3>
                    <p class="pl-2 text-sm text-gray-500 mb-6">Template: {{ cv.template }}</p>
                </div>
                <button @click="goToDetail(cv.id)" class="w-full border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition bg-white">Edit Detail</button>
            </div>
        </div>
    </main>
  </div>
</template>