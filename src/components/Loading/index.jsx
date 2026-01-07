import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <Box
      sx={{
        // position: "fixed",
        // left: 0,
        // top: 0,
        // zIndex: 9999,
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white backdrop
        width: "100%",
        height: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress sx={{ color: "#334155" }} size={60} thickness={5} />
    </Box>
  );
};

export default Loading;
