<script setup>
import { ref, onMounted, watch, computed, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import EditorLayout from "@/components/EditorLayout.vue";
import { getCvFullContent, updateCvMetadata } from "@/api/cv.js";
import { generateStyle } from "@/api/ai.js";
import { getMasterProfile } from "@/api/profile.js";

// Import Template
import TemplateModern from '@/components/cv-templates/TemplateModern.vue';
import TemplateCreative from '@/components/cv-templates/TemplateCreative.vue';
import TemplateMinimalist from '@/components/cv-templates/TemplateMinimalist.vue';
import TemplateProfessional from '@/components/cv-templates/TemplateProfessional.vue';

const route = useRoute();
const cvId = route.params.cvId;

// State Data
const cvInfo = ref({});
const profile = ref({});
const sections = ref({ educations: [], experiences: [], skills: [] });
const loading = ref(false);

// State UI Responsive
const showMobileSidebar = ref(false); 

const templates = [
  { id: "modern", name: "Modern" },
  { id: "creative", name: "Creative" },
  { id: "minimalist", name: "Minimalist" },
  { id: "professional", name: "Professional" },
];

const styleConfig = ref({
  primary: "#006894",
  font: "Inter",
  spacing: "comfortable",
  style_name: "Default",
});
const aiPrompt = ref("Tema Biru Laut Modern");
const aiLoading = ref(false);
const msg = ref("");

// --- Zoom Controls ---
const MIN_SCALE = 0.4;
const MAX_SCALE = 1.5;
const zoomPercent = ref(90);
const zoomScale = computed(() => zoomPercent.value / 100);

const fitToPage = () => {
  const container = document.querySelector(".preview-area");
  const previewEl = document.getElementById("cv-preview");
  if (!container || !previewEl) return;

  // Di mobile, kurangi padding agar kalkulasi lebih akurat
  const paddingX = window.innerWidth < 768 ? 32 : 64;
  const availableWidth = container.clientWidth - paddingX;
  const paperWidth = 720;

  let scale = availableWidth / paperWidth;
  scale = Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);
  zoomPercent.value = Math.floor(scale * 100);
};

// Style Wrapper & Paper
const wrapperStyle = computed(() => {
  return {
    width: `${720 * zoomScale.value}px`,
    height: `${1018 * zoomScale.value}px`,
  };
});

const paperStyle = computed(() => {
  return {
    transform: `scale(${zoomScale.value})`,
    transformOrigin: "top left",
  };
});

// Helper
const splitFilter = (text) => {
  if (!text) return [];
  return String(text)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
};

// --- Fetch Data ---
const fetchData = async () => {
  try {
    loading.value = true;
    const res = await getCvFullContent(cvId);
    cvInfo.value = res.data.cv_info || {};
    const rawSections = res.data.sections || { educations: [], experiences: [], skills: [] };

    // Normalize
    const normalizeSkill = (s) => {
      if (!s) return null;
      if (typeof s === "string") return { name: s, level: 'Intermediate' }; // Default level

      // Ambil nama skill
      let name = "";
      // Cek di root object dulu
      const candidates = ["name", "skill_name", "skill", "title"];
      for (const k of candidates) {
          if (s[k]) { name = s[k]; break; }
      }
      
      // Jika tidak ketemu di root, cek di master_skill (relation)
      if (!name && s.master_skill && s.master_skill.skill_name) {
          name = s.master_skill.skill_name;
      }
      
      const level = s.level || (s.master_skill ? s.master_skill.level : 'Intermediate');

      if (!name) return null; // Jika masih tidak ada nama, skip

      return {
          id: s.id,
          name: name,
          level: level
      };
    };

    sections.value = {
      educations: rawSections.educations || [],
      experiences: rawSections.experiences || [],
      skills: (rawSections.skills || []).map(normalizeSkill).filter(Boolean),
    };

    // Fallback Profile
    try {
      const p = await getMasterProfile();
      profile.value = p.data.data || {};
      
      // ... (existing profile mapping) ...
      if (!cvInfo.value.user_name && profile.value.fullname) cvInfo.value.user_name = profile.value.fullname;
      if (!cvInfo.value.email && profile.value.email) cvInfo.value.email = profile.value.email;
      const parts = [profile.value.address, profile.value.city, profile.value.country].filter(Boolean);
      if (parts.length) cvInfo.value.location = parts.join(", ");

      // Fallback Summary
      if (!cvInfo.value.summary && profile.value.profile_summary) {
          cvInfo.value.summary = profile.value.profile_summary;
      }
    } catch (e) { console.warn(e); }
      
      // Fallback Skills: Jika tidak ada skills di CV, dan tidak ada di profile (karena getMasterProfile cuma table profiles)
      // Kita coba ambil dari master_skills endpoint (opsional, jika Anda punya API getMasterSkills)
      // Atau, jika profile.value.skills memang ada (mungkin dari join?), kita pake itu.
      // TAPI: berdasarkan controller, getProfile cuma select * from profiles. Jadi profile.value.skills KEMUNGKINAN undefined.
      
      if (!sections.value.skills || !sections.value.skills.length) {
         // Coba fetch master skills
         try {
             const { getMasterData } = await import("@/api/master.js"); 
             const resSkills = await getMasterData('skills');
             if(resSkills.data && resSkills.data.data) {
                 sections.value.skills = resSkills.data.data.map(s => ({
                     name: s.skill_name, 
                     level: s.level || 'Intermediate'
                 }));
             }
         } catch(e) { console.warn("Fallback fetch skills failed", e); }
      }

    if (cvInfo.value?.template) selectTemplateLocal(cvInfo.value.template);
    applyStyleToDocument();
  } catch (err) { console.error(err); } 
  finally { loading.value = false; }
};

