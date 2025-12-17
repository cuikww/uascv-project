<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import EditorLayout from '@/components/EditorLayout.vue';
import { getMasterData, addMasterItem, updateMasterItem, deleteMasterItem } from '@/api/master.js';
import { getCvFullContent, toggleItemInCv } from '@/api/cv.js';

const route = useRoute();
const cvId = route.params.cvId;

const allSkills = ref([]);
const selectedSkillIds = ref(new Set());
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const loading = ref(false);

const form = ref({ skill_name: '', level: 'Intermediate' });

const fetchData = async () => {
    try {
        const [masterRes, cvRes] = await Promise.all([
            getMasterData('skills'),
            getCvFullContent(cvId)
        ]);
        allSkills.value = masterRes.data.data;
        const linkedSkills = cvRes.data.sections.skills || [];
        selectedSkillIds.value = new Set(linkedSkills.map(item => item.id));
    } catch(err) { console.error(err); }
};

const openAddModal = () => {
    isEditing.value = false;
    form.value = { skill_name: '', level: 'Intermediate' };
    showModal.value = true;
};

const handleEdit = (skill) => {
    isEditing.value = true;
    editingId.value = skill.id;
    form.value = { ...skill };
    showModal.value = true;
};

const handleSave = async () => {
    if(!form.value.skill_name) return alert("Nama skill wajib diisi");
    loading.value = true;
    try {
        if(isEditing.value) {
            await updateMasterItem('skills', editingId.value, form.value);
        } else {
            await addMasterItem('skills', form.value);
        }
        showModal.value = false;
        await fetchData();
    } catch(err) { alert('Gagal menyimpan'); }
    finally { loading.value = false; }
};

const handleToggle = async (skillId) => {
    try {
        if (selectedSkillIds.value.has(skillId)) selectedSkillIds.value.delete(skillId);
        else selectedSkillIds.value.add(skillId);
        await toggleItemInCv(cvId, 'skills', skillId);
    } catch (err) { alert("Gagal mengupdate CV"); fetchData(); }
};

const handleDelete = async (id) => {
    if(!confirm("Hapus Permanen? Item ini akan hilang dari semua CV.")) return;
    try {
        await deleteMasterItem('skills', id);
        fetchData();
    } catch(err) { alert("Gagal menghapus"); }
};

onMounted(fetchData);
</script>

<template>
  <EditorLayout>
    <header class="bg-white border-b border-gray-200 h-16 flex justify-between items-center px-8 shrink-0">
        <h1 class="text-lg font-bold text-gray-800">Keahlian (Skills)</h1>
    </header>

    <div class="h-full overflow-y-auto p-8 pb-32">
        <div class="max-w-3xl mx-auto">
            
            <button @click="openAddModal" class="w-full border-2 border-dashed border-gray-300 rounded-xl p-5 flex items-center justify-center gap-3 text-gray-500 hover:border-emerald-500 hover:text-emerald-600 bg-white mb-8 transition">
                <span class="text-2xl font-light">+</span> <span class="font-semibold">Tambah Skill Baru</span>
            </button>

            <h3 class="font-bold text-gray-700 mb-4">Master Data Skills:</h3>
            
            <div class="flex flex-wrap gap-3">
                <div 
                    v-for="skill in allSkills" 
                    :key="skill.id" 
                    @click="handleToggle(skill.id)"
                    :class="[
                        'pl-4 pr-3 py-2 rounded-full flex items-center gap-3 border transition select-none cursor-pointer group',
                        selectedSkillIds.has(skill.id) 
                            ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500' 
                            : 'bg-white border-gray-200 hover:border-gray-400'
                    ]"
                >
                    <div class="flex flex-col">
                        <span :class="['font-bold text-sm', selectedSkillIds.has(skill.id) ? 'text-emerald-800' : 'text-gray-700']">
                            {{ skill.skill_name }}
                        </span>
                        <span class="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                            {{ skill.level }}
                        </span>
                    </div>
                    
                    <div v-if="selectedSkillIds.has(skill.id)" class="text-emerald-600 text-lg font-bold">✓</div>
                    
                    <button @click.stop="handleEdit(skill)" class="w-6 h-6 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center transition" title="Edit Level">
                        ✎
                    </button>

                    <button @click.stop="handleDelete(skill.id)" class="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center font-bold transition">
                        &times;
                    </button>
                </div>
            </div>
            
            <div v-if="allSkills.length === 0" class="text-center text-gray-400 mt-10">
                Belum ada skill.
            </div>
        </div>
    </div>

    <div v-if="showModal" class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 class="text-lg font-bold text-gray-900">{{ isEditing ? 'Edit Skill' : 'Tambah Skill' }}</h3>
                <button @click="showModal = false" class="text-gray-400 text-2xl hover:text-red-500">×</button>
            </div>
            <div class="p-6 bg-white space-y-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Nama Skill</label>
                    <input v-model="form.skill_name" type="text" placeholder="Contoh: Vue.js" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Level</label>
                    <select v-model="form.level" class="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none">
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Expert</option>
                    </select>
                </div>
            </div>
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button @click="showModal = false" class="px-4 py-2 text-gray-600 border bg-white rounded-lg">Batal</button>
                <button @click="handleSave" :disabled="loading" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    {{ loading ? '...' : 'Simpan' }}
                </button>
            </div>
        </div>
    </div>
  </EditorLayout>
</template>