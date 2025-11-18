const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas peticiones desde esta IP'
});

app.use('/api/', apiLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const authRoutes = require('../backend/routes/auth.routes');
const autosRoutes = require('../backend/routes/autos.routes');
const clientesRoutes = require('../backend/routes/clientes.routes');
const pagosRoutes = require('../backend/routes/pagos.routes');
const dashboardRoutes = require('../backend/routes/dashboard.routes');

app.use('/api/auth', authRoutes);
app.use('/api/autos', autosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'RV Automoviles API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'API RV Automoviles',
    version: '1.0.0'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Error interno del servidor',
    code: err.code || 'INTERNAL_ERROR'
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path
  });
});

module.exports = app;
