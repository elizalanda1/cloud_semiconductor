import React from 'react';
import './index.css';

const CameraFeed = ({ videoSource }) => {
  return (
    <div className="camera-feed">
      <video src={videoSource} autoPlay muted playsInline className="camera-video" />
    </div>
  );
};

export default CameraFeed;
