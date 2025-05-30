import React, { useState } from 'react';
import './App.css';

function App() {
  const [token, setToken] = useState("");
  const [logs, setLogs] = useState([]);
  const apiUrl = "http://gateway:8080";

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const log = (message, isError = false) => {
    setLogs((prev) => [...prev, { message, isError }]);
  };

  const clearLogs = () => setLogs([]);

  const fetchJson = async (url, options = {}, label = "") => {
    try {
      log(`[✓] ${label}...`);
      const res = await fetch(url, options);
      const data = await res.json();
      await delay(500);

      if (!res.ok) {
        if (data.error && data.error.toLowerCase().includes("token")) {
          log(`✗ Token inválido o expirado 🔐`, true);
          setToken(""); // limpia token
          throw new Error("Token inválido");
        }

        throw new Error(data.error || `Error en ${label}`);
      }

      return data;
    } catch (e) {
      log(`[✗] ${e.message}`, true);
      throw e;
    }
  };

  const autenticar = async () => {
    const clave = document.getElementById("clave").value;
    try {
      const res = await fetch(`${apiUrl}/api/acceso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_key: clave })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Clave inválida");
      }

      setToken(data.token);
      log(`[✓] Token recibido ✅`);
    } catch (e) {
      log(`✗ Clave inválida - acceso denegado ❌`, true);
      setToken("");
    }
  };

  const registrar = async () => {
    const nombre = document.getElementById("nombre").value;
    const edad = parseInt(document.getElementById("edad").value);
    const genero = document.getElementById("genero").value;

    const data = await fetchJson(`${apiUrl}/api/pacientes/registrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre, edad, genero }),
    }, "Registrando paciente");

    log(`[✓] Paciente creado con ID #${data.id}`);
  };

  const diagnosticar = async () => {
    const data = await fetchJson(`${apiUrl}/api/diagnosticos/mri`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }, "Solicitando diagnóstico MRI");

    log(`[✓] Resultado: ${data.resultado ? 'Positivo 🧠' : 'Negativo 👍'}`);
  };

  const asignar = async () => {
    const data = await fetchJson(`${apiUrl}/api/materiales/asignar`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }, "Asignando material disponible");

    log(`[✓] Material entregado: ${data.material.nombre}`);
  };

  const ejecutarFlujo = async () => {
    clearLogs();
    try {
      await autenticar();
      await registrar();
      await diagnosticar();
      await asignar();
      log("✅ Flujo completo finalizado");
    } catch (e) {
      log("⛔ Flujo detenido por error", true);
    }
  };

  return (
    <div className="container">
      <h2>🧪 Simulador Microservicios</h2>

      <div>
        <input id="clave" placeholder="Clave de acceso..." defaultValue="clave-secreta-super123" />
        <button onClick={autenticar}>🔐 Autenticarse</button>
        <button onClick={ejecutarFlujo}>🚀 Ejecutar Flujo Completo</button>
      </div>

      <h3>📝 Registrar Paciente</h3>
      <input id="nombre" placeholder="Nombre" />
      <input id="edad" type="number" placeholder="Edad" />
      <input id="genero" placeholder="Género" />
      <button onClick={registrar}>📋 Registrar</button>

      <h3>🧠 Diagnóstico MRI</h3>
      <button onClick={diagnosticar}>🔍 Diagnosticar</button>

      <h3>🎒 Asignar Material</h3>
      <button onClick={asignar}>🎁 Asignar</button>

      <div className="log-panel">
        {logs.map((entry, i) => (
          <div key={i} className={entry.isError ? "log-error" : ""}>{entry.message}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
