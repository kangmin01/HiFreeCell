import express from "express";

const app = express();

const PORT = 4000;

const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT}`);

app.listen(4000, handleListening);
