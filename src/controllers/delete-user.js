import { DeleteUserUseCase } from "../use-cases/index.js"
import { checkIfIdIsValid, invalidIdResponse, notFound, ok, serverError, userNotFoundResponse } from "./helpers/index.js"

export class DeleteUserController {
  async execute(httpRequest) {
    try {

      const userId = httpRequest.params.userId

      // validar Id
      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      // instanciar use case
      const deletUseCase = new DeleteUserUseCase()
      const deleteUser = await deletUseCase.execute(userId)

      if (!deleteUser) {
        return userNotFoundResponse()
      }

      return ok(deleteUser)

    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}