import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  GeoJSON,
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { tayNinhGeoJson } from "./TayNinhGeojson";
import qlptApi from "api/qlptApi";
import { treeToList } from "utils/DWUtils";

// 1. Tạo Icon chuyên ngành PCCC
const fireIcon = new L.Icon({
  iconUrl:
    "https://pccctayninh.vercel.app/static/media/logo.c0754a2a13ea1e935658.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const boundaryStyle = {
  color: "#d32f2f",
  weight: 3,
  opacity: 0.9,
  fillOpacity: 0,
};

const onBoundaryEachFeature = (feature, layer) => {
  if (feature.properties && feature.properties.popupContent) {
    layer.bindPopup(feature.properties.popupContent);
  }
};

const GisMap = () => {
  const [stations, setStations] = useState([]);
  useEffect(() => {
    const fetchStations = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };
    fetchStations();
  }, []);

  const [inventory] = useState({
    1: [
      { ten: "Xe thang 52m", sl: 2, tinh_trang: "Sẵn sàng" },
      { ten: "Xe chữa cháy MAN", sl: 4, tinh_trang: "Sẵn sàng" },
      { ten: "Robot chữa cháy", sl: 1, tinh_trang: "Bảo trì" },
    ],
    2: [
      { ten: "Xe bơm công suất lớn", sl: 3, tinh_trang: "Sẵn sàng" },
      { ten: "Cano cứu hộ", sl: 2, tinh_trang: "Sẵn sàng" },
    ],
    3: [
      { ten: "Xe chữa cháy nước", sl: 3, tinh_trang: "Sẵn sàng" },
      { ten: "Máy bơm khiêng tay", sl: 6, tinh_trang: "Sẵn sàng" },
    ],
  });

  const centerPosition = [10.89438, 106.393177];
  const [showBoundary, setShowBoundary] = useState(true);

  const mapLayers = {
    street: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors",
      label: "Giao thông",
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri",
      label: "Vệ tinh",
    },
  };
  const [mapType, setMapType] = useState("street");

  const [streetViewOpen, setStreetViewOpen] = useState(false);
  const [streetViewCoords, setStreetViewCoords] = useState(null);
  const [streetViewName, setStreetViewName] = useState("");
  const getStreetViewUrl = (lat, lng) =>
    `https://www.google.com/maps?q=&layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0&output=svembed`;

  const [teamQuery, setTeamQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const totalStations = stations.length;
  const countsByType = stations.reduce((acc, s) => {
    const k = s.loai || "Khác";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  // derive available categories from inventory (supports chung_loai__maso when present)
  const categoryEntries = (() => {
    const m = new Map();
    Object.values(inventory)
      .flat()
      .forEach((item) => {
        const key = item.chung_loai__maso ?? item.ten;
        const label = item.chung_loai__maso
          ? `${item.chung_loai__maso} — ${item.ten}`
          : item.ten;
        if (key && !m.has(key)) m.set(key, label);
      });
    return Array.from(m.entries());
  })();

  const filteredStations = stations.filter((s) => {
    if (
      teamQuery &&
      !(s.ten || "").toLowerCase().includes(teamQuery.toLowerCase())
    )
      return false;
    if (selectedCategory) {
      const inv = inventory[s.id] ?? [];
      return inv.some(
        (item) => (item.chung_loai__maso ?? item.ten) === selectedCategory
      );
    }
    return true;
  });

  const totalVehicles = Object.values(inventory)
    .flat()
    .reduce((sum, item) => sum + (item.sl ?? item.totals ?? 0), 0);

  return (
    <Box sx={{ minHeight: "80vh" }}>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: "bold", color: "#1a237e" }}
      >
        HỆ THỐNG TRỰC QUAN HÓA THỰC LỰC PHƯƠNG TIỆN PCCC VÀ CNCH
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Stack width="30%" className="dashboard" spacing={2} sx={{ pr: 1 }}>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <Typography variant="h6">Bảng điều khiển</Typography>
            <Typography variant="body2">
              Tổng trạm: <strong>{totalStations}</strong>
            </Typography>
            <Typography variant="body2">
              Tổng phương tiện: <strong>{totalVehicles}</strong>
            </Typography>

            <Box sx={{ mt: 1 }}>
              <TextField
                size="small"
                fullWidth
                label="Tìm tên đội"
                value={teamQuery}
                onChange={(e) => setTeamQuery(e.target.value)}
              />
            </Box>

            <Box sx={{ mt: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="cat-select-label">Chủng loại</InputLabel>
                <Select
                  labelId="cat-select-label"
                  value={selectedCategory}
                  label="Chủng loại"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {categoryEntries.map(([key, label]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 1, mt: 1 }}>
            <Typography variant="subtitle2">Theo loại</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              {Object.entries(countsByType).map(([k, v]) => (
                <Chip key={k} label={`${k} (${v})`} size="small" />
              ))}
            </Stack>
          </Paper>

          <Divider />

          <Typography variant="subtitle2">
            Trạm nổi bật ({filteredStations.length})
          </Typography>
          <List dense sx={{ maxHeight: 240, overflow: "auto" }}>
            {filteredStations.slice(0, 6).map((st) => (
              <ListItem key={st.id} disableGutters sx={{ py: 0.5 }}>
                <ListItemText primary={st.ten} secondary={st.loai} />
              </ListItem>
            ))}
          </List>
        </Stack>

        <Paper
          elevation={4}
          sx={{
            height: "550px",
            width: "70%",
            borderRadius: 3,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Toggle control (overlay) */}
          <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 1000 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={
                  showBoundary
                    ? "Ẩn ranh giới Tây Ninh"
                    : "Hiện ranh giới Tây Ninh"
                }
                onClick={() => setShowBoundary(!showBoundary)}
                color="secondary"
                size="small"
              />
              <Stack direction="row" spacing={0.5} alignItems="center">
                {Object.keys(mapLayers).map((k) => (
                  <Chip
                    key={k}
                    label={mapLayers[k].label}
                    size="small"
                    color={mapType === k ? "primary" : "default"}
                    variant={mapType === k ? "filled" : "outlined"}
                    onClick={() => setMapType(k)}
                  />
                ))}
              </Stack>
            </Stack>
          </Box>
          <MapContainer
            center={centerPosition}
            zoom={9}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            <TileLayer
              attribution={mapLayers[mapType].attribution}
              url={mapLayers[mapType].url}
            />

            {showBoundary && (
              <GeoJSON
                data={tayNinhGeoJson}
                style={boundaryStyle}
                onEachFeature={onBoundaryEachFeature}
              />
            )}

            {stations.map((st) => (
              <Marker
                key={st.id}
                position={[st.latitude || 10.559129, st.longitude || 106.39253]}
                icon={fireIcon}
              >
                <Popup maxWidth={320}>
                  <Box sx={{ p: 1 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", color: "#d32f2f" }}
                      >
                        {st.ten}
                      </Typography>
                      <Chip
                        label={st.loai}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.6rem" }}
                      />
                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", color: "#666" }}
                    >
                      THỰC LỰC CHI TIẾT:
                    </Typography>

                    <List dense>
                      {inventory[st.id]?.map((item, index) => (
                        <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {item.ten}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  x{item.sl}
                                </Typography>
                              </Stack>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                color={
                                  item.tinh_trang === "Sẵn sàng"
                                    ? "success.main"
                                    : "error.main"
                                }
                              >
                                ● {item.tinh_trang}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ my: 1 }} />
                    <Typography
                      variant="caption"
                      sx={{ fontStyle: "italic", color: "#888" }}
                    >
                      Cập nhật lần cuối: {new Date().toLocaleTimeString()}
                      <Dialog
                        open={streetViewOpen}
                        onClose={() => setStreetViewOpen(false)}
                        maxWidth="lg"
                        fullWidth
                      >
                        <DialogTitle sx={{ m: 0, p: 2 }}>
                          {streetViewName}
                          <IconButton
                            aria-label="close"
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
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          setStreetViewCoords([st.latitude, st.longitude]);
                          setStreetViewName(st.ten || "Street View");
                          setStreetViewOpen(true);
                        }}
                      >
                        Xem toàn cảnh
                      </Button>
                    </Stack>
                  </Box>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Paper>
      </Stack>
    </Box>
  );
};

export default GisMap;
