const express = require("express");
const rutas = require("./routes");
const { initDB } = require("./setupDB");

const app = express();
app.use(express.json());
app.use("/materiales", rutas);

initDB();

const PORT = 5003;
app.listen(PORT, () => {
  console.log(`Materiales-service activo en puerto ${PORT}`);
});