onMounted(async () => {
  await fetchData();
  await nextTick();
  fitToPage();
  window.addEventListener("resize", fitToPage);
});

onUnmounted(() => {
  window.removeEventListener("resize", fitToPage);
});

// --- Actions ---
const applyStyleToDocument = () => {
  const root = document.documentElement;
  root.style.setProperty("--primary-color", styleConfig.value.primary || "#006894");
  root.style.setProperty("--cv-font", styleConfig.value.font || "Inter");
  root.style.setProperty("--cv-spacing", styleConfig.value.spacing === "compact" ? "0.6" : "1.0");
};
watch(styleConfig, applyStyleToDocument, { deep: true });

const selectTemplateLocal = (id) => {
  const presets = {
    creative: { primary: "#9b5de5", font: "Poppins" },
    minimalist: { primary: "#111827", font: "Inter", spacing: "compact" },
    professional: { primary: "#0f766e", font: "Inter" },
    modern: { primary: "#006894", font: "Inter" },
  };
  const cfg = presets[id] || presets.modern;
  styleConfig.value = { ...styleConfig.value, ...cfg };
};

const templateComponents = {
    modern: TemplateModern,
    creative: TemplateCreative,
    minimalist: TemplateMinimalist,
    professional: TemplateProfessional
};

const activeTemplate = computed(() => {
    const id = cvInfo.value?.template || 'modern';
    return templateComponents[id] || TemplateModern;
});

const selectTemplate = async (id) => {
  selectTemplateLocal(id);
  if (cvInfo.value) cvInfo.value.template = id;
  try { await updateCvMetadata(cvId, { template: id }); } catch (e) { console.error(e); }
};

// src/views/editor/PreviewView.vue

const handleGenerateStyle = async () => {
  if (!aiPrompt.value) return;
  aiLoading.value = true;
  
  try {
    // Panggil API
    const res = await generateStyle({ prompt: aiPrompt.value });
    
    if (res.data?.style_config) {
      const cfg = res.data.style_config;

      // 1. Terapkan Warna, Font, Spacing (Seperti sebelumnya)
      styleConfig.value = { ...styleConfig.value, ...cfg };

      // 2. [UPGRADE BARU] Ganti Template Otomatis
      // Cek apakah response AI mengandung field 'template' (misal: 'minimalist', 'professional')
      // Dan pastikan template tersebut ada di daftar templates kita
      if (cfg.template && templates.some(t => t.id === cfg.template)) {
         
         // Jika template saat ini beda dengan saran AI, kita ganti
         if (cvInfo.value.template !== cfg.template) {
             await selectTemplate(cfg.template);
             msg.value = `AI: Template ${cfg.template} diterapkan!`;
         } else {
             msg.value = "AI Style Applied!";
         }
         
      } else {
         msg.value = "AI Style Applied!";
      }

      setTimeout(() => (msg.value = ""), 2000);
    }
  } catch (e) { 
      console.error(e);
      alert("Gagal memproses permintaan AI"); 
  } finally { 
      aiLoading.value = false; 
  }
};

