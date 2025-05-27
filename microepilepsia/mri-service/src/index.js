const express = require("express");
const rutas = require("./routes");
const { initDB } = require("./setupDB");

const app = express();
app.use(express.json());

initDB(); // crea la tabla si no existe
app.use("/mri", rutas);

const PORT = 5004;
app.listen(PORT, () => {
  console.log(`MRI-service corriendo en puerto ${PORT}`);
});
