import { auth } from "@/auth";
import { db } from "@/db";
import { questions, quizzes, quizzSubmissions, users } from "@/db/schema";
import { avg, count, eq } from "drizzle-orm";

import React from "react";

const getUserMetrics = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return;

  const quizzesAmount = await db
    .select({ value: count() })
    .from(quizzes)
    .where(eq(quizzes.userId, userId));

  const questionsAmount = await db
    .select({ value: count() })
    .from(questions)
    .innerJoin(quizzes, eq(questions.quizzId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(quizzes.userId, userId));

  const submissionsAmount = await db
    .select({ value: count() })
    .from(quizzSubmissions)
    .innerJoin(quizzes, eq(quizzSubmissions.quizzId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(quizzes.userId, userId));

  const averageScore = await db
    .select({ value: avg(quizzSubmissions.score) })
    .from(quizzSubmissions)
    .innerJoin(quizzes, eq(quizzSubmissions.quizzId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(quizzes.userId, userId));

  return [
    { label: "# of Quizzes", value: quizzesAmount[0].value },
    { label: "# of Questions", value: questionsAmount[0].value },
    { label: "# of Submissions", value: submissionsAmount[0].value },
    { label: "Average Score", value: averageScore[0].value ?? 0 },
  ];
};

export default getUserMetrics;
