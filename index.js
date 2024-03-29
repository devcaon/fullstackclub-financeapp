import "dotenv/config.js"
import express from 'express';
import { makeCreateUserController, makeDeleteUserController, makeGetUserByIdController, makeUpdateUserController } from "./src/factories/controllers/user.js";
import { makeCreateTransactionController, makeGetTransactionsByUserIdController } from "./src/factories/controllers/transaction.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;


// GET USER BY ID
app.get("/api/users/:userId", async (request, response) => {

  const getUserByIdController = makeGetUserByIdController()

  const { statusCode, body } = await getUserByIdController.execute(request)

  response.status(statusCode).send(body)
})

// CREATE USER
app.post("/api/users", async (request, response) => {

  const createUserController = makeCreateUserController()

  const { statusCode, body } = await createUserController.execute(request)

  response.status(statusCode).send(body)
})

// UPDATE USER
app.patch("/api/users/:userId", async (request, response) => {

  const updateUserController = makeUpdateUserController()

  const { statusCode, body } = await updateUserController.execute(request)

  response.status(statusCode).send(body)
})


// DELETE USER
app.delete("/api/users/:userId", async (request, response) => {

  const deleteUserController = makeDeleteUserController()

  const { statusCode, body } = await deleteUserController.execute(request)

  response.status(statusCode).send(body)
})

// Transaction routes
// CREATE TRANSACTIONS
app.post("/api/transactions", async (request, response) => {
  const createTransactionController = makeCreateTransactionController()

  const { statusCode, body } = await createTransactionController.execute(request)

  response.status(statusCode).send(body)

})

// GET TRANSACTIONS BY USER ID
app.get("/api/transactions", async (request, response) => {

  const getTransactionsByUserIdController = makeGetTransactionsByUserIdController()

  const { statusCode, body } = await getTransactionsByUserIdController.execute(request)

  response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () => console.log(`Listening on port ${PORT}`))