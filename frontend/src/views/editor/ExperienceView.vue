<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import EditorLayout from '@/components/EditorLayout.vue';
import { getMasterData, addMasterItem, updateMasterItem, deleteMasterItem } from '@/api/master.js';
import { getCvFullContent, toggleItemInCv } from '@/api/cv.js';

const route = useRoute();
const cvId = route.params.cvId;

const allExperiences = ref([]);
const selectedIds = ref(new Set());
const showModal = ref(false);
const loading = ref(false);

// State untuk Mode Edit
const isEditing = ref(false);
const editingId = ref(null);

const form = ref({
    position: '', company: '', location: '', start_date: '', end_date: '', current: false, description: ''
});

const fetchData = async () => {
    try {
        const [masterRes, cvRes] = await Promise.all([
            getMasterData('experiences'),
            getCvFullContent(cvId)
        ]);
        allExperiences.value = masterRes.data.data;
        const linked = cvRes.data.sections.experiences || [];
        selectedIds.value = new Set(linked.map(i => i.id));
    } catch (err) { console.error(err); }
};

// [BARU] Fungsi Buka Modal Edit
const handleEdit = (item) => {
    isEditing.value = true;
    editingId.value = item.id;
    
    // Copy data item ke form (gunakan spread operator agar reaktifitas aman)
    form.value = { ...item }; 
    
    showModal.value = true;
};

// [BARU] Fungsi Buka Modal Tambah (Reset Form)
const openAddModal = () => {
    isEditing.value = false;
    editingId.value = null;
    form.value = { position: '', company: '', location: '', start_date: '', end_date: '', current: false, description: '' };
    showModal.value = true;
};

const handleSave = async () => {
    if(!form.value.position || !form.value.company || !form.value.start_date) return alert("Data wajib diisi!");
    loading.value = true;
    try {
        if (isEditing.value) {
            // [LOGIC UPDATE]
            await updateMasterItem('experiences', editingId.value, form.value);
        } else {
            // [LOGIC CREATE]
            await addMasterItem('experiences', form.value);
        }
        
        showModal.value = false;
        await fetchData();
    } catch(err) { alert('Gagal menyimpan'); } 
    finally { loading.value = false; }
};

const handleToggle = async (id) => {
    try {
        if (selectedIds.value.has(id)) selectedIds.value.delete(id);
        else selectedIds.value.add(id);
        await toggleItemInCv(cvId, 'experiences', id);
    } catch (err) { alert("Gagal update"); fetchData(); }
};

const handleDelete = async (id) => {
    if(confirm('Hapus permanen dari Master Data?')) {
        await deleteMasterItem('experiences', id);
        fetchData();
    }
}

onMounted(fetchData);
</script>

<template>
  <EditorLayout>
    <header class="bg-white border-b border-gray-200 h-16 flex justify-between items-center px-8 shrink-0">
        <h1 class="text-lg font-bold text-gray-800">Riwayat Pengalaman</h1>
    </header>

    <div class="h-full overflow-y-auto p-8 pb-32">
        <div class="max-w-3xl mx-auto">
            <button @click="openAddModal" class="w-full border-2 border-dashed border-gray-300 rounded-xl p-5 flex items-center justify-center gap-3 text-gray-500 hover:border-emerald-500 hover:text-emerald-600 bg-white mb-8 transition">
                <span class="text-2xl font-light">+</span> <span class="font-semibold">Buat Pengalaman Baru</span>
            </button>

            <h3 class="font-bold text-gray-700 mb-4">Master Data Anda:</h3>
            
            <div v-for="exp in allExperiences" :key="exp.id" 
                :class="['rounded-xl border p-4 mb-4 flex gap-4 transition cursor-pointer relative group', 
                selectedIds.has(exp.id) ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-gray-200 hover:border-gray-300']"
                @click="handleToggle(exp.id)"
            >
                <div :class="['w-6 h-6 rounded border flex items-center justify-center mt-1 shrink-0 transition', selectedIds.has(exp.id) ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-300 group-hover:border-emerald-400']">
                    <span v-if="selectedIds.has(exp.id)" class="text-xs font-bold">✓</span>
                </div>

                <div class="flex-1">
                    <h3 class="font-bold text-gray-900">{{ exp.position }}</h3>
                    <p class="text-sm text-gray-600">{{ exp.company }} • {{ exp.location || 'Remote' }}</p>
                    <p class="text-xs text-gray-400 mt-1">
                        {{ new Date(exp.start_date).getFullYear() }} - {{ exp.current ? 'Sekarang' : (exp.end_date ? new Date(exp.end_date).getFullYear() : '...') }}
                    </p>
                </div>

                <div class="flex flex-col gap-2 z-10" @click.stop>
                     <button @click="handleEdit(exp)" class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition" title="Edit Detail">
                        ✏️
                    </button>
                    <button @click="handleDelete(exp.id)" class="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition" title="Hapus Permanen">
                        🗑️
                    </button>
                </div>
            </div>
            
            <div v-if="allExperiences.length === 0" class="text-center text-gray-400">Belum ada data master.</div>
        </div>
    </div>

    <div v-if="showModal" class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90%] overflow-hidden animate-in zoom-in duration-200">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 class="text-lg font-bold text-gray-900">{{ isEditing ? 'Edit Pengalaman' : 'Tambah Pengalaman Baru' }}</h3>
                <button @click="showModal = false" class="text-gray-400 text-2xl hover:text-red-500">×</button>
            </div>
            <div class="p-6 overflow-y-auto bg-white">
                <div class="grid grid-cols-2 gap-5">
                    <div class="col-span-2"><label class="block text-sm font-bold text-gray-700 mb-1">Posisi *</label><input v-model="form.position" type="text" class="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"></div>
                    <div><label class="block text-sm font-bold text-gray-700 mb-1">Perusahaan *</label><input v-model="form.company" type="text" class="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"></div>
                    <div><label class="block text-sm font-bold text-gray-700 mb-1">Lokasi</label><input v-model="form.location" type="text" class="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"></div>
                    <div><label class="block text-sm font-bold text-gray-700 mb-1">Mulai *</label><input v-model="form.start_date" type="date" class="w-full px-4 py-2 border rounded-lg"></div>
                    <div><label class="block text-sm font-bold text-gray-700 mb-1">Selesai</label><input v-model="form.end_date" :disabled="form.current" type="date" class="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"></div>
                    <div class="col-span-2"><label class="flex items-center gap-2"><input v-model="form.current" type="checkbox" class="w-4 h-4 text-emerald-600 rounded"><span>Masih bekerja di sini</span></label></div>
                    <div class="col-span-2"><label class="block text-sm font-bold text-gray-700 mb-1">Deskripsi</label><textarea v-model="form.description" rows="4" class="w-full px-4 py-3 border rounded-lg resize-none" placeholder="Deskripsi pekerjaan..."></textarea></div>
                </div>
            </div>
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button @click="showModal = false" class="px-5 py-2 text-gray-600 border bg-white rounded-lg">Batal</button>
                <button @click="handleSave" :disabled="loading" class="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
                    {{ loading ? 'Menyimpan...' : (isEditing ? 'Update Data' : 'Simpan Baru') }}
                </button>
            </div>
        </div>
    </div>
  </EditorLayout>
</template>