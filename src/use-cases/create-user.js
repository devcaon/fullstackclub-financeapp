import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { PostgresCreateUserRepository, PostgresGetUserByEmailRepository } from '../repositories/postgres/index.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class CreateUserUseCase {
    async execute(createUserParams) {
        const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
        const userWithProvidedEmail = await getUserByEmailRepository.execute(
            createUserParams.email,
        )

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        // generate user id
        const userID = uuidv4()

        // encrypt password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(createUserParams.password, salt)

        // insert user into database
        const user = {
            ...createUserParams,
            id: userID,
            password: hashedPassword,
        }

        // call repository
        const postgresCreateUserRepository = new PostgresCreateUserRepository()

        const createdUser = await postgresCreateUserRepository.execute(user)

        return createdUser
    }
}
