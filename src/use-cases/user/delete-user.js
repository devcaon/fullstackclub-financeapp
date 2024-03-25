export class DeleteUserUseCase {

  constructor(deleteUserRepository) {
    this.deleteUserRepository = deleteUserRepository
  }

  async execute(userId) {
    const delUser = await this.deleteUserRepository.execute(userId)

    return delUser
  }
}