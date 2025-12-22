<script setup>
import { computed } from 'vue';

const props = defineProps({
  cvInfo: { type: Object, default: () => ({}) },
  sections: { type: Object, default: () => ({ educations:[], experiences:[], skills:[] }) },
  settings: { type: Object, default: () => ({}) }
});

const splitLines = (text) => text ? text.split('\n').filter(Boolean) : [];

const cssVars = computed(() => ({
  '--primary': props.settings.primary || '#111827', // Default hitam/gelap
  '--font-body': props.settings.font || 'Inter',
  '--spacing': '0.75rem' // Minimalist biasanya lebih rapat tapi rapi
}));
</script>

<template>
  <div class="w-full h-full bg-white p-12 font-sans text-gray-800 flex flex-col" :style="cssVars">
    
    <header class="text-center border-b border-gray-300 pb-8 mb-8">
      <h1 class="text-4xl font-light tracking-[0.2em] text-gray-900 uppercase mb-2">
          {{ cvInfo.user_name }}
      </h1>
      <p class="text-sm font-bold text-[var(--primary)] tracking-widest uppercase mb-4">
          {{ cvInfo.target_job_title }}
      </p>
      
      <div class="flex flex-wrap justify-center gap-4 text-xs text-gray-500 font-medium">
         <span v-if="cvInfo.location">{{ cvInfo.location }}</span>
         <span v-if="cvInfo.location && cvInfo.email" class="text-gray-300">|</span>
         <span v-if="cvInfo.email">{{ cvInfo.email }}</span>
         <span v-if="cvInfo.email && cvInfo.phone" class="text-gray-300">|</span>
         <span v-if="cvInfo.phone">{{ cvInfo.phone }}</span>
         <span v-if="cvInfo.linkedin_url" class="text-gray-300">|</span>
         <span v-if="cvInfo.linkedin_url">LinkedIn Available</span>
      </div>
    </header>

    <div class="flex-1 space-y-8">
        
        <section v-if="cvInfo.summary">
             <p class="text-sm leading-7 text-gray-600 text-center max-w-2xl mx-auto">
                 {{ cvInfo.summary }}
             </p>
        </section>

        <section v-if="sections.experiences.length">
            <h2 class="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-6 flex items-center gap-4">
                <span class="flex-1 h-px bg-gray-200"></span>
                Pengalaman Profesional
                <span class="flex-1 h-px bg-gray-200"></span>
            </h2>

            <div v-for="exp in sections.experiences" :key="exp.id" class="mb-6">
                <div class="flex justify-between items-baseline mb-1">
                    <h3 class="font-bold text-gray-900 text-base">{{ exp.position }}</h3>
                    <span class="text-xs font-mono text-gray-500">
                        {{ new Date(exp.start_date).getFullYear() }} — {{ exp.current ? 'Present' : new Date(exp.end_date).getFullYear() }}
                    </span>
                </div>
                <div class="text-sm italic text-gray-500 mb-2 font-serif">{{ exp.company }}</div>
                
                <p v-for="(line, idx) in splitLines(exp.description)" :key="idx" class="text-sm text-gray-700 leading-relaxed mb-1">
                   • {{ line }}
                </p>
            </div>
        </section>

        <div class="grid grid-cols-2 gap-12 pt-4">
            
            <section v-if="sections.educations.length">
                <h2 class="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-4 border-b border-gray-200 pb-2">
                    Pendidikan
                </h2>
                <div v-for="edu in sections.educations" :key="edu.id" class="mb-3">
                    <div class="font-bold text-sm text-gray-900">{{ edu.institution }}</div>
                    <div class="text-xs text-gray-600">{{ edu.degree }}</div>
                    <div class="text-[10px] text-gray-400 mt-1">{{ new Date(edu.start_date).getFullYear() }} — {{ edu.current ? 'Now' : new Date(edu.end_date).getFullYear() }}</div>
                </div>
            </section>

            <section v-if="sections.skills.length">
                <h2 class="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-4 border-b border-gray-200 pb-2">
                    Keahlian
                </h2>
                <div class="flex flex-wrap gap-x-4 gap-y-2">
                    <span v-for="skill in sections.skills" :key="skill.name" class="text-sm font-medium text-gray-700 relative pl-3">
                        <span class="absolute left-0 top-1.5 w-1 h-1 bg-[var(--primary)] rounded-full"></span>
                        {{ skill.name }}
                    </span>
                </div>
            </section>
        </div>
    </div>
  </div>
</template>

<style scoped>
.font-sans { font-family: var(--font-body), sans-serif; }
</style>