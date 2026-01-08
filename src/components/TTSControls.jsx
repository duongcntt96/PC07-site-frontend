import React, { useState } from "react";
import useTTS from "hooks/useTTS";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";

export default function TTSControls() {
  const [text, setText] = useState("");
  const { speaking, supportsSpeech, error, speakBrowser, stopSpeaking } = useTTS();

  return (
    <Box sx={{
      background: '#fff',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      width: '100%',
    }}>
      <Typography variant="h6" component="h4" sx={{ mb: 2 }}>
        Chuyển văn bản thành giọng nói
      </Typography>

      <TextField
        name="text"
        placeholder="Nhập văn bản..."
        multiline
        rows={6}
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => speakBrowser(text)}
          disabled={!supportsSpeech || speaking || !text.trim()}
        >
          {speaking ? "Đang nói..." : "Nghe bằng trình duyệt"}
        </Button>

        {speaking ? (
          <Button
            variant="outlined"
            color="secondary"
            sx={{ ml: 1 }}
            onClick={stopSpeaking}
          >
            Dừng
          </Button>
        ) : null}
      </Box>
      {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
    </Box>
  );
}
