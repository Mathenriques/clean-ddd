import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from '@/domain/forum/application/uses-cases/edit-question'
import { makeQuestion } from 'tests/factories/make-question'
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('shloud be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-1'),
    )
    inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId.toString(),
      title: 'title-1',
      content: 'content-1',
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'title-1',
      content: 'content-1',
    })
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    expect(() => {
      return sut.execute({
        questionId: newQuestion.id.toString(),
        authorId: 'author-2',
        title: 'title-1',
        content: 'content-1',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to edit a question that not exists', async () => {
    expect(() => {
      return sut.execute({
        questionId: 'question-id',
        authorId: 'author-2',
        title: 'title-1',
        content: 'content-1',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
