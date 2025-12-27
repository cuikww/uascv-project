import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL_NAME = "gemini-2.5-flash";


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
            model: MODEL_NAME, 
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                temperature: 0.4, 
            }
        });

        let text = response.text || "";
        text = text.trim();

        const lines = text.split('\n');
        const cleanLines = lines.filter(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'));

        const finalResult = cleanLines.length > 0 ? cleanLines.join('\n') : text;

        res.json({ result: finalResult });

    } catch (error) {
        console.error("AI Error:", error);
        const errorMessage = error.body ? JSON.stringify(error.body) : error.message;
        res.status(500).json({ message: "Gagal generate deskripsi", error: errorMessage });
    }
};

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

export const generateStyle = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

    try {
        const fullPrompt = `
            You are an expert UI/UX Designer for a CV Builder. 
            Your task is to translate the user's description into a visual style configuration.

            You MUST return a single valid JSON object containing these keys: 
            - primary: HEX color code (e.g. "#0a84ff") 
            - font: font family name (choose one: "Inter", "Roboto", "Poppins", "Merriweather")
            - spacing: layout spacing (choose one: "compact" or "comfortable")
            - template: layout structure ID. MUST be strictly one of: ["modern", "creative", "minimalist", "professional"]
            - style_name: a short creative name for this style (e.g. "Corporate Blue")

            RULES FOR TEMPLATE SELECTION:
            - "modern": Standard layout, sidebar on left. Good for general use.
            - "creative": Bold colors, sidebar on left. Good for designers/artists.
            - "minimalist": Clean, centered header, no heavy sidebars. Good for executives.
            - "professional": Corporate look, header on top, conservative. Good for banking/law.

            Output MUST be valid JSON only, without any explanatory text or markdown code blocks.
            
            User description: "${prompt}"
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            config: { temperature: 0.2 } 
        });

        let text = response.text || "";
        text = text.trim();

        text = text.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '');

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : text;

        try {
            const parsed = JSON.parse(jsonString);

            if (!parsed.primary) parsed.primary = "#006894";
            if (!parsed.font) parsed.font = "Inter";
            if (!parsed.spacing) parsed.spacing = "comfortable";

            const validTemplates = ["modern", "creative", "minimalist", "professional"];
            if (!parsed.template || !validTemplates.includes(parsed.template)) {
                parsed.template = "modern";
            }

            return res.json({ style_config: parsed });
        } catch (err) {
            console.error('JSON parse error:', err);
            return res.status(500).json({ message: 'AI returned invalid JSON', raw: text });
        }

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ message: "Gagal generate style", error: error.message });
    }
};