import { PostgresGetUserByIdRepository } from "../repositories/postgres/get-user-by-id.js"

export class GetUserByIdUseCase {
  async execute(userId) {
    // criar instancia do repositório
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const user = await getUserByIdRepository.execute(userId)

    return user
  }
} 