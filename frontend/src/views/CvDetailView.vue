<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getCvFullContent, updateCvMetadata } from "@/api/cv.js";
import { getMasterProfile, saveMasterProfile } from "@/api/profile.js";
import EditorLayout from '@/components/EditorLayout.vue'; 

const route = useRoute();
const cvId = route.params.cvId;

const cvData = ref({ title: '', status: 'draft', template: 'modern' });
const profileForm = ref({});
const saving = ref(false);
const message = ref("");

const fetchAll = async () => {
    try {
        // 1. Ambil Data CV (Judul, Status)
        const cvRes = await getCvFullContent(cvId);
        cvData.value = cvRes.data.cv_info; // Perhatikan struktur response dari backend

        // 2. Ambil Data Profil Master User
        const profileRes = await getMasterProfile();
        profileForm.value = profileRes.data.data;
    } catch(err) { console.error(err); }
};

const handleSave = async () => {
    saving.value = true;
    message.value = "";
    try {
        // Simpan Metadata CV
        await updateCvMetadata(cvId, { 
            title: cvData.value.title, 
            status: cvData.value.status,
            template: cvData.value.template 
        });

        // Simpan Profil Master (Berlaku untuk semua CV)
        await saveMasterProfile(profileForm.value);

        message.value = "Berhasil disimpan!";
        setTimeout(() => message.value = "", 3000);
    } catch(err) {
        alert("Gagal menyimpan: " + (err.response?.data?.message || err.message));
    } finally {
        saving.value = false;
    }
}

onMounted(fetchAll);
</script>

<template>
  <EditorLayout>
    <header class="bg-white border-b border-gray-200 h-16 flex justify-between items-center px-8 shrink-0 sticky top-0 z-30">
        <h1 class="text-lg font-bold text-gray-800">Informasi Dasar</h1>
        <div class="flex items-center gap-3">
            <span v-if="message" class="text-xs text-emerald-600 font-bold uppercase tracking-wide mr-2 animate-pulse">{{ message }}</span>
            <button @click="handleSave" :disabled="saving" class="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition disabled:opacity-50">
                {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
        </div>
    </header>

    <div class="h-full overflow-y-auto p-8 pb-32">
        <div class="max-w-4xl mx-auto">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="w-full max-w-md">
                    <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Judul Dokumen</label>
                    <input v-model="cvData.title" type="text" class="text-2xl font-bold text-gray-900 w-full border-b border-transparent focus:border-emerald-500 outline-none pb-1 hover:border-gray-300 transition bg-transparent placeholder-gray-300" placeholder="Nama CV..." />
                </div>
                <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <span class="text-sm font-semibold text-gray-600">Status:</span>
                    <select v-model="cvData.status" class="bg-transparent text-sm font-medium text-gray-900 outline-none cursor-pointer">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-gray-50/50 px-8 py-5 border-b border-gray-100 flex justify-between items-center">
                    <h2 class="text-lg font-bold text-emerald-800 flex items-center gap-2">👤 Kontak & Profil</h2>
                    <span class="text-xs text-orange-500 font-medium bg-orange-50 px-2 py-1 rounded border border-orange-100">Master Data (Sync ke semua CV)</span>
                </div>
                
                <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label class="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label><input v-model="profileForm.fullname" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                    <div><label class="block text-sm font-semibold text-gray-700 mb-2">Email</label><input v-model="profileForm.email" type="email" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                    <div><label class="block text-sm font-semibold text-gray-700 mb-2">No. Handphone</label><input v-model="profileForm.phone_number" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                    <div><label class="block text-sm font-semibold text-gray-700 mb-2">LinkedIn URL</label><input v-model="profileForm.linkedin_url" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                    
                    <div class="md:col-span-2"><label class="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap</label><input v-model="profileForm.address" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" /></div>

                    <div><label class="block text-xs font-semibold text-gray-500 mb-1">Kota</label><input v-model="profileForm.city" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500 outline-none" /></div>
                    <div><label class="block text-xs font-semibold text-gray-500 mb-1">Provinsi</label><input v-model="profileForm.province" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500 outline-none" /></div>
                    <div><label class="block text-xs font-semibold text-gray-500 mb-1">Negara</label><input v-model="profileForm.country" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500 outline-none" /></div>
                    <div><label class="block text-xs font-semibold text-gray-500 mb-1">Kode Pos</label><input v-model="profileForm.postal_code" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500 outline-none" /></div>

                    <div class="md:col-span-2 mt-2"><label class="block text-sm font-semibold text-gray-700 mb-2">Ringkasan Profil</label><textarea v-model="profileForm.profile_summary" rows="4" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none resize-none" placeholder="Ceritakan singkat pengalaman profesional Anda..."></textarea></div>
                </div>
            </div>
        </div>
    </div>
  </EditorLayout>
</template>