import validator from 'validator';
import { badRequest, ok, serverError } from './helpers.js';
import { UpdateUserUseCase } from '../use-cases/update-user.js';
import { EmailAlreadyInUseError } from '../errors/user.js';

export class UpdateUserController {
  async execute(httpRequest) {

    try {
      const userId = httpRequest.params.userId;

      // Validar ID
      const isIdValid = validator.isUUID(userId)

      if (!isIdValid) {
        return badRequest({
          message: 'The  provided ID is not valid.'
        })
      }

      const updateUserParams = httpRequest.body;

      // Validar campos recebidos
      const allowedFields = ['first_name', 'last_name', 'email', 'password']

      const someFieldsIsNotAllowed = Object.keys(updateUserParams).some((field) => !allowedFields.includes(field))

      if (someFieldsIsNotAllowed) {
        return badRequest({ message: 'Some provided field is not allowed.' })
      }

      // Validar senha caso esteja sendo alterada
      if (updateUserParams.password) {
        const passwordIsNotValid = updateUserParams.password.length < 6

        if (passwordIsNotValid) {
          return badRequest({
            message: 'Password must be at least 6 characters.'
          })
        }
      }

      // validar e-mail
      if (updateUserParams.email) {
        const emailIsValid = validator.isEmail(updateUserParams.email)

        if (!emailIsValid) {
          return badRequest({
            message: 'Invalid e-mail. Please provide a valid one.'
          })
        }
      }

      // chamar use case
      const updateUserUseCase = new UpdateUserUseCase()
      const updateUser = await updateUserUseCase.execute(userId, updateUserParams)

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