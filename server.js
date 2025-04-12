// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB (cambia la URL por la tuya de MongoDB Atlas si quieres)
mongoose.connect('mongodb://localhost:27017/votaciones', {
useNewUrlParser: true,
useUnifiedTopology: true,
});

// Modelo de voto
const Vote = mongoose.model('Vote', {
userId: String, // puedes usar email, IP o ID generado por frontend
movieId: String,
rating: Number,
});

// Ruta para enviar un voto
app.post('/vote', async (req, res) => {
const { userId, movieId, rating } = req.body;

let existing = await Vote.findOne({ userId, movieId });

if (existing) {
existing.rating = rating;
await existing.save();
} else {
const vote = new Vote({ userId, movieId, rating });
await vote.save();
}

res.json({ success: true });
});

// Ruta para obtener la media
app.get('/average/:movieId', async (req, res) => {
const { movieId } = req.params;
const votes = await Vote.find({ movieId });

if (votes.length === 0) {
return res.json({ average: 0 });
}

const sum = votes.reduce((acc, v) => acc + v.rating, 0);
const avg = sum / votes.length;

res.json({ average: avg.toFixed(2), count: votes.length });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
