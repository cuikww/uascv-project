<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
    show: Boolean,
    isEditing: Boolean,
    formData: Object,
    cvList: Array
});

const emit = defineEmits(['save', 'close']);

const form = ref({ ...props.formData });

const statusOptions = [
    { value: 'wishlist', label: 'Ingin Dilamar', icon: '📌' },
    { value: 'applied', label: 'Sudah Dilamar', icon: '✈️' },
    { value: 'interview', label: 'Interview', icon: '🎤' },
    { value: 'offer', label: 'Offer', icon: '🎉' }
];

const interviewTypeOptions = [
    { value: 'phone', label: 'Phone Call' },
    { value: 'video', label: 'Video Call' },
    { value: 'in-person', label: 'In-Person' },
    { value: 'other', label: 'Other' }
];

const workModeOptions = [
    { value: 'remote', label: 'Remote' },
    { value: 'onsite', label: 'On-Site' },
    { value: 'hybrid', label: 'Hybrid' }
];

const jobTypeOptions = [
    { value: 'full-time', label: 'Full-Time' },
    { value: 'part-time', label: 'Part-Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
];

const difficultyOptions = [
    { value: 'low', label: '🟢 Mudah' },
    { value: 'medium', label: '🟡 Sedang' },
    { value: 'high', label: '🔴 Sulit' }
];

const showInterviewSection = computed(() => form.value.status === 'interview');

watch(() => props.formData, (newData) => {
    form.value = { ...newData };
}, { deep: true });

const handleSubmit = () => {
    // Validate required fields
    if (!form.value.company_name || !form.value.position_title) {
        alert('Nama perusahaan dan posisi wajib diisi');
        return;
    }

    emit('save', form.value);
};

const handleClose = () => {
    emit('close');
};

const toggleFavourite = () => {
    form.value.is_favourite = !form.value.is_favourite;
};
</script>

<template>
    <div v-if="show" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
        <div class="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden transform transition-all">
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 class="font-bold text-gray-800">
                    {{ isEditing ? '✏️ Edit Lamaran' : '📝 Catat Lamaran Baru' }}
                </h3>
                <button
                    @click="handleClose"
                    class="text-gray-400 hover:text-red-500 text-xl transition">
                    ✕
                </button>
            </div>

            <!-- Content -->
            <div class="p-6 overflow-y-auto max-h-[75vh] space-y-4">

                <!-- Company & Position -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Perusahaan</label>
                        <input
                            v-model="form.company_name"
                            type="text"
                            placeholder="Nama perusahaan"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Posisi</label>
                        <input
                            v-model="form.position_title"
                            type="text"
                            placeholder="Posisi pekerjaan"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                    </div>
                </div>

                <!-- Status Selection -->
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
                    <div class="grid grid-cols-4 gap-2">
                        <button
                            v-for="status in statusOptions"
                            :key="status.value"
                            @click="form.status = status.value"
                            :class="{
                                'bg-gray-50 text-gray-700 border-2 border-gray-300 ring-2 ring-gray-100': form.status === status.value,
                                'border border-gray-200 text-gray-600 hover:bg-gray-50': form.status !== status.value
                            }"
                            class="px-2 py-1.5 rounded text-xs font-medium transition">
                            {{ status.icon }} {{ status.label }}
                        </button>
                    </div>
                </div>

                <!-- CV Selection -->
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">CV (Opsional)</label>
                    <select
                        v-model="form.cv_id"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                        <option :value="null">Pilih CV...</option>
                        <option v-for="cv in cvList" :key="cv.id" :value="cv.id">
                            {{ cv.title }} ({{ cv.template }})
                        </option>
                    </select>
                </div>

                <!-- Location & Work Mode -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Lokasi Perusahaan</label>
                        <input
                            v-model="form.company_location"
                            type="text"
                            placeholder="Kota/Lokasi"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Mode Kerja</label>
                        <select
                            v-model="form.work_mode"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                            <option v-for="opt in workModeOptions" :key="opt.value" :value="opt.value">
                                {{ opt.label }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Job Type & Difficulty -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Tipe Pekerjaan</label>
                        <select
                            v-model="form.job_type"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                            <option v-for="opt in jobTypeOptions" :key="opt.value" :value="opt.value">
                                {{ opt.label }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Tingkat Kesulitan</label>
                        <select
                            v-model="form.difficulty_level"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                            <option v-for="opt in difficultyOptions" :key="opt.value" :value="opt.value">
                                {{ opt.label }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Job URL & Salary -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Link Job Posting</label>
                        <input
                            v-model="form.job_url"
                            type="url"
                            placeholder="https://..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Rentang Gaji</label>
                        <input
                            v-model="form.salary_range"
                            type="text"
                            placeholder="Contoh: 5-7 juta"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                    </div>
                </div>

                <!-- Applied Date -->
                <div v-if="form.status !== 'wishlist'">
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Tanggal Melamar</label>
                    <input
                        v-model="form.applied_date"
                        type="date"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                </div>

                <!-- Interview Details (conditional) -->
                <div v-if="showInterviewSection" class="bg-purple-50 border border-purple-100 p-4 rounded-lg space-y-3">
                    <p class="text-[10px] text-purple-600 font-bold uppercase tracking-wide">📋 Detail Interview</p>
                    
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Tanggal & Jam</label>
                            <input
                                v-model="form.interview_date"
                                type="datetime-local"
                                class="w-full px-2 py-1.5 border border-purple-200 rounded text-sm bg-white">
                        </div>
                        <div>
                            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Lokasi / Link</label>
                            <input
                                v-model="form.interview_location"
                                type="text"
                                placeholder="Google Meet, Zoom, Alamat kantor, dll"
                                class="w-full px-2 py-1.5 border border-purple-200 rounded text-sm bg-white">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[11px] font-semibold text-gray-600 mb-1">Tipe Interview</label>
                        <select
                            v-model="form.interview_type"
                            class="w-full px-2 py-1.5 border border-purple-200 rounded text-sm bg-white">
                            <option v-for="opt in interviewTypeOptions" :key="opt.value" :value="opt.value">
                                {{ opt.label }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Job Description -->
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Deskripsi Pekerjaan (Opsional)</label>
                    <textarea
                        v-model="form.job_description"
                        rows="2"
                        placeholder="Salin deskripsi pekerjaan atau ringkasannya"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"></textarea>
                </div>

                <!-- Notes -->
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Catatan Tambahan</label>
                    <textarea
                        v-model="form.notes"
                        rows="2"
                        placeholder="Tuliskan catatan atau follow-up yang perlu dilakukan..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"></textarea>
                </div>

            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                    @click="handleClose"
                    class="px-4 py-2 text-gray-500 font-bold text-sm hover:bg-gray-200 rounded-lg transition">
                    Batal
                </button>
                <button
                    @click="handleSubmit"
                    class="px-6 py-2 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-700 shadow-md transition">
                    {{ isEditing ? 'Perbarui' : 'Simpan' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