const downloadPdf = async () => {
  const element = document.getElementById("cv-preview");
  const wrapper = document.querySelector(".transition-all"); // Ambil wrapper yang ada animasinya
  
  if (!element || !wrapper) return;

  // 1. Simpan state awal
  const originalZoom = zoomPercent.value;
  zoomPercent.value = 100;
  await nextTick();

  try {
    const { default: html2canvas } = await import('html2canvas');
    const { jsPDF } = await import('jspdf');
    
    msg.value = "Generating PDF...";
    
    const canvas = await html2canvas(element, {
        scale: 3, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794, 
        windowHeight: 1120, 
        scrollX: 0,
        scrollY: 0,
        allowTaint: false,
        foreignObjectRendering: false,
        letterRendering: true, // Improve text alignment
        dpi: 300 // High resolution
    });
    
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add new pages if content overflows
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${(cvInfo.value?.user_name || "CV").replace(/\s+/g, "_")}.pdf`);
    msg.value = "Download Berhasil";
    
  } catch (err) {
    console.error(err);
    alert("Gagal download PDF");
  } finally {
    zoomPercent.value = originalZoom;
    await nextTick();
    setTimeout(() => (msg.value = ""), 2000);
  }
};

const presetColors = [
    '#006894', // Classic Blue
    '#0f766e', // Teal Professional
    '#9b5de5', // Creative Purple
    '#111827', // Elegant Black
    '#dc2626', // Red
    '#ea580c', // Orange
    '#ca8a04', // Gold / Dark Yellow
    '#16a34a', // Success Green
    '#2563eb', // Royal Blue
    '#4f46e5', // Indigo
    '#db2777', // Pink
    '#4b5563', // Neutral Gray
];

</script>

<template>
  <EditorLayout>
    <div class="flex flex-col h-full bg-slate-50">
      <div class="h-16 bg-white border-b border-gray-200 shrink-0 flex items-center justify-between px-4 sm:px-6 z-20">
        <div class="flex items-center gap-3 sm:gap-4">
            <button @click="showMobileSidebar = !showMobileSidebar" class="lg:hidden p-2 text-gray-500 hover:text-emerald-600 border rounded-lg active:bg-gray-50">
                <span v-if="!showMobileSidebar">⚙️</span>
                <span v-else>✖️</span>
            </button>

            <h2 class="font-bold text-gray-700 hidden md:block">Preview</h2>

            <div class="flex items-center gap-1 sm:gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1">
                <button @click="fitToPage" class="px-2 sm:px-3 py-1 text-xs font-bold text-gray-600 hover:bg-white rounded shadow-sm transition">Fit</button>
                <div class="h-4 w-px bg-gray-300 mx-1 hidden sm:block"></div>
                <button @click="zoomPercent = Math.max(40, zoomPercent - 10)" class="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded hover:bg-white text-gray-600 font-bold">-</button>
                <span class="text-xs font-mono w-8 sm:w-10 text-center">{{ zoomPercent }}%</span>
                <button @click="zoomPercent = Math.min(150, zoomPercent + 10)" class="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded hover:bg-white text-gray-600 font-bold">+</button>
            </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <transition name="fade">
            <span v-if="msg" class="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-full animate-pulse">{{ msg }}</span>
          </transition>
          <button @click="downloadPdf" class="bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-lg">
            <span>⬇️</span> <span class="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </div>

      <div class="flex flex-1 overflow-hidden relative">
        
        <div class="flex-1 overflow-auto bg-slate-100/50 flex preview-area relative p-4 sm:p-8">
            <div v-if="showMobileSidebar" @click="showMobileSidebar = false" class="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] z-20 lg:hidden transition-opacity"></div>
            <div class="transition-all duration-200 ease-out mx-auto my-4 sm:my-10 origin-top-left z-0" :style="wrapperStyle">
                <div id="cv-preview" class="a4-paper bg-white shadow-xl" :style="paperStyle">
                  <div v-if="loading" class="flex h-full items-center justify-center text-gray-400">
                      <span class="animate-spin text-2xl mr-2">⏳</span> Memuat Template...
                  </div>
                  <component 
                    :is="activeTemplate"
                    :cvInfo="cvInfo"
                    :sections="sections"
                    :settings="styleConfig"
                  />
              </div>
            </div>
        </div>

        <div :class="[
            'bg-white flex flex-col h-full z-30 transition-transform duration-300 ease-in-out shrink-0',
            'lg:relative lg:translate-x-0 lg:w-80 lg:border-l lg:border-gray-200 lg:shadow-none', 
            'absolute top-0 right-0 bottom-0 w-72 shadow-2xl',
            showMobileSidebar ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        ]">
          
          <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
                <h3 class="font-bold text-gray-800">Tampilan</h3>
                <p class="text-xs text-gray-500">Edit template & gaya.</p>
            </div>
            <button @click="showMobileSidebar = false" class="lg:hidden text-gray-400 hover:text-red-500 text-xl font-bold px-2">×</button>
          </div>

          <div class="p-5 space-y-6 flex-1 overflow-y-auto">
            <div>
              <label class="text-xs font-bold text-gray-400 uppercase mb-2 block">Template</label>
              <div class="grid grid-cols-2 gap-3">
                <button 
                  v-for="t in templates" 
                  :key="t.id" 
                  @click="selectTemplate(t.id)" 
                  :class="['border rounded-lg p-2 text-center transition hover:shadow-md flex flex-col items-center gap-2 group', 
                    cvInfo?.template === t.id ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-200 bg-white']"
                >
                  
                  <div class="w-full aspect-[210/297] bg-white border border-gray-100 shadow-sm relative overflow-hidden pointer-events-none rounded-sm">
                    
                    <div v-if="t.id === 'modern'" class="flex h-full">
                      <div class="w-1/3 bg-gray-100 h-full flex flex-col gap-1 p-1">
                        <div class="w-8 h-8 rounded-full bg-gray-300 mb-1"></div>
                        <div class="w-full h-1 bg-gray-300 rounded"></div>
                        <div class="w-3/4 h-1 bg-gray-300 rounded"></div>
                      </div>
                      <div class="w-2/3 p-1 flex flex-col gap-1">
                        <div class="w-3/4 h-2 bg-emerald-600/50 rounded mb-1"></div>
                        <div class="w-full h-1 bg-gray-100 rounded"></div>
                        <div class="w-full h-1 bg-gray-100 rounded"></div>
                        <div class="w-5/6 h-1 bg-gray-100 rounded"></div>
                      </div>
                    </div>

                    <div v-else-if="t.id === 'creative'" class="flex h-full">
                      <div class="w-1/3 bg-emerald-600 h-full flex flex-col items-center pt-2 gap-1">
                        <div class="w-6 h-6 rounded-full bg-white/30"></div>
                        <div class="w-6 h-0.5 bg-white/30"></div>
                        <div class="w-4 h-0.5 bg-white/30"></div>
                      </div>
                      <div class="w-2/3 p-1 pt-2 flex flex-col gap-1">
                        <div class="w-1/2 h-1.5 bg-gray-800 rounded mb-1"></div>
                        <div class="w-full h-1 bg-gray-100 rounded"></div>
                        <div class="w-full h-1 bg-gray-100 rounded"></div>
                        <div class="w-1/2 h-1.5 bg-gray-300 rounded mt-1"></div>
                      </div>
                    </div>

                    <div v-else-if="t.id === 'minimalist'" class="flex flex-col items-center pt-3 h-full px-1">
                      <div class="w-3/4 h-2 bg-gray-800 mb-1"></div>
                      <div class="w-1/2 h-1 bg-emerald-600/50 mb-2"></div>
                      <div class="w-full h-px bg-gray-200 mb-1"></div>
                      <div class="w-full h-1 bg-gray-100 mb-0.5"></div>
                      <div class="w-5/6 h-1 bg-gray-100 mb-0.5"></div>
                      <div class="w-4/5 h-1 bg-gray-100"></div>
                    </div>

                    <div v-else-if="t.id === 'professional'" class="flex flex-col h-full">
                      <div class="h-6 w-full bg-emerald-700 flex items-center px-1 gap-1">
                          <div class="w-8 h-2 bg-white/40 rounded-sm"></div>
                      </div>
                      <div class="flex flex-1 p-1 gap-1">
                          <div class="w-2/3 flex flex-col gap-1">
                            <div class="w-1/3 h-1 bg-emerald-700/30 rounded"></div>
                            <div class="w-full h-1 bg-gray-100"></div>
                            <div class="w-full h-1 bg-gray-100"></div>
                          </div>
                          <div class="w-1/3 bg-gray-50 h-full border-l border-gray-100"></div>
                      </div>
                    </div>

                  </div>

                  <span :class="['text-xs font-bold transition', cvInfo?.template === t.id ? 'text-emerald-700' : 'text-gray-600 group-hover:text-emerald-600']">
                    {{ t.name }}
                  </span>

                </button>
              </div>
            </div>

            <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-bold text-emerald-800">✨ AI Designer</label>
                <span class="text-[10px] bg-white text-emerald-600 px-1 rounded border border-emerald-200">Beta</span>
              </div>
              <textarea v-model="aiPrompt" rows="3" class="w-full text-xs p-2 rounded border border-emerald-200 focus:ring-1 focus:ring-emerald-500 outline-none resize-none mb-2" placeholder="Cth: Clean minimalis biru..."></textarea>
              <button @click="handleGenerateStyle" :disabled="aiLoading" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition flex items-center justify-center gap-2">
                <span v-if="aiLoading" class="animate-spin">⏳</span>
                {{ aiLoading ? "Generating..." : "Terapkan Gaya AI" }}
              </button>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-400 uppercase mb-2 block">Warna Aksen</label>
              <div class="flex gap-2 flex-wrap gap-2">
                <div class="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-white border border-gray-200 shadow-sm cursor-pointer group bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center transition hover:scale-110" title="Pilih warna custom">
                    <span class="text-xs filter grayscale group-hover:grayscale-0 transition">🎨</span>
                    <input 
                        type="color" 
                        v-model="styleConfig.primary" 
                        class="absolute inset-0 w-[150%] h-[150%] opacity-0 cursor-pointer -translate-x-1/4 -translate-y-1/4 p-0 border-0"
                    />
                </div>
                <button 
                    v-for="color in presetColors" 
                    :key="color" 
                    @click="styleConfig.primary = color"
                    :class="[
                        'w-8 h-8 rounded-full ring-2 border shadow-sm transition transform hover:scale-110',
                        styleConfig.primary === color ? 'ring-emerald-500 scale-110 z-10' : 'ring-white border-gray-200'
                    ]"
                    :style="{ backgroundColor: color }"
                    :title="color"
                ></button>
              </div>
              <div class="mt-2 text-[10px] text-gray-400 font-mono text-right">
                  Active: <span class="uppercase text-gray-600 font-bold">{{ styleConfig.primary }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </EditorLayout>
</template>

<style scoped>
:root {
  --primary-color: #006894;
  --cv-font: "Inter", sans-serif;
}
.a4-paper {
  width: 794px;      /* 210mm */
  height: 1120px; /* 297mm */
  background: white;
  padding: 0;
  box-sizing: border-box;
  font-family: var(--cv-font);
  color: #333;
  overflow: hidden;

  display: flex;
  flex-direction: column;
}
@media print {
  body * { visibility: hidden; }
  #cv-preview ul, #cv-preview li {
  line-height: 1.5 !important;
}
/* Native Bullet Coloring */
#cv-preview ul.list-disc > li::marker {
  color: var(--primary);
  font-size: 1.2em;
}
  #cv-preview {
    position: absolute;
    left: 0;
    top: 0;
    width: 210mm;
    min-height: 297mm;
    margin: 0;
    padding: 0;
  }
}
</style>