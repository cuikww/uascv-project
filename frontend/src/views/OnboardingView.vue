<script setup>
import { ref, onMounted } from "vue";
import { getAllCv, createCv, deleteCv } from "@/api/cv.js";
import { useRouter } from "vue-router";

const cvs = ref([]);
const loading = ref(false);
const error = ref(null);
const message = ref("");

// --- modal create CV ---
const showCreateModal = ref(false);
const careerLevel = ref("fresh_graduate");
const creating = ref(false);

const router = useRouter();

// ambil semua CV
const fetchCvs = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await getAllCv();
    cvs.value = res.data.data;
  } catch (err) {
    error.value = err.message || "Gagal mengambil CV";
  } finally {
    loading.value = false;
  }
};

// buat CV baru
const submitCreateCv = async () => {
  creating.value = true;
  try {
    const res = await createCv({ career_level: careerLevel.value });
    message.value = `CV berhasil dibuat (ID: ${res.data.cv_id})`;
    showCreateModal.value = false;
    await fetchCvs();
  } catch (err) {
    message.value = err.response?.data?.message || "Gagal membuat CV";
  } finally {
    creating.value = false;
  }
};

// hapus CV
const removeCv = async (cvId) => {
  if (!confirm("Apakah yakin ingin menghapus CV ini?")) return;
  try {
    await deleteCv(cvId);
    message.value = "CV berhasil dihapus";
    await fetchCvs();
  } catch (err) {
    message.value = err.response?.data?.message || "Gagal hapus CV";
  }
};

// navigasi ke detail
const goToDetail = (cvId) => {
  router.push(`/onboarding/cv/${cvId}`);
};

onMounted(fetchCvs);
</script>

<template>
  <div class="background">
    <div class="top"><h2>Daftar CV</h2></div>

    <div class="actions">
      <button @click="showCreateModal = true">+</button>
    </div>
    
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else class="cv-grid">
      <div v-for="cv in cvs" :key="cv.id" class="cv-card">
        <h3>{{ cv.title }}</h3>
        <p>Status: <strong>{{ cv.status }}</strong></p>
        <p>Level: {{ cv.career_level }}</p>
        <div class="card-actions">
          <button @click="goToDetail(cv.id)">Update</button>
          <button @click="removeCv(cv.id)">Delete</button>
        </div>
      </div>
    </div>

    <!-- Modal Create -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal">
        <h3>Pilih Career Level</h3>
        <select v-model="careerLevel">
          <option value="fresh_graduate">Fresh Graduate</option>
          <option value="professional">Professional</option>
        </select>
        <div class="modal-actions">
          <button @click="submitCreateCv" :disabled="creating">Buat</button>
          <button @click="showCreateModal = false">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  min-height: 100vh;
  display: flex;
  flex-direction: column; 
  align-items: center;
  justify-content: flex-start;
  background:
    linear-gradient(to top, white 50%, transparent 50%),
    linear-gradient(135deg, #5edbee, #77f582);
  padding: 2rem 1rem;
}

.top {
  width: 100%;
  text-align: center;
  margin-bottom: 1.5rem;
}

.top h2 {
  font-weight: bold;
  color: #333;
  font-size: 3rem;
  margin: 0;
}

.actions {
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.actions button {
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 50%;
  border: none;
  background-color: #333;
  color: white;
  cursor: pointer;
  transition: 0.2s;
}

.actions button:hover {
  background-color: #84b48e;
}

/* Grid untuk daftar CV */
.cv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 1000px;
}

.cv-card {
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cv-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.cv-card p {
  margin: 0.3rem 0;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.card-actions button {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  cursor: pointer;
}

/* Pesan & error */
.message { margin-top: 1rem; color: green; }
.error { color: red; }
.loading { margin: 1rem 0; }

/* Modal */
.modal-overlay {
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color: rgba(0,0,0,0.5);
  display:flex;
  justify-content:center;
  align-items:center;
}
.modal {
  background-color:white;
  padding:1.5rem;
  border-radius:0.5rem;
  min-width:300px;
}
.modal-actions {
  margin-top:1rem;
  display:flex;
  justify-content:flex-end;
  gap:0.5rem;
}
input, select {
  width:100%;
  padding:0.4rem;
  margin-top:0.5rem;
}
</style>
