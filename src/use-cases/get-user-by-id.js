import { PostgresGetUserByIdRepository } from "../repositories/postgres/index.js"

export class GetUserByIdUseCase {
  async execute(userId) {
    // criar instancia do repositório
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const user = await getUserByIdRepository.execute(userId)

    return user
  }
} 