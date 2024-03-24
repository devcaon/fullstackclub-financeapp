import { EmailAlreadyInUseError } from '../errors/user.js'
import bcrypt from 'bcrypt'

export class UpdateUserUseCase {

  constructor(getUserByEmailRepository, updateUserRepository) {
    this.getUserByEmailRepository = getUserByEmailRepository
    this.updateUserRepository = updateUserRepository
  }

  async execute(userId, updateUserParams) {
    // 1. se o email estiver sendo atualizado verificar se ele ja está em uso

    if (updateUserParams.email) {

      const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
        updateUserParams.email,
      )

      if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
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

    const updateUser = await this.updateUserRepository.execute(userId, user)

    return updateUser
  }
}