import { db } from "@/db";
import {
  quizzes,
  questions as dbQuestions,
  answers as dbAnswers,
} from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";

type Quizz = InferInsertModel<typeof quizzes>;
type Question = InferInsertModel<typeof dbQuestions>;
type Answer = InferInsertModel<typeof dbAnswers>;

interface SaveQuizzData extends Quizz {
  questions: Array<Question & { answers?: Answer[] }>;
}

export default async function saveToDb(quizzData: SaveQuizzData) {
  const { name, description, questions } = quizzData;
  const generatedQuizz = await db
    .insert(quizzes)
    .values({ name, description })
    .returning({ insertedId: quizzes.id });
  const quizzId = generatedQuizz[0].insertedId;

  await db.transaction(async (tx) => {
    for (const question of questions) {
      const [{ questionId }] = await tx
        .insert(dbQuestions)
        .values({ questionText: question.questionText, quizzId })
        .returning({ questionId: dbQuestions.id });
      if (question.answers && question.answers.length > 0) {
        await tx
          .insert(dbAnswers)
          .values(
            question.answers.map((answer) => ({
              answerText: answer.answerText,
              questionId,
              isCorrect: answer.isCorrect,
            }))
          );
      }
    }
  });

  return { quizzId };
}
