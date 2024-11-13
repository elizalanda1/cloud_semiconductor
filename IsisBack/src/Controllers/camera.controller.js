// src/controllers/camera.controller.js

import { createRequire } from 'module';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Configurar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar fluent-ffmpeg usando createRequire
const require = createRequire(import.meta.url);
const ffmpeg = require('fluent-ffmpeg');

// Configurar la ruta de FFmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Controlador para transmitir video en formato MJPEG
export const streamVideo = (req, res) => {
  try {
    // Establecer encabezados para una transmisión MJPEG
    res.writeHead(200, {
      'Content-Type': 'multipart/x-mixed-replace; boundary=frame',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.flushHeaders(); // Forzar el envío inmediato de los encabezados

    // Configurar el comando FFmpeg
    const ffmpegCommand = ffmpeg()
      .input('0') // Índice del dispositivo de la cámara (ajusta según sea necesario)
      .inputFormat('avfoundation') // Formato de entrada para macOS
      .inputOptions(['-framerate', '30']) // Framerate exacto
      .videoCodec('mjpeg') // Codec de video MJPEG
      .size('640x480') // Resolución soportada
      .format('mjpeg')
      .on('start', () => {
        console.log('FFmpeg iniciado para la transmisión MJPEG');
      })
      .on('codecData', (data) => {
        console.log('Codec Data:', data);
      })
      .on('error', (err) => {
        console.error('Error de FFmpeg:', err.message);
        res.end();
      })
      .on('end', () => {
        console.log('FFmpeg finalizó la transmisión MJPEG');
        res.end();
      });

    // Iniciar la transmisión y pipe al response
    const stream = ffmpegCommand.pipe();

    // Manejar cada chunk de datos emitido por FFmpeg
    stream.on('data', (chunk) => {
      // Escribir las delimitaciones multipart y las cabeceras por cada frame
      res.write(`--frame\r\nContent-Type: image/jpeg\r\nContent-Length: ${chunk.length}\r\n\r\n`);
      res.write(chunk);
      res.write('\r\n');
    });

    // Manejar el final de la transmisión
    stream.on('end', () => {
      res.end();
    });

  } catch (error) {
    console.error('Error al transmitir el video:', error);
    res.status(500).send('Error al transmitir el video');
  }
};
