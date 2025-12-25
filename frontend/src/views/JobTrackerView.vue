<script setup>
import { ref, computed, onMounted } from 'vue';
import NavbarDashboard from '@/components/NavbarDashboard.vue';
import JobTrackerModal from '@/components/JobTrackerModal.vue';
import {
    getAllJobApplications,
    updateJobApplicationStatus,
    deleteJobApplication,
    createJobApplication,
    updateJobApplication
} from '@/api/jobTracker.js';
import { getAllCv } from '@/api/cv.js';

// State
const applications = ref({
    wishlist: [],
    applied: [],
    interview: [],
    offer: []
});

const allApplications = ref([]);
const cvList = ref([]);
const isLoading = ref(true);
const showModal = ref(false);
const editingApp = ref(null);

// Modal form state
const formData = ref({
    company_name: '',
    position_title: '',
    status: 'wishlist',
    cv_id: null,
    job_description: '',
    job_url: '',
    applied_date: '',
    interview_date: '',
    interview_location: '',
    interview_type: 'video',
    company_location: '',
    work_mode: 'hybrid',
    salary_range: '',
    job_type: 'full-time',
    notes: '',
    is_favourite: false,
    difficulty_level: 'medium'
});

// Computed properties
const statusColors = {
    wishlist: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', icon: '📌' },
    applied: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: '✈️' },
    interview: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', icon: '🎤' },
    offer: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: '🎉' },
};

const statusLabels = {
    wishlist: 'Ingin Dilamar',
    applied: 'Sudah Dilamar',
    interview: 'Interview',
    offer: 'Offer'
};

const getCompanyInitials = (companyName) => {
    return companyName
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
};

const getCompanyColor = (index) => {
    const colors = [
        'bg-blue-50 text-blue-600 border-blue-100',
        'bg-orange-50 text-orange-600 border-orange-100',
        'bg-green-50 text-green-600 border-green-100',
        'bg-purple-50 text-purple-600 border-purple-100',
        'bg-pink-50 text-pink-600 border-pink-100',
        'bg-indigo-50 text-indigo-600 border-indigo-100'
    ];
    return colors[index % colors.length];
};

