import validator from 'validator';
import { badRequest, ok, serverError } from './helpers/http.js';
import { UpdateUserUseCase } from '../use-cases/update-user.js';
import { EmailAlreadyInUseError } from '../errors/user.js';
import { checkIfEmailIsValid, checkIfPasswordIsValid, emailIsAlreadyInUseResponse, invalidIdResponse, invalidPasswordResponse } from './helpers/user.js';

export class UpdateUserController {

  async execute(httpRequest) {

    try {
      const userId = httpRequest.params.userId;

      // Validar ID
      const isIdValid = validator.isUUID(userId)

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
      const updateUserUseCase = new UpdateUserUseCase()
      const updateUser = await updateUserUseCase.execute(userId, params)

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