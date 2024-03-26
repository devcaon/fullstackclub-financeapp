import validator from 'validator'
import { badRequest, checkIfIdIsValid, created, invalidIdResponse, serverError } from '../helpers'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      const requiredFields = [
        'id',
        'user_id',
        'name',
        'date',
        'amount',
        'type'
      ]

      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return badRequest({ message: `Missing param: ${field}` })
        }
      }

      // validar id do usuário

      const userIdIsValid = checkIfIdIsValid(params.user_id)

      if (!userIdIsValid) {
        return invalidIdResponse()
      }

      // verificar amount maior que 0 e duas casas decimais
      if (params.amount <= 0) {
        return badRequest({
          message: 'The amount must be greater than 0'
        })
      }

      const amountIsValid = validator.isCurrency(params.amouny.toString(), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.'
      })

      if (!amountIsValid) {
        return badRequest({
          message: 'The amount must be a valid currency.'
        })
      }
      const type = params.type.trim().toUpperCase()

      // Verificar se o type é válido
      const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)

      if (!typeIsValid) {
        return badRequest({
          message: 'The type must be EARNING, EXPENSE or INVESTMENT'
        })
      }

      const transaction = await this.createTransactionUseCase.execute({
        ...params,
        type
      })

      return created(transaction)

    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}