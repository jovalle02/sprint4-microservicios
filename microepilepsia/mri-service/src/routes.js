const express = require("express");
const jwt = require("jsonwebtoken");
const { db } = require("./setupDB");

const router = express.Router();
const SECRET = "clave-simulada"; // misma clave que auth-servicio

// Middleware para verificar JWT
router.use((req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.usuario = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token inválido" });
  }
});

// POST /mri/diagnostico
router.post("/diagnostico", (req, res) => {
  const resultado = Math.random() > 0.5 ? "lesión detectada" : "normal";
  const fecha = new Date().toISOString();

  db.prepare("INSERT INTO diagnosticos (resultado, timestamp) VALUES (?, ?)").run(resultado, fecha);

  res.json({ mensaje: "Diagnóstico realizado", resultado, fecha });
});

// GET /mri/historial
router.get("/historial", (req, res) => {
  const rows = db.prepare("SELECT * FROM diagnosticos ORDER BY id DESC").all();
  res.json(rows);
});

module.exports = router;
