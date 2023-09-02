import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/uses-cases/choose-question-best-answer'
import { makeAnswer } from 'tests/factories/make-answer'
import { makeQuestion } from 'tests/factories/make-question'
import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()

    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionRepository,
      inMemoryAnswersRepository,
    )
  })

  it('should be able to choose the question best answer', async () => {
    const question = makeQuestion()

    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })

    expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to to choose another user question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    })

    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    expect(() => {
      return sut.execute({
        answerId: answer.id.toString(),
        authorId: 'author-2',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
