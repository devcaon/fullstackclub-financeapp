import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class CreateUserUseCase {
    constructor(getUserByEmailRepository, createUserRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.createUserRepository = createUserRepository
    }

    async execute(createUserParams) {
        const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
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


        const createdUser = await this.createUserRepository.execute(user)

        return createdUser
    }
}
