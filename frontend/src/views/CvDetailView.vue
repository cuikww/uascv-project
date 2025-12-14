<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getCv, updateCv } from "@/api/cv.js";
import { getCvBasicInfoById, insertCvBasicInfo, updateCvBasicInfo } from "@/api/basic.js";

const route = useRoute();
const cvId = route.params.cvId;

// --- state CV ---
const cvData = ref(null);
const cvLoading = ref(false);

// --- state Basic Info ---
const basicInfo = ref(null);
const basicInfoForm = ref({
  phone_number: "",
  linkedin_url: "",
  github_url: "",
  address: "",
  city: "",
  province: "",
  country: "",
  postal_code: "",
  date_of_birth: "",
  profile_summary: "",
});
const basicLoading = ref(false);

// --- pesan ---
const message = ref("");

// --- ambil CV dan Basic Info ---
const fetchCvDetail = async () => {
  cvLoading.value = true;
  try {
    const res = await getCv(cvId);
    cvData.value = res.data.data;

    // Ambil basic info
    try {
      const basicRes = await getCvBasicInfoById(cvId);
      basicInfo.value = basicRes.data.data;
      basicInfoForm.value = { ...basicInfo.value };
    } catch (err) {
      if (err.response?.status === 404) {
        // Belum ada basic info → form tetap kosong
        basicInfo.value = null;
        basicInfoForm.value = {};
      } else {
        console.error(err);
        message.value = err.response?.data?.message || "Gagal memuat basic info";
      }
    }
  } catch (err) {
    console.error(err);
    message.value = err.response?.data?.message || "Gagal memuat CV";
  } finally {
    cvLoading.value = false;
  }
};

// --- update title / status ---
const saveCvData = async () => {
  if (!cvData.value) return;
  try {
    const res = await updateCv(cvId, {
      title: cvData.value.title,
      status: cvData.value.status,
    });
    cvData.value = res.data.data;
    message.value = "CV berhasil diperbarui";
  } catch (err) {
    console.error(err);
    message.value = err.response?.data?.message || "Gagal update CV";
  }
};

// --- save basic info ---
const saveBasicInfo = async () => {
  basicLoading.value = true;
  try {
    if (basicInfo.value) {
      // sudah ada → update
      const res = await updateCvBasicInfo(cvId, basicInfo.value.id, basicInfoForm.value);
      basicInfo.value = res.data.data;
    } else {
      // belum ada → insert
      const res = await insertCvBasicInfo(cvId, basicInfoForm.value);
      basicInfo.value = res.data.data;
    }
    message.value = "Basic info berhasil disimpan";
  } catch (err) {
    console.error(err);
    message.value = err.response?.data?.message || "Gagal menyimpan basic info";
  } finally {
    basicLoading.value = false;
  }
};

onMounted(fetchCvDetail);
</script>

<template>
  <div class="cv-detail">
    <div class="top">
      <router-link to="/onboarding" class="back-arrow">← Kembali</router-link>

      <div v-if="cvLoading" class="loading">Loading CV...</div>
      <div v-else-if="!cvData" class="not-found">CV tidak ditemukan</div>
      <div v-else class="cv-header">
        <!-- Title tampil seperti teks -->
        <input v-model="cvData.title" class="title-input" />

        <div class="status-row">
          <label>Status</label>
          <select v-model="cvData.status" class="status-select">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <!-- Tombol save modern -->
          <button @click="saveCvData" title="Simpan Status CV">
            💾
          </button>
        </div>
      </div>
    </div>

    <hr />

    <h3>Basic Info</h3>
    <div v-if="basicLoading" class="loading">Loading...</div>
    <div v-else class="basic-info">
      <label>Phone Number:</label>
      <input v-model="basicInfoForm.phone_number" placeholder="Phone Number" />

      <label>LinkedIn:</label>
      <input v-model="basicInfoForm.linkedin_url" placeholder="LinkedIn URL" />

      <label>GitHub:</label>
      <input v-model="basicInfoForm.github_url" placeholder="GitHub URL" />

      <label>Address:</label>
      <input v-model="basicInfoForm.address" placeholder="Address" />

      <label>City:</label>
      <input v-model="basicInfoForm.city" placeholder="City" />

      <label>Province:</label>
      <input v-model="basicInfoForm.province" placeholder="Province" />

      <label>Country:</label>
      <input v-model="basicInfoForm.country" placeholder="Country" />

      <label>Postal Code:</label>
      <input v-model="basicInfoForm.postal_code" placeholder="Postal Code" />

      <label>Date of Birth:</label>
      <input type="date" v-model="basicInfoForm.date_of_birth" />

      <label>Profile Summary:</label>
      <textarea v-model="basicInfoForm.profile_summary" placeholder="Profile Summary"></textarea>

      <button @click="saveBasicInfo">💾 Save Basic Info</button>
    </div>

    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<style scoped>
.cv-detail {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.top {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.back-arrow {
  text-decoration: none;
  color: #3c9d5f;
  font-weight: bold;
}

.cv-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title-input {
  font-size: 2rem;
  text-align: center;
  font-weight: bold;
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  padding: 0;
  margin-bottom: 0.5rem;
}

.title-input:focus {
  border-bottom: 1px solid #5edbee;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-row label {
  font-weight: bold;
  color: #3c9d5f; /* hijau */
}

.status-select {
  padding: 0.4rem 0.6rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  appearance: none; /* hilangkan tampilan default */
  cursor: pointer;
  height: 2rem; /* samakan tinggi tombol */
}

.status-select:focus {
  border-color: #5edbee;
  outline: none;
}

.basic-info h3 {
  font-size: 1.6rem; /* perbesar tulisan Basic Info */
  margin-bottom: 1rem;
}

.basic-info label {
  font-weight: bold;
  margin-top: 0.8rem;
  display: block;
  color: #3c9d5f; /* hijau */
}

input, select, textarea {
  width: 100%;
  padding: 0.4rem;
  margin-top: 0.2rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.loading {
  color: #888;
}

.not-found {
  color: red;
}
</style>