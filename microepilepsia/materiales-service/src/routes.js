const express = require("express");
const jwt = require("jsonwebtoken");
const { db } = require("./setupDB");

const SECRET = "clave-simulada";

const router = express.Router();

router.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.usuario = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
});

router.get("/", (req, res) => {
  const materiales = db.prepare("SELECT * FROM materiales").all();
  res.json(materiales);
});

router.get("/disponible", (req, res) => {
  const material = db.prepare("SELECT * FROM materiales WHERE disponible = 1 LIMIT 1").get();

  if (!material) {
    return res.status(404).json({ error: "No hay materiales disponibles" });
  }

  // Marcar como no disponible
  db.prepare("UPDATE materiales SET disponible = 0 WHERE id = ?").run(material.id);

  res.json({
    mensaje: "Material asignado",
    material
  });
});


module.exports = router;
