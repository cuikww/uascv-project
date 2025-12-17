import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

// Inisialisasi SDK Baru
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Gunakan model yang stabil. Jika 2.0 gagal, gunakan 'gemini-1.5-flash'
const MODEL_NAME = "gemini-2.5-flash";

// 1. GENERATE EXPERIENCE DESCRIPTION
// ... imports dan inisialisasi AI

export const generateExperienceDesc = async (req, res) => {
    const { position, company, keywords, target_job, target_company, target_desc } = req.body;

    if (!position || !keywords) {
        return res.status(400).json({ message: "Posisi dan Keywords wajib diisi" });
    }

    try {
        const prompt = `
            Bertindaklah sebagai mesin generator konten CV profesional.
            Tugasmu adalah menulis bullet points pengalaman kerja.
            
            KONTEKS KANDIDAT:
            - Pengalaman: ${position} di ${company}
            - Skill: ${keywords}
            
            KONTEKS TARGET:
            - Melamar ke: ${target_company || 'Perusahaan Teknologi'} sebagai ${target_job || 'Posisi Relevan'}
            - Kebutuhan: ${target_desc || 'Profesional kompeten'}
            
            INSTRUKSI ISI:
            1. Buat 3-4 poin bullet.
            2. Pola: Kata Kerja Aktif + Konteks + Hasil/Angka (Impact).
            3. Maksimal 20 kata per poin.
            
            ATURAN FORMAT OUTPUT (WAJIB DIPATUHI):
            1. DILARANG memberikan kalimat pengantar (seperti "Tentu", "Berikut adalah", "Sebagai recruiter").
            2. DILARANG memberikan kalimat penutup atau kesimpulan.
            3. DILARANG menggunakan markdown bold (**teks**) berlebihan.
            4. HANYA output daftar bullet points.
            5. Langsung mulai karakter pertama dengan simbol bullet (•).
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME, // Pastikan pakai gemini-2.5-flash atau gemini-1.5-flash
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                temperature: 0.4, // Turunkan temperature agar lebih 'robot' dan patuh aturan
            }
        });

        // Pembersihan Tambahan di sisi Code (Jaga-jaga AI bandel)
        let text = response.text || "";
        text = text.trim();
        
        // Hapus baris pertama jika tidak dimulai dengan bullet (berarti itu intro)
        const lines = text.split('\n');
        const cleanLines = lines.filter(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'));
        
        // Jika filter di atas bekerja, gunakan hasilnya. Jika kosong (format beda), gunakan text asli.
        const finalResult = cleanLines.length > 0 ? cleanLines.join('\n') : text;

        res.json({ result: finalResult });

    } catch (error) {
        console.error("AI Error:", error);
        const errorMessage = error.body ? JSON.stringify(error.body) : error.message;
        res.status(500).json({ message: "Gagal generate deskripsi", error: errorMessage });
    }
};

// 2. GENERATE PROFESSIONAL SUMMARY
export const generateSummary = async (req, res) => {
    const { fullname, jobTitle, keywords, experience_level } = req.body;

    try {
        const prompt = `
            Bertindaklah sebagai penulis CV profesional.
            Buatkan "Professional Summary" (Ringkasan Profil) yang menarik dalam Bahasa Indonesia.
            
            Nama Kandidat: ${fullname || 'Saya'}
            Target Posisi: ${jobTitle || 'Profesional'}
            Level Pengalaman: ${experience_level || 'Menengah'}
            Keahlian/Highlight: ${keywords}
            
            Instruksi:
            1. Tulis dalam 1 paragraf (maksimal 3-4 kalimat).
            2. Buat nada yang percaya diri namun tetap rendah hati.
            3. Tekankan nilai tambah yang bisa diberikan kandidat.
            4. Jangan pakai bullet points, gunakan teks narasi.
            5. Langsung ke isi ringkasan, tanpa basa-basi.
        `;

        // Syntax Baru
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                temperature: 0.7,
            }
        });

        const text = response.text;

        res.json({ result: text ? text.trim() : "Gagal generate summary" });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ message: "Gagal generate summary", error: error.message });
    }
};