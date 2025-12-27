<script setup>
import { computed } from 'vue';

const props = defineProps({
  cvInfo: { type: Object, default: () => ({}) },
  sections: { type: Object, default: () => ({ educations:[], experiences:[], skills:[] }) },
  settings: { type: Object, default: () => ({}) }
});

const splitLines = (text) => text ? text.split('\n').filter(Boolean).map(l => l.replace(/^[\s•\-\*]+/, '').trim()) : [];

const cssVars = computed(() => ({
  '--primary': props.settings.primary || '#9b5de5', 
  '--font-body': props.settings.font || 'Poppins',
  '--spacing': props.settings.spacing === 'compact' ? '0.8rem' : '1.5rem'
}));
</script>

<template>
  <div class="w-full h-full flex flex-row font-sans" :style="cssVars">
    <aside class="w-[35%] bg-[var(--primary)] text-white p-8 flex flex-col gap-8 shrink-0">
      <div class="text-center">
        <div class="w-24 h-24 bg-white/20 mx-auto rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white/30 mb-4 backdrop-blur-sm">
           {{ (cvInfo.user_name || 'ME').substring(0, 2).toUpperCase() }}
        </div>
        <h1 class="text-2xl font-bold leading-tight mb-2">{{ cvInfo.user_name }}</h1>
        <p class="text-sm text-white/80 font-medium uppercase tracking-widest">{{ cvInfo.target_job_title }}</p>
      </div>
      <div class="space-y-3 text-sm text-white/90">
         <div v-if="cvInfo.email" class="flex items-center gap-3">
             <span class="opacity-70">✉️</span> <span class="break-all">{{ cvInfo.email }}</span>
         </div>
         <div v-if="cvInfo.phone" class="flex items-center gap-3">
             <span class="opacity-70">📞</span> <span>{{ cvInfo.phone }}</span>
         </div>
         <div v-if="cvInfo.location" class="flex items-center gap-3">
             <span class="opacity-70">📍</span> <span>{{ cvInfo.location }}</span>
         </div>
          <div v-if="cvInfo.linkedin_url" class="flex items-center gap-3">
             <span class="opacity-70">🔗</span> <span class="break-all text-xs">{{ cvInfo.linkedin_url }}</span>
         </div>
      </div>

      <div v-if="sections.skills.length">
        <h3 class="text-xs font-bold uppercase tracking-widest text-white/60 mb-4 border-b border-white/20 pb-1">Keahlian</h3>
        <div class="flex flex-wrap gap-x-2 gap-y-1 text-sm text-white/90">
          <span v-for="(skill, index) in sections.skills" :key="skill.name">
            {{ skill.name }}<span v-if="index < sections.skills.length - 1" class="text-white/40 ml-2">•</span>
          </span>
        </div>
      </div>

      <div v-if="sections.educations.length">
        <h3 class="text-xs font-bold uppercase tracking-widest text-white/60 mb-4 border-b border-white/20 pb-1">Pendidikan</h3>
        <div v-for="edu in sections.educations" :key="edu.id" class="mb-4 last:mb-0">
            <div class="font-bold text-sm">{{ edu.institution }}</div>
            <div class="text-xs text-white/70">{{ edu.degree }}</div>
            <div class="text-[10px] text-white/50 mt-0.5">{{ new Date(edu.start_date).getFullYear() }} - {{ edu.current ? 'Now' : new Date(edu.end_date).getFullYear() }}</div>
        </div>
      </div>
    </aside>

    <main class="w-[65%] p-10 flex flex-col gap-8 text-gray-700">
      
      <section v-if="cvInfo.summary">
        <h2 class="text-xl font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
             Ringkasan
        </h2>
        <p class="text-sm leading-relaxed text-gray-600 italic border-l-4 border-gray-100 pl-4 py-1">
            {{ cvInfo.summary }}
        </p>
      </section>

      <section v-if="sections.experiences.length" class="flex-1">
        <h2 class="text-lg font-bold text-gray-800 uppercase tracking-widest border-b-2 border-gray-100 pb-2 mb-6 flex items-center justify-between">
            Pengalaman Kerja
        </h2>

        <div v-for="exp in sections.experiences" :key="exp.id" class="mb-8 relative group">
             
             <div class="flex justify-between items-start mb-1">
                 <h3 class="font-bold text-gray-900 text-lg group-hover:text-[var(--primary)] transition">{{ exp.position }}</h3>
                 <span class="text-xs font-bold text-gray-400">
                    {{ new Date(exp.start_date).getFullYear() }} - {{ exp.current ? 'Now' : new Date(exp.end_date).getFullYear() }}
                 </span>
             </div>
             
             <div class="text-sm font-semibold text-gray-500 mb-3">{{ exp.company }}</div>
             
             <div class="text-sm text-gray-600 space-y-1">
                <div v-for="(line, idx) in splitLines(exp.description)" :key="idx" class="leading-relaxed">
                     {{ line }}
                </div>
             </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.font-sans { font-family: var(--font-body), sans-serif; }
</style>