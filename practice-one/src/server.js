import express from "express";

const PORT = 3000;
const app = express();

app.get("/", (req, res) => res.json({ status: "Dragon-ball API" }));
app.listen(PORT, () => console.log(`Dragon-ball API - Port ${PORT}`));
