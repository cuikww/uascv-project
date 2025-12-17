<script setup>
    import {useRoute} from 'vue-router';
    const route = useRoute();
    const cvId = route.params.cvId;
    const isActive = (path) => route.path.includes(path)
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row">
    
    <aside class="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div class="h-16 flex items-center px-6 border-b border-gray-100">
            <span class="text-2xl font-bold text-emerald-600 tracking-tight">UASCV.</span>
        </div>

        <div class="p-4 space-y-1 overflow-x-auto md:overflow-visible flex md:flex-col gap-2 md:gap-0">
            <router-link to="/onboarding" class="flex items-center gap-3 px-3 py-2 text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition mb-2 md:mb-4 whitespace-nowrap">
                <span>←</span> <span class="text-sm font-medium">Dashboard</span>
            </router-link>
            
            <router-link :to="`/basicdetails/${cvId}`" 
                :class="['flex items-center gap-3 px-3 py-2.5 rounded-lg transition whitespace-nowrap', isActive('basicdetails') ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'text-gray-600 hover:bg-gray-50']">
                <span>👤</span> Info Dasar
            </router-link>

            <router-link :to="`/editor/${cvId}/education`" 
                :class="['flex items-center gap-3 px-3 py-2.5 rounded-lg transition whitespace-nowrap', isActive('education') ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'text-gray-600 hover:bg-gray-50']">
                <span>🎓</span> Pendidikan
            </router-link>

            <router-link :to="`/editor/${cvId}/experience`" 
                :class="['flex items-center gap-3 px-3 py-2.5 rounded-lg transition whitespace-nowrap', isActive('experience') ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'text-gray-600 hover:bg-gray-50']">
                <span>💼</span> Pengalaman
            </router-link>

            <router-link :to="`/editor/${cvId}/skills`" 
                :class="['flex items-center gap-3 px-3 py-2.5 rounded-lg transition whitespace-nowrap', isActive('skills') ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'text-gray-600 hover:bg-gray-50']">
                <span>⚡</span> Keahlian
            </router-link>

            <router-link :to="`/editor/${cvId}/summary`" 
                :class="['flex items-center gap-3 px-3 py-2.5 rounded-lg transition whitespace-nowrap', isActive('summary') ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'text-gray-600 hover:bg-gray-50']">
                <span>📝</span> Ringkasan
            </router-link>
        </div>
    </aside>

    <main class="flex-1 h-[calc(100vh-64px)] md:h-screen overflow-hidden bg-slate-50 relative">
        <slot></slot>
    </main>
  </div>
</template>