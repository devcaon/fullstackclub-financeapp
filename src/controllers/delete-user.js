import { DeleteUserUseCase } from "./helpers/index.js"
import { ok } from "./index.js"
import { checkIfIdIsValid, serverError, invalidIdResponse } from "./index.js"

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

      return ok(deleteUser)

    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}