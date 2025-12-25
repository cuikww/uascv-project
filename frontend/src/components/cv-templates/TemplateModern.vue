<script setup>
import { computed } from 'vue';

const props = defineProps({
  cvInfo: { type: Object, default: () => ({}) },
  sections: { type: Object, default: () => ({ educations:[], experiences:[], skills:[] }) },
  settings: { type: Object, default: () => ({}) }
});

const splitLines = (text) => text ? text.split('\n').filter(Boolean).map(l => l.replace(/^[\s•\-\*]+/, '').trim()) : [];

const cssVars = computed(() => ({
  '--primary': props.settings.primary || '#006894',
  '--font-body': props.settings.font || 'Inter',
  '--spacing': props.settings.spacing === 'compact' ? '0.5rem' : '1rem'
}));
</script>

<template>
  <div 
    class="w-full h-full flex flex-row font-sans text-gray-800"
    :style="{
        ...cssVars,
        background: 'linear-gradient(to right, #f8fafc 33.3333%, #ffffff 33.3333%)'
    }"
  >
    
    <aside class="w-1/3 border-r border-gray-200 p-8 flex flex-col gap-6 shrink-0">
      
      <div class="w-20 h-20 bg-[var(--primary)] text-white flex items-center justify-center text-2xl font-bold rounded-full mb-2 mx-auto sm:mx-0">
        {{ (cvInfo.user_name || 'ME').substring(0,2).toUpperCase() }}
      </div>

      <div>
        <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b pb-1">Kontak</h3>
        <div class="text-sm space-y-2 break-words">
           <div v-if="cvInfo.email">📧 {{ cvInfo.email }}</div>
           <div v-if="cvInfo.phone">📱 {{ cvInfo.phone }}</div>
           <div v-if="cvInfo.location">📍 {{ cvInfo.location }}</div>
           <div v-if="cvInfo.linkedin_url">🔗 <span class="text-xs">{{ cvInfo.linkedin_url }}</span></div>
        </div>
      </div>

      <div v-if="sections.skills.length">
        <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b pb-1">Keahlian</h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="skill in sections.skills" :key="skill.name" class="bg-white border border-gray-300 px-3 py-1.5 rounded text-xs font-bold text-[var(--primary)] shadow-sm inline-flex items-center justify-center min-h-[28px]">
            {{ skill.name }}
          </span>
        </div>
      </div>

       <div v-if="sections.educations.length">
        <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b pb-1">Pendidikan</h3>
        <div v-for="edu in sections.educations" :key="edu.id" class="mb-4">
            <div class="font-bold text-sm">{{ edu.institution }}</div>
            <div class="text-xs text-[var(--primary)] font-medium">{{ edu.degree }}</div>
            <div class="text-xs text-gray-500">{{ new Date(edu.start_date).getFullYear() }} - {{ edu.current ? 'Now' : new Date(edu.end_date).getFullYear() }}</div>
        </div>
      </div>
    </aside>

    <main class="w-2/3 p-10">
      
      <header class="mb-10 border-b-2 pb-6" style="border-color: var(--primary)">
        <h1 class="text-4xl font-bold uppercase tracking-tight text-[var(--primary)] leading-none mb-2">
            {{ cvInfo.user_name }}
        </h1>
        <p class="text-xl text-gray-600 font-light tracking-wide">
            {{ cvInfo.target_job_title || 'Professional Title' }}
        </p>
      </header>

      <section v-if="cvInfo.summary" class="mb-8">
        <h2 class="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
            <span class="w-2 h-2 bg-[var(--primary)] rounded-full"></span> Ringkasan
        </h2>
        <p class="text-sm leading-relaxed text-gray-600 text-justify">
            {{ cvInfo.summary }}
        </p>
      </section>

      <section v-if="sections.experiences.length">
        <h2 class="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
             <span class="w-2 h-2 bg-[var(--primary)] rounded-full"></span> Pengalaman Kerja
        </h2>

        <div v-for="exp in sections.experiences" :key="exp.id" class="mb-6 relative pl-4 border-l-2 border-gray-100 last:mb-0">
             <div class="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300"></div>
             
             <div class="flex justify-between items-start mb-1">
                 <h3 class="font-bold text-gray-800 text-lg">{{ exp.position }}</h3>
                 <span class="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {{ new Date(exp.start_date).getFullYear() }} - {{ exp.current ? 'Present' : (exp.end_date ? new Date(exp.end_date).getFullYear() : '') }}
                 </span>
             </div>
             
             <div class="text-sm font-semibold text-[var(--primary)] mb-2">{{ exp.company }}</div>
             
             <table class="w-full border-collapse">
                <tbody>
                    <tr v-for="(line, idx) in splitLines(exp.description)" :key="idx">
                        <td class="align-top w-4 pr-1 pt-[2px]">
                            <div class="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                        </td>
                        <td class="align-top text-sm text-gray-600 leading-relaxed pb-1">{{ line }}</td>
                    </tr>
                </tbody>
             </table>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
.font-sans { font-family: var(--font-body), sans-serif; }
</style>