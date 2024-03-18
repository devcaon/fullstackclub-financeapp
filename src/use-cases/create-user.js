import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js';

export class CreateUserUseCase {
  async execute(createUserParams) {
    // TODO: check if email is already in use

    // generate user id
    const userID = uuidv4();

    // encrypt password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(createUserParams.password, salt);


    // insert user into database
    const user = {
      ...createUserParams,
      id: userID,
      password: hashedPassword,
    }

    // call repository
    const postgresCreateUserRepository = new PostgresCreateUserRepository()

    const createdUser = await postgresCreateUserRepository.execute(user)

    return createdUser;
  }
}