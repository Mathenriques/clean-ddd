import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from '@/domain/forum/application/uses-cases/edit-answer'
import { makeAnswer } from 'tests/factories/make-answer'
import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })

  it('shloud be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-1'),
    )
    inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
      content: 'content-1',
    })

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'content-1',
    })
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    expect(() => {
      return sut.execute({
        answerId: newAnswer.id.toString(),
        authorId: 'author-2',
        content: 'content-1',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to edit a answer that not exists', async () => {
    expect(() => {
      return sut.execute({
        answerId: 'answer-id',
        authorId: 'author-2',
        content: 'content-1',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
