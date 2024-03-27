const express = require("express");
const app = express();
const port = 5000;
const mongodb = require("./db");
const cors = require("cors");
const fileURLToPath = require("url");
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file

const __dirname = path.dirname(__filename); // get the name of the directory

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

mongodb();

app.use((req, res, next) => {
  res.setHeader("Access-Cantrol-Allow-Origin", "https://localhost:3000");
  res.header(
    "Acess-Cantrol-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors(corsOptions)); // Use this after the variable declaration
// app.use(cors());
// app.options('*', cors());
app.use(express.json());
app.use("/api", require("./Routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
