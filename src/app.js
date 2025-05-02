const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const prisma = require('@prisma/client');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Importar rutas
const accidentRoutes = require('./routes/accidentRoutes');
const qualityRoutes = require('./routes/qualityRoutes');
// ... otras rutas

// Usar rutas
app.use('/api/accidents', accidentRoutes);
app.use('/api/quality', qualityRoutes);
// ... otras rutas

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  const prismaClient = new prisma.PrismaClient();
  prismaClient.$connect().then(() => {
    console.log('Database connected');
  });
});