import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

export const verifyToken = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(403).json({ message: 'No se proporcionó el token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (user.role !== 'Admin') {
    return res.status(403).json({ message: 'Requiere rol de administrador' });
  }
  next();
};
