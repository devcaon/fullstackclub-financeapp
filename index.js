import "dotenv/config.js"
import express from 'express';
import {
  CreateUserController,
  DeleteUserController,
  GetUserByIdController,
  UpdateUserController
} from './src/controllers/index.js';

import { CreateUserUseCase, DeleteUserUseCase, GetUserByIdUseCase, UpdateUserUseCase } from "./src/use-cases/index.js";
import { PostgresCreateUserRepository, PostgresDeleteUserRepository, PostgresGetUserByIdRepository, PostgresUpdateUserRepository } from "./src/repositories/postgres/index.js";
import { PostgresGetUserByEmailRepository } from './src/repositories/postgres/get-user-by-email.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;


// GET USER BY ID
app.get("/api/users/:userId", async (request, response) => {

  const getUserByIdRepository = new PostgresGetUserByIdRepository()

  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  const { statusCode, body } = await getUserByIdController.execute(request)

  response.status(statusCode).send(body)
})

// CREATE USER
app.post("/api/users", async (request, response) => {

  const createUserRepository = new PostgresCreateUserRepository()
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository()

  const createUserUseCase = new CreateUserUseCase(getUserByEmailRepository, createUserRepository)

  const createUserController = new CreateUserController(createUserUseCase)

  const { statusCode, body } = await createUserController.execute(request)

  return response.status(statusCode).json(body)
})

// UPDATE USER
app.patch("/api/users/:userId", async (request, response) => {

  const getUserByEmailRepository = new PostgresGetUserByEmailRepository()

  const updateUserRepository = new PostgresUpdateUserRepository()

  const updateUserUseCase = new UpdateUserUseCase(getUserByEmailRepository, updateUserRepository)

  const updateUserController = new UpdateUserController(updateUserUseCase)

  const { statusCode, body } = await updateUserController.execute(request)

  return response.status(statusCode).json(body)
})


// DELETE USER
app.delete("/api/users/:userId", async (request, response) => {

  const deleteUserRepository = new PostgresDeleteUserRepository()

  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)

  const deleteUserController = new DeleteUserController(deleteUserUseCase)

  const { statusCode, body } = await deleteUserController.execute(request)

  response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () => console.log(`Listening on port ${PORT}`))