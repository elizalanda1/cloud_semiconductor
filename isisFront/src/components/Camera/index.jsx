// src/components/CameraFeed.jsx

import React, { useEffect, useRef } from 'react';
import { fetchCameraStream } from '../../services/Api';
import './index.css';

const CameraFeed = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const startStream = async () => {
      try {
        const streamUrl = await fetchCameraStream();
        if (videoRef.current) {
          videoRef.current.src = streamUrl;
          videoRef.current.play().catch((error) => {
            console.error('Error al reproducir el video:', error);
          });
        }
      } catch (error) {
        console.error('Error al cargar el flujo de la cámara:', error);
      }
    };

    startStream();

    return () => {
      if (videoRef.current && videoRef.current.src) {
        URL.revokeObjectURL(videoRef.current.src);
      }
    };
  }, []);

  return (
    <div className="camera-feed">
      <h2>Transmisión de la Cámara en Tiempo Real</h2>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="camera-video"
        style={{ width: '640px', height: '480px' }}
      />
    </div>
  );
};

export default CameraFeed;
