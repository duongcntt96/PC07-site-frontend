import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, GeoJSON } from 'react-leaflet';
import { Paper, Typography, Box, Divider, Chip, Stack, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { tayNinhGeoJson } from './TayNinhGeojson';
import qlptApi from 'api/qlptApi';
import { treeToList } from 'utils/DWUtils';
import { treeOptionsConvert } from 'utils/DWUtils';

// 1. Tạo Icon chuyên ngành PCCC
const fireIcon = new L.Icon({
  iconUrl: 'https://pccctayninh.vercel.app/static/media/logo.c0754a2a13ea1e935658.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const boundaryStyle = {
  color: '#d32f2f',
  weight: 3,
  opacity: 0.9,
  fillOpacity: 0
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
            latitude: n.latitude ?? n.lat ?? n.lat_gps ?? (n.location && n.location.lat) ?? null,
            longitude: n.longitude ?? n.lng ?? n.lon ?? (n.location && n.location.lng) ?? null,
          }))
          .filter((n) => n.latitude != null && n.longitude != null);
        setStations(normalized);

        // Inventories will be loaded on demand when user selects a station (marker click / popup open).
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };
    fetchStations();
  }, []);

  // inventoryMap: { [khoId]: Array<thuclucItem> }
  const [inventoryMap, setInventoryMap] = useState({});

  const centerPosition = [10.894380, 106.393177];
  const [showBoundary, setShowBoundary] = useState(true);

  const mapLayers = {
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      label: 'Giao thông'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri',
      label: 'Vệ tinh'
    },
  };
  const [mapType, setMapType] = useState('street');

  const [streetViewOpen, setStreetViewOpen] = useState(false);
  const [streetViewCoords, setStreetViewCoords] = useState(null);
  const [streetViewName, setStreetViewName] = useState('');
  const getStreetViewUrl = (lat, lng) => `https://www.google.com/maps?q=&layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0&output=svembed`;

  const fetchInventoryForStation = async (khoId) => {
    if (khoId == null) return;
    // Do nothing if already loading or loaded
    if (Object.prototype.hasOwnProperty.call(inventoryMap, khoId)) return;
    // mark loading
    setInventoryMap(prev => ({ ...prev, [khoId]: null }));
    try {
      const resp = await qlptApi.getThucluc({ kho_nhap: khoId });
      const items = Array.isArray(resp?.data) ? resp.data : (Array.isArray(resp?.data?.data) ? resp.data.data : []);
      setInventoryMap(prev => ({ ...prev, [khoId]: items }));
    } catch (e) {
      console.error('Error fetching inventory for station', khoId, e);
      setInventoryMap(prev => ({ ...prev, [khoId]: [] }));
    }
  }; 

  return (
    <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#1a237e' }}>
        HỆ THỐNG TRỰC QUAN HÓA THỰC LỰC PHƯƠNG TIỆN PCCC VÀ CNCH
      </Typography>

      <Paper elevation={4} sx={{ height: '750px', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
        {/* Toggle control (overlay) */}
        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1000 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={showBoundary ? 'Ẩn ranh giới Tây Ninh' : 'Hiện ranh giới Tây Ninh'}
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
                  color={mapType === k ? 'primary' : 'default'}
                  variant={mapType === k ? 'filled' : 'outlined'}
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
            <GeoJSON data={tayNinhGeoJson} style={boundaryStyle} onEachFeature={onBoundaryEachFeature} />
          )}

          {stations.map((st) => (
            <Marker key={st.id} position={[st.latitude||10.559129, st.longitude||106.392530]} icon={fireIcon} eventHandlers={{ click: () => fetchInventoryForStation(st.id) }}>
              <Popup maxWidth={320}>
                <Box sx={{ p: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                      {st.ten}
                    </Typography>
                    <Chip label={st.loai} size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.6rem' }} />
                  </Stack>
                  
                  <Divider sx={{ my: 1 }} />

                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666' }}>
                    THỰC LỰC CHI TIẾT:
                  </Typography>

                  <List dense>
                    {inventoryMap[st.id] === null ? (
                      <ListItem key={`loading-${st.id}`} disableGutters sx={{ py: 0.5 }}>
                        <ListItemText primary={<Typography variant="body2">Đang tải...</Typography>} />
                      </ListItem>
                    ) : inventoryMap[st.id] === undefined ? (
                      <ListItem key={`notloaded-${st.id}`} disableGutters sx={{ py: 0.5 }}>
                        <Button size="small" variant="outlined" onClick={() => fetchInventoryForStation(st.id)}>Tải</Button>
                      </ListItem>
                    ) : inventoryMap[st.id].length === 0 ? (
                      <ListItem key={`empty-${st.id}`} disableGutters sx={{ py: 0.5 }}>
                        <ListItemText primary={<Typography variant="body2">Không có dữ liệu</Typography>} />
                      </ListItem>
                    ) : (
                      inventoryMap[st.id].map((item, index) => (
                        <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.ten}</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>x{item.totals ?? item.sl ?? 1}</Typography>
                              </Stack>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                { (item.nhap_totals != null || item.xuat_totals != null) ? `Nhập: ${item.nhap_totals ?? 0} • Xuất: ${item.xuat_totals ?? 0}` : (item.tinh_trang ? `● ${item.tinh_trang}` : '') }
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))
                    )}
                  </List>

                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#888' }}>
                    Cập nhật lần cuối: {new Date().toLocaleTimeString()}

        <Dialog open={streetViewOpen} onClose={() => setStreetViewOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {streetViewName}
            <IconButton aria-label="close" onClick={() => setStreetViewOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ width: '100%', height: 500 }}>
              {streetViewCoords && (
                <iframe
                  title="Street View"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={getStreetViewUrl(streetViewCoords[0], streetViewCoords[1])}
                  allowFullScreen
                />
              )}
            </Box>
          </DialogContent>
        </Dialog>

                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button size="small" variant="contained" onClick={() => { setStreetViewCoords([st.latitude, st.longitude]); setStreetViewName(st.ten || 'Street View'); setStreetViewOpen(true); }}>
                      Xem toàn cảnh
                    </Button>
                  </Stack>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Paper>
    </Box>
  );
};

export default GisMap;