"use client";

import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ui/progressBar";
import { ChevronLeft, X } from "lucide-react";
import { useState } from "react";
import ResultCard from "./ResultCard";
import QuizzSubmission from "./QuizzSubmission";
import { InferSelectModel } from "drizzle-orm";
import {
  answers as dbAnswers,
  questions as DbQuestions,
  quizzes,
} from "@/db/schema";
import { useRouter } from "next/navigation";
import { saveSubmission } from "../actions/saveSubmissions";

type Answer = InferSelectModel<typeof dbAnswers>;
type Question = InferSelectModel<typeof DbQuestions> & { answers: Answer[] };
type Quizz = InferSelectModel<typeof quizzes> & { questions: Question[] };

type Props = {
  quizz: Quizz;
};

export default function QuizzQuestions(props: Props) {
  const { questions } = props.quizz;
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<
    { questionId: number; answerId: number }[]
  >([]);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const { push } = useRouter();

  const handleNext = () => {
    if (!started) {
      setStarted(true);
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setSubmitted(true);
      return;
    }
  };

  const handleAnswer = (answer: Answer, questionId: number) => () => {
    const newUserAnswers = [
      ...userAnswers,
      {
        questionId,
        answerId: answer.id,
      },
    ];
    setUserAnswers(newUserAnswers);
    const isCurrentCorrect = answer.isCorrect;
    if (isCurrentCorrect) {
      setScore(score + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const subId = await saveSubmission({ score }, props.quizz.id);
    } catch (error) {
      console.error(error);
    }
    setSubmitted(true);
  };

  const handlePressPrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleExit = () => {
    push("/dashboard");
  };

  const scorePercentage = Math.round((score / questions.length) * 100);
  const selectedAnswer = userAnswers.find(
    ({ questionId }) => questionId === questions[currentQuestion].id
  )?.answerId;
  const isCorrectAnswer =
    questions[currentQuestion].answers.find(({ id }) => id === selectedAnswer)
      ?.isCorrect ?? null;

  if (submitted) {
    return (
      <QuizzSubmission
        score={score}
        scorePercentage={scorePercentage}
        totalQuestions={questions.length}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <header className="sticky top-0 z-10 shadow-md py-4 w-full">
        <div className="grid grid-cols-[auto,1fr,auto] grid-flow-col items-center justify-between py-2 gap-2">
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={handlePressPrev}
          >
            <ChevronLeft />
          </Button>
          <ProgressBar value={(currentQuestion / questions.length) * 100} />
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={handleExit}
          >
            <X />
          </Button>
        </div>
      </header>
      <main className="flex justify-center flex-1">
        {!started ? (
          <h1 className="text-3xl font-bold">Welcome Quizz👋</h1>
        ) : (
          <div>
            <h1 className="text-3xl font-bold">
              {questions[currentQuestion].questionText}
            </h1>
            <div className="grid grid-cols-1 gap-6 mt-6">
              {questions[currentQuestion].answers.map((answer) => {
                const isSelected = selectedAnswer === answer.id;
                const isCorrect = answer.isCorrect;
                const variant = isSelected
                  ? isCorrect
                    ? "neoSuccess"
                    : "neoDanger"
                  : "neoOutline";

                return (
                  <Button
                    key={answer.id}
                    disabled={!!selectedAnswer}
                    id={`${answer.id}`}
                    variant={variant}
                    size={"xl"}
                    onClick={handleAnswer(
                      answer,
                      questions[currentQuestion].id
                    )}
                    className="disabled:opacity-100"
                  >
                    {answer.answerText}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <footer className="footer pb-9 px-6 relative mb-0">
        <ResultCard
          correctAnswer={
            questions[currentQuestion].answers.find(
              ({ isCorrect }) => isCorrect === true
            )?.answerText || ""
          }
          isCorrect={isCorrectAnswer}
        />
        {currentQuestion === questions.length - 1 ? (
          <Button
            variant={"neo"}
            size={"lg"}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        ) : (
          <Button
            variant={"neo"}
            size={"lg"}
            onClick={handleNext}
          >
            {!started ? "Start" : "Next"}
          </Button>
        )}
      </footer>
    </div>
  );
}
