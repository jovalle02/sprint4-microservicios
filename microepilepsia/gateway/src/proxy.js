const express = require("express");
const axios = require("axios");

const AUTH = "http://auth-servicio:8000";
const PACIENTE = "http://paciente-servicio:8001";
const MRI = "http://mri-service:5004";
const MATERIALES = "http://materiales-service:5003";



async function verificarToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const r = await axios.get(`${AUTH}/validate/`, {
      headers: { Authorization: token },
    });
    if (r.data.valid) {
      req.user = r.data;
      next();
    } else {
      throw new Error();
    }
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = function (app) {
  app.use(express.json());

  // login sin validación
  app.post("/api/acceso", async (req, res) => {
    try {
      console.log({access_key: req.body.access_key});
      const r = await axios.post(`${AUTH}/key-auth/`, {access_key: req.body.access_key});
      res.json(r.data);
    } catch (e) {
      console.error("Error en /api/acceso:", e.response?.data || e.message);
      res.status(401).json({ error: "Acceso denegado" });
    }
  });

  // nuevo paciente
  app.post("/api/pacientes/registrar", verificarToken, async (req, res) => {
    const r = await axios.post(`${PACIENTE}/api/pacientes/`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(r.data);
  });

  // lista de pacientes
  app.get("/api/pacientes/listar", verificarToken, async (req, res) => {
    const r = await axios.get(`${PACIENTE}/api/pacientes/`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(r.data);
  });

  // diagnóstico MRI
  app.post("/api/diagnosticos/mri", verificarToken, async (req, res) => {
    const r = await axios.post(`${MRI}/mri/diagnostico`, {}, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(r.data);
  });

  // asignar material
  app.get("/api/materiales/asignar", verificarToken, async (req, res) => {
    const r = await axios.get(`${MATERIALES}/materiales/disponible`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(r.data);
  });
};
