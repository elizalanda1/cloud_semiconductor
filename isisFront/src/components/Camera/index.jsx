// src/components/CameraFeed.jsx

import React, { useEffect, useState } from 'react';
import { getVideoFeedUrl } from '../../services/Flask';
import './index.css';

const CameraFeed = () => {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    // Obtén la URL del flujo de video desde el servicio
    const url = getVideoFeedUrl();
    setVideoUrl(url);
  }, []);

  return (
    <div className="camera-feed">
      <img
        src={videoUrl}
        alt="Transmisión de la cámara en tiempo real"
        className="camera-video"
        style={{ width: '640px', height: '480px' }}
      />
    </div>
  );
};

export default CameraFeed;
