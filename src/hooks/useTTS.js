import { useEffect, useState } from "react";

export default function useTTS() {
  const [error, setError] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  const supportsSpeech = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect((supportsSpeech) => {
    // cleanup on unmount
    return () => {
      try {
        if (supportsSpeech) window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    };
  }, [supportsSpeech]);

  const speakBrowser = async (textToSpeak) => {
    setError(null);
    if (!textToSpeak || !textToSpeak.trim()) {
      setError("Vui lòng nhập nội dung để nghe bằng trình duyệt.");
      return;
    }
    if (!supportsSpeech) {
      setError("Trình duyệt không hỗ trợ TTS cục bộ.");
      return;
    }

    try {
      window.speechSynthesis.cancel();
      setSpeaking(true);

      const msg = new SpeechSynthesisUtterance();
      msg.text = textToSpeak;
      msg.lang = "vi-VN";
      msg.rate = 1;
      msg.pitch = 1;

      msg.onend = () => setSpeaking(false);
      msg.onerror = (e) => {
        console.error("SpeechSynthesis error", e);
        setError("Lỗi khi phát bằng trình duyệt");
        setSpeaking(false);
      };

      window.speechSynthesis.speak(msg);
    } catch (err) {
      console.error("speakBrowser failed", err);
      setError(err.message || "Lỗi TTS cục bộ");
      setSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    try {
      if (supportsSpeech) window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
    setSpeaking(false);
  };

  return {
    speaking,
    supportsSpeech,
    error,
    speakBrowser,
    stopSpeaking,
  };
}
