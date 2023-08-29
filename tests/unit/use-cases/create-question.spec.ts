import { CreateQuestionUseCase } from '@/domain/forum/application/uses-cases/create-question'
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('shloud be able to create an question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      title: 'Question Title',
      content: 'Question Content',
    })

    expect(question.id).toBeTruthy()
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(question.id)
  })
})
