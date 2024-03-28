import { UserNotFoundError } from "../../errors/user.js"

export class GetTransactionsByUserIdUseCase {

  constructor(getTransactionByUserIdRepository, getUserByIdRepository) {
    this.getTransactionByUserIdRepository = getTransactionByUserIdRepository
    this.getUserByIdRepository = getUserByIdRepository
  }

  async execute(params) {

    const user = await this.getUserByIdRepository.execute(params.userId)

    if (!user) {
      throw new UserNotFoundError(params.userId)
    }

    // Chamar o repository
    const transactions = await this.getTransactionByUserIdRepository.execute(params.userId)

    return transactions
  }
}