
import { EmailAlreadyInUseError } from '../errors/user.js';
import {
  checkIfEmailIsValid,
  checkIfIdIsValid,
  checkIfPasswordIsValid,
  emailIsAlreadyInUseResponse,
  invalidIdResponse,
  invalidPasswordResponse,
  badRequest,
  ok,
  serverError
} from './helpers/index.js';

export class UpdateUserController {

  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase
  }

  async execute(httpRequest) {

    try {
      const userId = httpRequest.params.userId;

      // Validar ID
      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      const params = httpRequest.body;

      // Validar campos recebidos
      const allowedFields = ['first_name', 'last_name', 'email', 'password']

      const someFieldsIsNotAllowed = Object.keys(params).some((field) => !allowedFields.includes(field))

      if (someFieldsIsNotAllowed) {
        return badRequest({ message: 'Some provided field is not allowed.' })
      }

      // Validar senha caso esteja sendo alterada
      if (params.password) {
        const passwordIsValid = checkIfPasswordIsValid(params.password)

        if (!passwordIsValid) {
          return invalidPasswordResponse()
        }
      }

      // validar e-mail
      if (params.email) {
        const emailIsValid = checkIfEmailIsValid(params.email)

        if (!emailIsValid) {
          return emailIsAlreadyInUseResponse()
        }
      }

      // chamar use case
      const updateUser = await this.updateUserUseCase.execute(userId, params)

      return ok(updateUser)

    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message })
      }

      console.error(error)
      return serverError()
    }

  }
}