import "dotenv/config.js"
import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT, () => console.log(`Listening on port ${PORT}`))