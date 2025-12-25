<script setup>
import { computed } from 'vue';

const props = defineProps({
  cvInfo: { type: Object, default: () => ({}) },
  sections: { type: Object, default: () => ({ educations:[], experiences:[], skills:[] }) },
  settings: { type: Object, default: () => ({}) }
});

const splitLines = (text) => text ? text.split('\n').filter(Boolean).map(l => l.replace(/^[\s•\-\*]+/, '').trim()) : [];

const cssVars = computed(() => ({
  '--primary': props.settings.primary || '#0f766e', // Default Teal/Hijau Tua profesional
  '--font-body': props.settings.font || 'Inter',
  '--spacing': '1rem'
}));

const getSkillScore = (level) => {
    if (!level) return 2; // Default ke Intermediate jika kosong
    const l = String(level).toLowerCase();
    
    if (l.includes('begin')) return 1;      // Beginner -> 1 Dot
    if (l.includes('inter')) return 2;      // Intermediate -> 2 Dots
    if (l.includes('advan')) return 3;      // Advance -> 3 Dots
    if (l.includes('expert')) return 4;     // Expert -> 4 Dots
    
    return 2; // Fallback ke Intermediate
};
</script>

<template>
  <div class="w-full h-full bg-white font-sans text-gray-800 flex flex-col overflow-hidden" :style="cssVars">
    
    <header class="bg-[var(--primary)] text-white p-8 pb-10 shrink-0">
      <div class="flex justify-between items-start">
          <div>
            <h1 class="text-4xl font-bold uppercase tracking-wide mb-2">
                {{ cvInfo.user_name }}
            </h1>
            <p class="text-lg font-medium opacity-90 tracking-wider">
                {{ cvInfo.target_job_title }}
            </p>
          </div>
          
          <div class="hidden sm:block text-6xl font-black opacity-10 select-none">
              {{ (cvInfo.user_name || 'CV').substring(0,2).toUpperCase() }}
          </div>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-y-2 text-sm opacity-90">
         <div v-if="cvInfo.email" class="flex items-center gap-2">
             <span>✉️</span> {{ cvInfo.email }}
         </div>
         <div v-if="cvInfo.phone" class="flex items-center gap-2">
             <span>📱</span> {{ cvInfo.phone }}
         </div>
         <div v-if="cvInfo.location" class="flex items-center gap-2">
             <span>📍</span> {{ cvInfo.location }}
         </div>
         <div v-if="cvInfo.linkedin_url" class="flex items-center gap-2">
             <span>🔗</span> <span class="truncate max-w-[200px]">{{ cvInfo.linkedin_url }}</span>
         </div>
      </div>
    </header>

    <div class="flex flex-1 min-h-0">
        
        <main class="w-[65%] p-8 pr-10 border-r border-gray-100 overflow-y-hidden">
            
            <section v-if="cvInfo.summary" class="mb-8">
                <h3 class="text-sm font-bold uppercase text-[var(--primary)] border-b-2 border-[var(--primary)] mb-3 pb-1 tracking-wider">
                    Profil Profesional
                </h3>
                <p class="text-sm leading-relaxed text-gray-700 text-justify">
                    {{ cvInfo.summary }}
                </p>
            </section>

            <section v-if="sections.experiences.length">
                <h3 class="text-sm font-bold uppercase text-[var(--primary)] border-b-2 border-[var(--primary)] mb-6 pb-1 tracking-wider">
                    Pengalaman Kerja
                </h3>

                <div v-for="exp in sections.experiences" :key="exp.id" class="mb-6">
                    <div class="flex justify-between items-baseline mb-1">
                        <h4 class="font-bold text-gray-900 text-base">{{ exp.position }}</h4>
                    </div>
                    
                    <div class="flex justify-between items-center text-sm mb-2">
                        <span class="font-semibold text-gray-600">{{ exp.company }}</span>
                        <span class="italic text-gray-500 text-xs">
                            {{ new Date(exp.start_date).getFullYear() }} - {{ exp.current ? 'Present' : new Date(exp.end_date).getFullYear() }}
                        </span>
                    </div>

                    <table class="w-full border-collapse">
                        <tbody>
                            <tr v-for="(line, idx) in splitLines(exp.description)" :key="idx">
                                <td class="align-top w-4 pr-1 pt-[4px]">
                                    <div class="w-1.5 h-1.5 rounded-full bg-[var(--primary)] opacity-70"></div>
                                </td>
                                <td class="align-top text-sm text-gray-700 leading-relaxed pb-1">{{ line }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>

        <aside class="w-[35%] p-8 bg-gray-50/50 h-full">            
            <section v-if="sections.educations.length" class="mb-8">
                <h3 class="text-sm font-bold uppercase text-gray-700 border-b border-gray-300 mb-4 pb-1 tracking-wider">
                    Pendidikan
                </h3>
                <div v-for="edu in sections.educations" :key="edu.id" class="mb-4">
                    <div class="font-bold text-sm text-gray-800">{{ edu.institution }}</div>
                    <div class="text-xs text-[var(--primary)] font-semibold mt-0.5">{{ edu.degree }}</div>
                    <div class="text-xs text-gray-500 mt-1">{{ new Date(edu.start_date).getFullYear() }} - {{ edu.current ? 'Now' : new Date(edu.end_date).getFullYear() }}</div>
                </div>
            </section>

            <section v-if="sections.skills.length">
                <h3 class="text-sm font-bold uppercase text-gray-700 border-b border-gray-300 mb-4 pb-1 tracking-wider">
                    Keahlian
                </h3>
                <div class="flex flex-col gap-2">
                    <div v-for="skill in sections.skills" :key="skill.name" class="flex items-center justify-between group">
                        <div class="flex flex-col mr-2 overflow-hidden">
                            <span class="text-sm font-medium text-gray-700 truncate" title="{{ skill.name }}">{{ skill.name }}</span>
                        </div>
                        <div class="flex gap-1.5 shrink-0">
                            <div v-for="i in 4" :key="i" 
                                :class="[
                                    'w-2 h-2 rounded-full transition-all duration-300 shrink-0', /* Tambahkan shrink-0 di sini */
                                    i <= getSkillScore(skill.level) 
                                        ? 'bg-[var(--primary)] opacity-100' 
                                        : 'bg-gray-200 opacity-50'
                                ]"
                            ></div>
                        </div>
                    </div>
                </div>
            </section>
        </aside>
    </div>
  </div>
</template>

<style scoped>
.font-sans { font-family: var(--font-body), sans-serif; }
</style>