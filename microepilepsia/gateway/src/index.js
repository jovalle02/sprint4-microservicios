const express = require("express");
const setupProxies = require("./proxy");
const cors = require("cors");

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

setupProxies(app);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`API Gateway corriendo en puerto ${PORT}`);
});
