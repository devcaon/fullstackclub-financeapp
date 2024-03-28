import { checkIfAmountIsValid, checkIfIdIsValid, checkTypeIsValid, created, invalidAmountResponse, invalidIdResponse, invalidTypeResponse, requiredFieldIsMissingResponse, serverError, validateRequiredFields } from '../helpers/index.js'


export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      const requiredFields = [
        'user_id',
        'name',
        'date',
        'amount',
        'type'
      ]

      // validar campos obrigatórios
      const { ok: requiredFieldsWereProvided, missingField } = validateRequiredFields(params, requiredFields)

      if (!requiredFieldsWereProvided.ok) {
        return requiredFieldIsMissingResponse(missingField)
      }

      // validar id do usuário
      const userIdIsValid = checkIfIdIsValid(params.user_id)

      if (!userIdIsValid) {
        return invalidIdResponse()
      }

      const amountIsValid = checkIfAmountIsValid(params.amount)

      if (!amountIsValid) {
        return invalidAmountResponse()
      }

      const type = params.type.trim().toUpperCase()

      // Verificar se o type é válido
      const typeIsValid = checkTypeIsValid(type)

      if (!typeIsValid) {
        return invalidTypeResponse()
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