import { expect, test } from 'vitest'
import { AnswerQuestionUseCase } from '@/domain/uses-cases/answer-question'
import { AnswersRepository } from '@/domain/repositories/answers-repository'
import { Answer } from '@/domain/entities/answer'

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {
    console.log(answer)
  },
}

test('create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)

  const answer = await answerQuestion.execute({
    questionId: '1',
    instructorId: '1',
    content: 'New answer',
  })

  expect(answer.content).toEqual('New answer')
})
