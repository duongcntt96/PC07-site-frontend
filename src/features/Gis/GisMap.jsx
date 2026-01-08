import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Paper } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Gis.css';

// Sửa lỗi hiển thị Marker Icon mặc định
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const GisMap = () => {
  const centerPosition = [10.762622, 106.660172];

  return (
    <Paper elevation={3} sx={{ p: 0, height: '800px', width: '100%', borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd' }}>
      <MapContainer
        center={centerPosition}
        zoom={14}
        scrollWheelZoom={true}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={centerPosition}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </Paper>
  );
};

export default GisMap;
