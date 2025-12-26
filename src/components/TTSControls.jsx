import React, { useState } from "react";
import useTTS from "hooks/useTTS";

export default function TTSControls() {
  const [text, setText] = useState("");
  const { speaking, supportsSpeech, error, speakBrowser, stopSpeaking } = useTTS();

  return (
    <div className="tts-form">
      <h4>Chuyển văn bản thành giọng nói</h4>

      <div>
        <textarea
          name="text"
          placeholder="Nhập văn bản..."
          cols={40}
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => speakBrowser(text)}
          disabled={!supportsSpeech || speaking || !text.trim()}
        >
          {speaking ? "Đang nói..." : "Nghe bằng trình duyệt"}
        </button>

        {speaking ? (
          <button
            type="button"
            className="btn-secondary"
            style={{ marginLeft: 8 }}
            onClick={stopSpeaking}
          >
            Dừng
          </button>
        ) : null}
      </div>
      {error && <div className="alert alert-danger" style={{ marginTop: 8 }}>{error}</div>}
    </div>
  );
}
