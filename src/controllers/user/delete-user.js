import { checkIfIdIsValid, invalidIdResponse, ok, serverError, userNotFoundResponse } from "../helpers/index.js"

export class DeleteUserController {
  constructor(deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase
  }

  async execute(httpRequest) {
    try {

      const userId = httpRequest.params.userId

      // validar Id
      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      const deleteUser = await this.deleteUserUseCase.execute(userId)

      if (!deleteUser) {
        return userNotFoundResponse()
      }

      return ok({ message: `User ${deleteUser.first_name} ${deleteUser.last_name} has been deleted successfully` })

    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}