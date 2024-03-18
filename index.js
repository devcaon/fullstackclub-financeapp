import "dotenv/config.js"
import express from 'express';
import { CreateUserController } from './src/controllers/create-user.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post("/api/users", async (request, response) => {
  const createUserController = new CreateUserController()

  const { statusCode, body } = await createUserController.execute(request)

  return response.status(statusCode).json(body)
})

app.listen(process.env.PORT, () => console.log(`Listening on port ${PORT}`))