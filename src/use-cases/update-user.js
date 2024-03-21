import { EmailAlreadyInUseError } from '../errors/user.js'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'
import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user.js'
import bcrypt from 'bcrypt'

export class UpdateUserUseCase {
  async execute(userId, updateUserParams) {
    // 1. se o email estiver sendo atualizado verificar se ele ja está em uso

    if (updateUserParams.email) {
      const getUserByEmailRepository =
        new PostgresGetUserByEmailRepository()
      const userWithProvidedEmail = getUserByEmailRepository.execute(
        updateUserParams.email,
      )

      if (userWithProvidedEmail) {
        throw new EmailAlreadyInUseError(updateUserParams.email)
      }
    }

    const user = { ...updateUserParams }

    // 2. se a senha estiver sendo atualizada criptografá-la
    if (updateUserParams.password) {
      // encrypt password
      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(
        updateUserParams.password,
        salt,
      )

      user.password = hashedPassword
    }

    // 3. chamar o repository para atualizar o usuário
    const postgresUpdateUserRepository = new PostgresUpdateUserRepository()

    const updateUser = await postgresUpdateUserRepository(userId, user)

    return updateUser
  }
}