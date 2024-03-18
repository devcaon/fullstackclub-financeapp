import { PostgresGetUserByIdRepository } from "../repositories/postgres/get-user-by-id.";

export class GetUserByIdUserUseCase {
  async execute(userId) {
    // criar instancia do repositório
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const user = await getUserByIdRepository.execute(userId)

    return user
  }
} 