const getStatusBadgeColor = (status) => {
    const badges = {
        'low': 'bg-green-100 text-green-700',
        'medium': 'bg-yellow-100 text-yellow-700',
        'high': 'bg-red-100 text-red-700'
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
};

// Methods
const loadData = async () => {
    isLoading.value = true;
    try {
        // Load job applications
        const [appsRes, cvRes] = await Promise.all([
            getAllJobApplications(),
            getAllCv()
        ]);
        
        allApplications.value = appsRes.data || [];
        cvList.value = Array.isArray(cvRes.data) ? cvRes.data : (cvRes.data?.data || []);
        
        // Group by status
        const grouped = {
            wishlist: [],
            applied: [],
            interview: [],
            offer: []
        };
        
        appsRes.data.forEach(app => {
            if (grouped[app.status]) {
                grouped[app.status].push(app);
            }
        });
        
        applications.value = grouped;
    } catch (err) {
        console.error('Error loading data:', err);
        alert('Gagal memuat data. Silakan refresh halaman.');
    } finally {
        isLoading.value = false;
    }
};

const openModal = (status = 'wishlist', app = null) => {
    if (app) {
        // Edit mode
        editingApp.value = app;
        formData.value = { ...app };
    } else {
        // Create mode
        editingApp.value = null;
        formData.value = {
            company_name: '',
            position_title: '',
            status,
            cv_id: null,
            job_description: '',
            job_url: '',
            applied_date: '',
            interview_date: '',
            interview_location: '',
            interview_type: 'video',
            company_location: '',
            work_mode: 'hybrid',
            salary_range: '',
            job_type: 'full-time',
            notes: '',
            is_favourite: false,
            difficulty_level: 'medium'
        };
    }
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    editingApp.value = null;
};

const handleSaveApplication = async (data) => {
    try {
        if (editingApp.value) {
            // Update
            await updateJobApplication(editingApp.value.id, data);
        } else {
            // Create
            await createJobApplication(data);
        }
        closeModal();
        await loadData();
    } catch (err) {
        console.error('Error saving application:', err.response?.data || err.message);
        alert('Gagal menyimpan aplikasi. Cek console untuk detail.');
    }
};

const handleStatusChange = async (appId, newStatus) => {
    try {
        await updateJobApplicationStatus(appId, newStatus);
        await loadData();
    } catch (err) {
        console.error('Error updating status:', err);
        alert('Gagal mengubah status.');
    }
};

const handleDeleteApplication = async (appId) => {
    if (confirm('Apakah Anda yakin ingin menghapus aplikasi ini?')) {
        try {
            await deleteJobApplication(appId);
            await loadData();
        } catch (err) {
            console.error('Error deleting application:', err);
            alert('Gagal menghapus aplikasi.');
        }
    }
};

const getCvTitle = (cvId) => {
    const cv = cvList.value.find(c => c.id === cvId);
    return cv ? cv.title : '-';
};

// Lifecycle
onMounted(() => {
    loadData();
});
</script>

<template>
    <div class="h-screen flex flex-col bg-slate-50">
        <!-- Navbar -->
        <NavbarDashboard />

        <!-- Main Content -->
        <main class="flex-1 overflow-auto p-6">
            <!-- Header & Add Button -->
            <div class="mb-8 flex justify-between items-start gap-4">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800">Job Application Tracker</h1>
                    <p class="text-gray-500 text-sm mt-2">Pantau semua aplikasi pekerjaan Anda dalam satu tempat</p>
                </div>
                <button
                    @click="openModal('wishlist')"
                    class="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition shadow-sm whitespace-nowrap">
                    + Catat Lamaran Baru
                </button>
            </div>

            <!-- Kanban Board -->
            <div v-if="!isLoading" class="overflow-x-auto">
                <div class="flex gap-6 min-w-[1400px] pb-10">
                    <!-- Column for each status -->
                    <div
                        v-for="status in ['wishlist', 'applied', 'interview', 'offer']"
                        :key="status"
                        class="w-80 flex flex-col h-full">
                        <!-- Column Header -->
                        <div class="flex items-center justify-between mb-4 p-2 rounded-lg border"
                            :class="`${statusColors[status].bg} ${statusColors[status].border}`">
                            <h3 :class="`font-bold text-sm uppercase tracking-wide px-2 ${statusColors[status].text}`">
                                {{ statusColors[status].icon }} {{ statusLabels[status] }}
                            </h3>
                            <span class="bg-white text-gray-500 text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                                {{ applications[status].length }}
                            </span>
                        </div>

                        <!-- Cards -->
                        <div class="flex-1 space-y-3 overflow-y-auto pr-2 pb-10">
                            <!-- Empty State -->
                            <div v-if="applications[status].length === 0" class="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center h-32">
                                <span class="text-2xl opacity-20 mb-2">📭</span>
                                <span class="text-xs text-gray-400 font-medium">Belum ada<br>{{ statusLabels[status].toLowerCase() }}</span>
                            </div>

                            <!-- Application Cards -->
                            <div
                                v-for="(app, idx) in applications[status]"
                                :key="app.id"
                                class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:border-emerald-400 hover:shadow-md transition group"
                                :class="status === 'applied' ? 'border-l-4 border-l-emerald-500' : status === 'interview' ? 'border-l-4 border-l-purple-500' : status === 'offer' ? 'border-l-4 border-l-blue-500' : ''">

                                <!-- Card Header -->
                                <div class="flex justify-between items-start mb-2">
                                    <div
                                        class="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs border"
                                        :class="getCompanyColor(idx)">
                                        {{ getCompanyInitials(app.company_name) }}
                                    </div>
                                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                        <button
                                            @click.stop="openModal(status, app)"
                                            class="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition">
                                            Edit
                                        </button>
                                        <button
                                            @click.stop="handleDeleteApplication(app.id)"
                                            class="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition">
                                            Hapus
                                        </button>
                                    </div>
                                </div>

                                <!-- Job Info -->
                                <h4 class="font-bold text-gray-800 text-sm leading-tight">{{ app.position_title }}</h4>
                                <p class="text-xs text-gray-500 mb-3">{{ app.company_name }}</p>

                                <!-- Location & Work Mode -->
                                <div class="flex flex-wrap gap-1 mb-2">
                                    <span v-if="app.company_location" class="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-medium">
                                        📍 {{ app.company_location }}
                                    </span>
                                    <span v-if="app.work_mode" class="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-medium">
                                        💻 {{ app.work_mode }}
                                    </span>
                                </div>

                                <!-- Difficulty Level Badge -->
                                <div v-if="app.difficulty_level" class="mb-2">
                                    <span :class="getStatusBadgeColor(app.difficulty_level)" class="text-[10px] px-1.5 py-0.5 rounded font-medium">
                                        {{ app.difficulty_level === 'low' ? '🟢 Mudah' : app.difficulty_level === 'medium' ? '🟡 Sedang' : '🔴 Sulit' }}
                                    </span>
                                </div>

                                <!-- CV Info -->
                                <div v-if="app.cv_id" class="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-1 rounded inline-block mb-2">
                                    CV: <b>{{ getCvTitle(app.cv_id) }}</b>
                                </div>

                                <!-- Interview Details -->
                                <div v-if="status === 'interview' && app.interview_date" class="text-[11px] text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                                    📅 {{ new Date(app.interview_date).toLocaleDateString('id-ID') }}<br>
                                    <span v-if="app.interview_location">📍 {{ app.interview_location }}</span>
                                </div>

                                <!-- Applied Date -->
                                <div v-if="app.applied_date && status !== 'wishlist'" class="text-[10px] text-gray-400 mt-2">
                                    Dilamar: {{ new Date(app.applied_date).toLocaleDateString('id-ID') }}
                                </div>

                                <!-- Move to Status Buttons -->
                                <div v-if="status !== 'offer'" class="mt-3 pt-2 border-t border-gray-100">
                                    <button
                                        @click.stop="handleStatusChange(app.id, status === 'wishlist' ? 'applied' : status === 'applied' ? 'interview' : 'offer')"
                                        class="w-full text-xs py-1.5 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100 transition font-medium">
                                        {{ status === 'wishlist' ? 'Tandai Dilamar' : status === 'applied' ? 'Lanjut Interview' : 'Terima Offer' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-else class="flex items-center justify-center h-96">
                <div class="text-center">
                    <div class="text-4xl mb-4">⏳</div>
                    <p class="text-gray-500">Memuat data...</p>
                </div>
            </div>
        </main>

        <!-- Modal -->
        <JobTrackerModal
            v-if="showModal"
            :show="showModal"
            :isEditing="!!editingApp"
            :formData="formData"
            :cvList="cvList"
            @save="handleSaveApplication"
            @close="closeModal"
        />
    </div>
</template>

<style scoped>
/* Custom scrollbar untuk board */
::-webkit-scrollbar {
    height: 8px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}
</style>
