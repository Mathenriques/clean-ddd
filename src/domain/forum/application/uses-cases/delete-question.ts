import { QuestionsRepository } from '../repositories/question-repository'

interface DeleteQuestionUseCaseRequest {
  questionId: string
  authorId: string
}

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ questionId, authorId }: DeleteQuestionUseCaseRequest) {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question does not exists!')
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error('Not allowed.')
    }

    await this.questionsRepository.delete(question)

    return {}
  }
}
