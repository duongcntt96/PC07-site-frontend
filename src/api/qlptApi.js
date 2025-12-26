import axiosClient from "./axiosClient";
import { normalizeList } from "./responseHelper";
const qlptApi = {
  textToMp3: async (arg) => {
    // Accept either a string or an options object { text, lang }
    let text = null;
    let lang = "vi";
    if (typeof arg === "string") text = arg;
    else if (arg && typeof arg === "object") {
      text = arg.text || arg.q || arg.query || arg.payload || null;
      if (arg.lang) lang = arg.lang;
    }

    // Use Google Translate TTS endpoint directly.
    // Note: Google does not provide an official public TTS endpoint for browsers; this method
    // constructs translate.google.com/translate_tts URLs which work for short texts.
    if (!text) return null;
    const MAX_CHUNK = 200; // safe chunk size for translate_tts

    // Split text into chunks not exceeding MAX_CHUNK, preferring sentence boundaries.
    const splitText = (input, size) => {
      const parts = [];
      let remaining = input.trim();
      while (remaining.length) {
        if (remaining.length <= size) {
          parts.push(remaining.trim());
          break;
        }
        // try to split at sentence boundary
        let idx = -1;
        const punct = [". ", "? ", "! ", "; ", "\n"];
        for (const p of punct) {
          const i = remaining.lastIndexOf(p, size);
          if (i > -1) {
            idx = i + 1; // keep punctuation
            break;
          }
        }
        if (idx === -1) {
          // fallback: split at last space
          idx = remaining.lastIndexOf(" ", size);
          if (idx === -1) idx = size; // hard split
        }
        parts.push(remaining.slice(0, idx).trim());
        remaining = remaining.slice(idx).trim();
      }
      return parts;
    };

    const chunks = splitText(text, MAX_CHUNK);

    const buildUrl = (chunk) => {
      const params = new URLSearchParams({
        ie: "UTF-8",
        q: chunk,
        tl: lang,
        client: "tw-ob",
      });
      return `https://translate.google.com/translate_tts?${params.toString()}`;
    };

    if (chunks.length === 1) return buildUrl(chunks[0]);
    return chunks.map(buildUrl);
  },
  getListChungloai: async (params) => {
    const url = "/qlpt/chungloai";
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },
  getListKho: async (params) => {
    const url = "/qlpt/kho";
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },
  getListNguoncap: async (params) => {
    const url = "/qlpt/nguoncap";
    const resp = await axiosClient.get(url);
    return normalizeList(resp);
  },
  getListPhuongtien: async (params) => {
    const url = "/qlpt/phuongtien";
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },
  getPhuongtien: (id) => {
    const url = `/qlpt/phuongtien/${id}`;
    return axiosClient.get(url);
  },
  getListPhieunhap: async (params) => {
    const url = "/qlpt/phieunhap";
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },
  getPhieunhap: (id) => {
    const url = `/qlpt/phieunhap/${id}`;
    return axiosClient.get(url);
  },
  getChitietPhieunhap: async (params) => {
    const url = `/qlpt/chitietphieunhap/`;
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },
  addPhieunhap: (params) => {
    const url = "/qlpt/phieunhap/";
    return axiosClient.post(url, params);
  },
  addPhuongtien: (params) => {
    const url = "/qlpt/phuongtien/";
    return axiosClient.post(url, params);
  },
  updatePhieunhap: (params) => {
    const url = `/qlpt/phieunhap/${params.id}/`;
    return axiosClient.put(url, params);
  },

  updatePhuongtien: (params) => {
    const url = `/qlpt/phuongtien/${params.id}/`;
    return axiosClient.put(url, params);
  },

  delPhieunhap: (id) => {
    const url = `/qlpt/phieunhap/${id}`;
    return axiosClient.delete(url);
  },
  addChitietPhieunhap: (params) => {
    const url = "/qlpt/chitietphieunhap/";
    return axiosClient.post(url, params);
  },
  delChitietPhieunhap: (id) => {
    const url = `/qlpt/chitietphieunhap/${id}`;
    return axiosClient.delete(url);
  },
};

export default qlptApi;
