<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import EditorLayout from '@/components/EditorLayout.vue';
import { getMasterProfile, saveMasterProfile } from '@/api/profile.js';
import { getCvFullContent } from '@/api/cv.js';
import { generateSummary } from '@/api/ai.js';

const route = useRoute();
const cvId = route.params.cvId;

const profile = ref({ fullname: '', profile_summary: '' });
const loading = ref(false);
const message = ref("");

const aiLoading = ref(false);
const targetJob = ref('');
const experienceLevel = ref('Mid-Level');
const aiKeywords = ref('');

const hasContext = ref(false);

const fetchData = async () => {
    try {
        const [profileRes, cvRes] = await Promise.all([
            getMasterProfile(),
            getCvFullContent(cvId)
        ]);

        profile.value = profileRes.data.data || { fullname: '', profile_summary: '' };

        const cvInfo = cvRes.data.cv_info || {};
        if (cvInfo.target_job_title) {
            targetJob.value = cvInfo.target_job_title;
            hasContext.value = true;
        }

    } catch(err) { console.error(err); }
};

const handleSave = async () => {
    loading.value = true;
    message.value = "";
    try {
        await saveMasterProfile(profile.value);
        message.value = "Ringkasan berhasil disimpan!";
        setTimeout(() => message.value = "", 3000);
    } catch(err) { alert("Gagal menyimpan"); }
    finally { loading.value = false; }
};

const handleGenerateAI = async () => {
    if(!targetJob.value || !aiKeywords.value) return alert("Mohon isi Target Posisi dan Keywords.");
    
    aiLoading.value = true;
    try {
        const res = await generateSummary({
            fullname: profile.value.fullname || 'Saya',
            jobTitle: targetJob.value,
            experience_level: experienceLevel.value,
            keywords: aiKeywords.value
        });
        
        profile.value.profile_summary = res.data.result;
    } catch(err) { 
        alert("Gagal generate AI."); 
    } finally { 
        aiLoading.value = false; 
    }
};

onMounted(fetchData);
</script>

<template>
  <EditorLayout>
    <header class="bg-white border-b border-gray-200 h-16 flex justify-between items-center px-8 shrink-0 sticky top-0 z-30">
        <h1 class="text-lg font-bold text-gray-800">Ringkasan Profesional</h1>
        <div class="flex items-center gap-3">
             <span v-if="message" class="text-xs text-emerald-600 font-bold uppercase tracking-wide mr-2 animate-pulse">{{ message }}</span>
             <span class="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500 font-mono">{{ profile.profile_summary?.length || 0 }} / 600 chars</span>
        </div>
    </header>

    <div class="h-full overflow-y-auto p-8 pb-32">
        <div class="max-w-3xl mx-auto">
            
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg shadow-sm">
                <div class="flex items-start gap-3">
                    <span class="text-xl">💡</span>
                    <div>
                        <h4 class="font-bold text-blue-900 text-sm">Tips Menulis Ringkasan</h4>
                        <p class="text-blue-800 text-sm mt-1 leading-relaxed">
                            Ringkasan adalah 'elevator pitch' Anda. Fokus pada nilai tambah unik yang bisa Anda berikan.
                        </p>
                    </div>
                </div>
            </div>

            <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 shadow-sm relative overflow-hidden">
                <div class="flex justify-between items-center mb-4 relative z-10">
                     <h3 class="font-bold text-emerald-900 text-sm uppercase tracking-wider flex items-center gap-2">
                        ✨ AI Writer Assistant
                     </h3>
                     <span v-if="hasContext" class="bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-300 shadow-sm flex items-center gap-1">
                        🎯 Auto-Target: {{ targetJob }}
                     </span>
                     <span v-else class="bg-white text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100 shadow-sm">BETA</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 relative z-10">
                    <div>
                        <label class="block text-xs font-bold text-emerald-800 mb-1">Target Posisi</label>
                        <input v-model="targetJob" type="text" placeholder="Contoh: Fullstack Developer" class="w-full px-3 py-2 border border-emerald-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                    </div>
                    <div>
                         <label class="block text-xs font-bold text-emerald-800 mb-1">Level Pengalaman</label>
                         <select v-model="experienceLevel" class="w-full px-3 py-2 border border-emerald-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                             <option>Fresh Graduate</option>
                             <option>Mid-Level</option>
                             <option>Senior / Expert</option>
                             <option>Managerial</option>
                         </select>
                    </div>
                    <div class="sm:col-span-2">
                        <label class="block text-xs font-bold text-emerald-800 mb-1">Keahlian Utama (Keywords)</label>
                        <input v-model="aiKeywords" type="text" placeholder="Contoh: React, Node.js, Manajemen Tim..." class="w-full px-3 py-2 border border-emerald-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                    </div>
                </div>

                <button 
                    @click="handleGenerateAI" 
                    :disabled="aiLoading" 
                    class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm relative z-10"
                >
                    <span v-if="aiLoading" class="animate-spin text-lg">⏳</span>
                    {{ aiLoading ? 'Sedang Menulis...' : 'Generate Ringkasan Otomatis' }}
                </button>
            </div>

            <div class="relative group">
                <label class="block text-sm font-bold text-gray-700 mb-2">Editor Ringkasan</label>
                <textarea 
                    v-model="profile.profile_summary" 
                    rows="8" 
                    class="w-full p-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-700 leading-relaxed shadow-sm resize-none text-base transition group-hover:border-gray-400"
                    placeholder="Hasil generate AI akan muncul di sini..."
                ></textarea>
                
                <div class="mt-6 flex justify-end">
                    <button 
                        @click="handleSave" 
                        :disabled="loading" 
                        class="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition transform active:scale-95 disabled:bg-gray-400"
                    >
                        {{ loading ? 'Menyimpan...' : 'Simpan Ringkasan' }}
                    </button>
                </div>
            </div>

        </div>
    </div>
  </EditorLayout>
</template>