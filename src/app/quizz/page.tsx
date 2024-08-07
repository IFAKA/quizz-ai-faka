"use client";

import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ui/progressBar";
import { ChevronLeft, X } from "lucide-react";
import { useState } from "react";
import ResultCard from "./ResultCard";
import QuizzSubmission from "./QuizzSubmission";

const questions = [
  {
    questionText:
      "What is the JSX syntax for creating a functional component in React?",
    answers: [
      {
        answerText: "class MyComponent extends React.Component {}",
        isCorrect: false,
        id: 0,
      },
      {
        answerText: "const MyComponent = () => <div>Hello World!</div>;",
        isCorrect: true,
        id: 1,
      },
      {
        answerText: "function MyComponent() { return <div>Hello World!</div> }",
        isCorrect: true,
        id: 2,
      },
    ],
  },
  {
    questionText: "What is the purpose of the `useState` hook in React?",
    answers: [
      {
        answerText: "To pass data between components",
        isCorrect: false,
        id: 3,
      },
      {
        answerText: "To manage the state of a functional component",
        isCorrect: true,
        id: 4,
      },
      {
        answerText: "To manipulate the DOM directly",
        isCorrect: false,
        id: 5,
      },
    ],
  },
  {
    questionText:
      "How do you iterate over an array of data and display it in React?",
    answers: [
      {
        answerText: "Use a for loop inside the render method",
        isCorrect: false,
        id: 6,
      },
      {
        answerText: "Use the `map` function and JSX",
        isCorrect: true,
        id: 7,
      },
      {
        answerText: "There is no built-in way to iterate in React",
        isCorrect: false,
        id: 8,
      },
    ],
  },
];

export default function Quizz() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

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

    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleAnswer = (answer: any) => () => {
    setSelectedAnswer(answer.id);
    const isCurrentCorrect = answer.isCorrect;
    if (isCurrentCorrect) {
      setScore(score + 1);
    }
    setIsCorrect(isCurrentCorrect);
  };

  const scorePercentage = Math.round((score / questions.length) * 100);

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
          >
            <ChevronLeft />
          </Button>
          <ProgressBar value={(currentQuestion / questions.length) * 100} />
          <Button
            size={"icon"}
            variant={"outline"}
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
                    id={`${answer.id}`}
                    variant={variant}
                    size={"xl"}
                    onClick={handleAnswer(answer)}
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
            )?.answerText!
          }
          isCorrect={isCorrect}
        />
        <Button
          variant={"neo"}
          size={"lg"}
          onClick={handleNext}
        >
          {!started
            ? "Start"
            : currentQuestion === questions.length - 1
            ? "Submit"
            : "Next"}
        </Button>
      </footer>
    </div>
  );
}
