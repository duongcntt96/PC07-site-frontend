import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  GeoJSON,
  useMap,
} from "react-leaflet";
import {
  Paper,
  Typography,
  Box,
  Divider,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { tayNinhGeoJson } from "./TayNinhGeojson";
import qlptApi from "api/qlptApi";
import { treeToList } from "utils/DWUtils";

/* ================= ICON GỐC ================= */
const fireIcon = new L.Icon({
  iconUrl:
    "https://pccctayninh.vercel.app/static/media/logo.c0754a2a13ea1e935658.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

/* ================= RANH GIỚI ================= */
const boundaryStyle = {
  color: "#d32f2f",
  weight: 3,
  opacity: 0.9,
  fillOpacity: 0,
};

/* === PATCH: resize map khi fullscreen / drawer === */
const MapResizeHelper = ({ trigger }) => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 200);
  }, [trigger, map]);
  return null;
};

const GisMap = () => {
  /* ================= STATE GỐC ================= */
  const [stations, setStations] = useState([]);
  const [showBoundary, setShowBoundary] = useState(true);
  const [mapType, setMapType] = useState("street");

  const [streetViewOpen, setStreetViewOpen] = useState(false);
  const [streetViewCoords, setStreetViewCoords] = useState(null);
  const [streetViewName, setStreetViewName] = useState("");

  const [teamQuery, setTeamQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  /* ================= RESPONSIVE ================= */
  const isMobile = useMediaQuery("(max-width:900px)");
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* ================= FULLSCREEN PATCH ================= */
  const mapWrapperRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* ================= FETCH DATA (GIỮ NGUYÊN) ================= */
  useEffect(() => {
    const fetchStations = async () => {
      const respTree = (await qlptApi.getListKho()).data || [];
      const flat = treeToList(respTree);
      const normalized = flat
        .map((n) => ({
          ...n,
          latitude:
            n.latitude ??
            n.lat ??
            n.lat_gps ??
            (n.location && n.location.lat) ??
            null,
          longitude:
            n.longitude ??
            n.lng ??
            n.lon ??
            (n.location && n.location.lng) ??
            null,
        }))
        .filter((n) => n.latitude != null && n.longitude != null);
      setStations(normalized);
    };
    fetchStations();
  }, []);

  /* ================= INVENTORY (GỐC DEMO) ================= */
  const inventory = {
    1: [
      { ten: "Xe thang 52m", sl: 2 },
      { ten: "Xe chữa cháy MAN", sl: 4 },
    ],
    2: [{ ten: "Xe bơm công suất lớn", sl: 3 }],
  };

  const centerPosition = [10.89438, 106.393177];

  const mapLayers = {
    street: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      label: "Giao thông",
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      label: "Vệ tinh",
    },
  };

  /* ================= STREET VIEW – KHÔI PHỤC NGUYÊN BẢN ================= */
  const getStreetViewUrl = (lat, lng) =>
    `https://www.google.com/maps?q=&layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0&output=svembed`;

  const filteredStations = stations.filter((s) => {
    if (
      teamQuery &&
      !(s.ten || "").toLowerCase().includes(teamQuery.toLowerCase())
    )
      return false;
    if (selectedCategory) {
      return (inventory[s.id] || []).some(
        (i) => i.ten === selectedCategory
      );
    }
    return true;
  });

  /* ================= FULLSCREEN ================= */
  const toggleFullscreen = () => {
    const el = mapWrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", handler);
    return () =>
      document.removeEventListener("fullscreenchange", handler);
  }, []);

  /* ================= DASHBOARD (PIN – KHÔNG ĐỔI LOGIC) ================= */
  const Dashboard = (
    <Paper elevation={6} sx={{ width: 300, p: 1.5 }}>
      <Typography variant="h6">Bảng điều khiển</Typography>

      <TextField
        size="small"
        fullWidth
        label="Tìm tên đội"
        sx={{ mt: 1 }}
        value={teamQuery}
        onChange={(e) => setTeamQuery(e.target.value)}
      />

      <FormControl fullWidth size="small" sx={{ mt: 1 }}>
        <InputLabel>Chủng loại</InputLabel>
        <Select
          value={selectedCategory}
          label="Chủng loại"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="Xe chữa cháy MAN">
            Xe chữa cháy MAN
          </MenuItem>
          <MenuItem value="Xe thang 52m">Xe thang 52m</MenuItem>
        </Select>
      </FormControl>

      <Divider sx={{ my: 1 }} />

      <List dense>
        {filteredStations.slice(0, 6).map((st) => (
          <ListItem key={st.id}>
            <ListItemText primary={st.ten} secondary={st.loai} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  return (
    <Box>
      {/* HEADER MOBILE */}
      {isMobile && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography fontWeight="bold">
            PHƯƠNG TIỆN PCCC & CNCH
          </Typography>
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Stack>
      )}

      {/* MAP WRAPPER */}
      <Box
        ref={mapWrapperRef}
        sx={{
          position: "relative",
          height: isFullscreen ? "100vh" : { xs: "65vh", md: 550 },
        }}
      >
        {/* PIN DASHBOARD DESKTOP */}
        {!isMobile && (
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 1000,
            }}
          >
            {Dashboard}
          </Box>
        )}

        {/* MAP CONTROLS */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Stack direction="row" spacing={1}>
            <Chip
              size="small"
              label={showBoundary ? "Ẩn ranh giới" : "Hiện ranh giới"}
              onClick={() => setShowBoundary(!showBoundary)}
            />
            {Object.keys(mapLayers).map((k) => (
              <Chip
                key={k}
                size="small"
                label={mapLayers[k].label}
                color={mapType === k ? "primary" : "default"}
                onClick={() => setMapType(k)}
              />
            ))}
            <IconButton
              size="small"
              onClick={toggleFullscreen}
              sx={{ bgcolor: "white" }}
            >
              {isFullscreen ? (
                <FullscreenExitIcon />
              ) : (
                <FullscreenIcon />
              )}
            </IconButton>
          </Stack>
        </Box>

        <MapContainer
          center={centerPosition}
          zoom={9}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <ZoomControl position="bottomright" />
          <TileLayer url={mapLayers[mapType].url} />

          {showBoundary && (
            <GeoJSON data={tayNinhGeoJson} style={boundaryStyle} />
          )}

          {filteredStations.map((st) => (
            <Marker
              key={st.id}
              position={[st.latitude, st.longitude]}
              icon={fireIcon}
            >
              <Popup maxWidth={320}>
                <Typography fontWeight="bold">{st.ten}</Typography>
                <Divider sx={{ my: 1 }} />
                {/* === LOGIC XEM TOÀN CẢNH GỐC === */}
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    setStreetViewCoords([
                      st.latitude,
                      st.longitude,
                    ]);
                    setStreetViewName(st.ten || "Street View");
                    setStreetViewOpen(true);
                  }}
                >
                  Xem toàn cảnh
                </Button>
              </Popup>
            </Marker>
          ))}

          <MapResizeHelper trigger={isFullscreen || drawerOpen} />
        </MapContainer>
      </Box>

      {/* DRAWER MOBILE (BÊN PHẢI) */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {Dashboard}
      </Drawer>

      {/* STREET VIEW – GIỮ NGUYÊN BẢN GỐC */}
      <Dialog
        open={streetViewOpen}
        onClose={() => setStreetViewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {streetViewName}
          <IconButton
            onClick={() => setStreetViewOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: "100%", height: 500 }}>
            {streetViewCoords && (
              <iframe
                title="Street View"
                width="100%"
                height="100%"
                frameBorder="0"
                src={getStreetViewUrl(
                  streetViewCoords[0],
                  streetViewCoords[1]
                )}
                allowFullScreen
              />
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GisMap;
