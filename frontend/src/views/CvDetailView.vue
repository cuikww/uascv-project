<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getCv, updateCv } from "@/api/cv.js";
import { getCvBasicInfoById, saveCvBasicInfo } from "@/api/basic.js";

const route = useRoute();
const cvId = route.params.cvId;

const cvData = ref(null);
const basicInfoForm = ref({});
const saving = ref(false);
const message = ref("");

const fetchAll = async () => {
    try {
        const [cvRes, basicRes] = await Promise.all([
            getCv(cvId),
            getCvBasicInfoById(cvId)
        ]);
        cvData.value = cvRes.data.data;
        if(basicRes.data.data) basicInfoForm.value = { ...basicRes.data.data };
    } catch(err) { console.error(err); }
};

const handleSave = async () => {
    saving.value = true;
    message.value = "";
    try {
        // Save Status/Title
        await updateCv(cvId, { title: cvData.value.title, status: cvData.value.status });
        // Save Basic Info
        await saveCvBasicInfo(cvId, basicInfoForm.value);
        message.value = "Berhasil disimpan!";
        setTimeout(() => message.value = "", 3000);
    } catch(err) {
        alert("Gagal menyimpan");
    } finally {
        saving.value = false;
    }
}

onMounted(fetchAll);
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <div class="bg-white border-b border-gray-200 h-16 flex justify-between items-center px-4 sm:px-6 sticky top-0 z-40 shadow-sm">
        <router-link to="/onboarding" class="text-gray-500 hover:text-gray-900 font-medium flex items-center gap-2 transition">
            <span>←</span> Kembali
        </router-link>
        <div class="flex items-center gap-3">
            <span v-if="message" class="text-xs text-emerald-600 font-bold uppercase tracking-wide mr-2 animate-pulse">{{ message }}</span>
            <button class="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Preview</button>
            <button @click="handleSave" :disabled="saving" class="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition disabled:opacity-50">
                {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
        </div>
    </div>

    <main v-if="cvData" class="max-w-4xl mx-auto py-8 px-4 sm:px-6">
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
            <div class="bg-gray-50/50 px-8 py-5 border-b border-gray-100">
                <h2 class="text-lg font-bold text-emerald-800 flex items-center gap-2">
                    👤 Informasi Dasar
                </h2>
            </div>
            
            <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">No. Handphone</label>
                    <input v-model="basicInfoForm.phone_number" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Tanggal Lahir</label>
                    <input v-model="basicInfoForm.date_of_birth" type="date" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-gray-600" />
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">LinkedIn URL</label>
                    <input v-model="basicInfoForm.linkedin_url" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">GitHub URL</label>
                    <input v-model="basicInfoForm.github_url" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
                </div>
                
                <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap</label>
                    <input v-model="basicInfoForm.address" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1">Kota</label>
                    <input v-model="basicInfoForm.city" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1">Provinsi</label>
                    <input v-model="basicInfoForm.province" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1">Negara</label>
                    <input v-model="basicInfoForm.country" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1">Kode Pos</label>
                    <input v-model="basicInfoForm.postal_code" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500 outline-none" />
                </div>

                <div class="md:col-span-2 mt-2">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Ringkasan Profil</label>
                    <textarea v-model="basicInfoForm.profile_summary" rows="4" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition resize-none" placeholder="Ceritakan singkat pengalaman profesional Anda..."></textarea>
                </div>
            </div>
        </div>
    </main>
  </div>
</template>