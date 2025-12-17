<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import EditorLayout from '@/components/EditorLayout.vue';
import { getMasterData, addMasterItem, updateMasterItem, deleteMasterItem } from '@/api/master.js';
import { getCvFullContent, toggleItemInCv } from '@/api/cv.js';

const route = useRoute();
const cvId = route.params.cvId;

const allEducations = ref([]);
const selectedIds = ref(new Set());
const showModal = ref(false);
const loading = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const form = ref({
    institution: '', degree: 'Sarjana (S1)', field_of_study: '', start_date: '', end_date: '', current: false, description: ''
});

const fetchData = async () => {
    try {
        const [masterRes, cvRes] = await Promise.all([
            getMasterData('educations'),
            getCvFullContent(cvId)
        ]);
        allEducations.value = masterRes.data.data;
        const linked = cvRes.data.sections.educations || [];
        selectedIds.value = new Set(linked.map(i => i.id));
    } catch (err) { console.error(err); }
};

const openAddModal = () => {
    isEditing.value = false;
    editingId.value = null;
    form.value = { institution: '', degree: 'Sarjana (S1)', field_of_study: '', start_date: '', end_date: '', current: false, description: '' };
    showModal.value = true;
};

const handleEdit = (item) => {
    isEditing.value = true;
    editingId.value = item.id;
    form.value = { ...item };
    showModal.value = true;
};

const handleSave = async () => {
    if(!form.value.institution || !form.value.start_date) return alert("Wajib diisi!");
    loading.value = true;
    try {
        if(isEditing.value) {
            await updateMasterItem('educations', editingId.value, form.value);
        } else {
            await addMasterItem('educations', form.value);
        }
        showModal.value = false;
        await fetchData();
    } catch (err) { alert('Gagal simpan'); }
    finally { loading.value = false; }
};

const handleToggle = async (id) => {
    try {
        if (selectedIds.value.has(id)) selectedIds.value.delete(id);
        else selectedIds.value.add(id);
        await toggleItemInCv(cvId, 'educations', id);
    } catch (err) { alert("Gagal update"); fetchData(); }
};

const handleDelete = async (id) => {
    if(confirm('Hapus permanen dari Master Data?')) {
        await deleteMasterItem('educations', id);
        fetchData();
    }
}

onMounted(fetchData);
</script>

<template>
  <EditorLayout>
    <header class="bg-white border-b border-gray-200 h-16 flex justify-between items-center px-8 shrink-0">
        <h1 class="text-lg font-bold text-gray-800">Riwayat Pendidikan</h1>
    </header>

    <div class="h-full overflow-y-auto p-8 pb-32">
        <div class="max-w-3xl mx-auto">
            <button @click="openAddModal" class="w-full border-2 border-dashed border-gray-300 rounded-xl p-5 flex items-center justify-center gap-3 text-gray-500 hover:border-emerald-500 hover:text-emerald-600 bg-white mb-8 transition">
                <span class="text-2xl font-light">+</span> <span class="font-semibold">Tambah Pendidikan Baru</span>
            </button>

            <h3 class="font-bold text-gray-700 mb-4">Master Data Anda:</h3>

            <div v-for="edu in allEducations" :key="edu.id" 
                :class="['rounded-xl border p-4 mb-4 flex gap-4 transition cursor-pointer relative group', 
                selectedIds.has(edu.id) ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-gray-200 hover:border-gray-300']"
                @click="handleToggle(edu.id)"
            >
                <div :class="['w-6 h-6 rounded border flex items-center justify-center mt-1 shrink-0 transition', selectedIds.has(edu.id) ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-300 group-hover:border-emerald-400']">
                    <span v-if="selectedIds.has(edu.id)" class="text-xs font-bold">✓</span>
                </div>
                <div class="flex-1">
                    <h3 class="font-bold text-gray-900">{{ edu.institution }}</h3>
                    <p class="text-sm text-gray-600">{{ edu.degree }} • {{ edu.field_of_study }}</p>
                    <p class="text-xs text-gray-400 mt-1">
                        {{ new Date(edu.start_date).getFullYear() }} - {{ edu.current ? 'Sekarang' : new Date(edu.end_date).getFullYear() }}
                    </p>
                </div>
                
                <div class="flex flex-col gap-2 z-10" @click.stop>
                    <button @click="handleEdit(edu)" class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition" title="Edit">
                        ✏️
                    </button>
                    <button @click="handleDelete(edu.id)" class="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition" title="Hapus">
                        🗑️
                    </button>
                </div>
            </div>
            
            <div v-if="allEducations.length === 0" class="text-center text-gray-400">Belum ada data master.</div>
        </div>
    </div>

    <div v-if="showModal" class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[90%] overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 class="text-lg font-bold text-gray-900">{{ isEditing ? 'Edit Pendidikan' : 'Tambah Pendidikan' }}</h3>
                <button @click="showModal = false" class="text-gray-400 text-2xl hover:text-red-500">×</button>
            </div>
            <div class="p-6 overflow-y-auto bg-white">
                <div class="grid grid-cols-2 gap-5">
                    <div class="col-span-2"><label class="block text-sm font-bold text-gray-700 mb-1">Institusi *</label><input v-model="form.institution" type="text" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"></div>
                    <div><label class="block text-sm font-bold text-gray-700 mb-1">Jenjang</label><select v-model="form.degree" class="w-full px-4 py-2 border rounded-lg bg-white"><option>SMA/SMK</option><option>Diploma (D3)</option><option>Sarjana (S1)</option><option>Magister (S2)</option></select></div>
                    <div><label class="block text-sm font-bold text-gray-700 mb-1">Jurusan</label><input v-model="form.field_of_study" type="text" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"></div>
                    <div><label class="block text-sm font-bold text-gray-700 mb-1">Mulai *</label><input v-model="form.start_date" type="date" class="w-full px-4 py-2 border rounded-lg"></div>
                    <div><label class="block text-sm font-bold text-gray-700 mb-1">Selesai</label><input v-model="form.end_date" :disabled="form.current" type="date" class="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"></div>
                    <div class="col-span-2"><label class="flex items-center gap-2"><input v-model="form.current" type="checkbox" class="w-4 h-4 text-emerald-600 rounded"><span>Masih sekolah di sini</span></label></div>
                </div>
            </div>
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button @click="showModal = false" class="px-5 py-2 text-gray-600 border bg-white rounded-lg">Batal</button>
                <button @click="handleSave" :disabled="loading" class="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
                    {{ loading ? 'Simpan...' : (isEditing ? 'Update Data' : 'Simpan Baru') }}
                </button>
            </div>
        </div>
    </div>
  </EditorLayout>
</template>