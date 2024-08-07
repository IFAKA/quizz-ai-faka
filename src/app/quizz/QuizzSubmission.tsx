"use client";

import Bar from "@/components/Bar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useReward } from "react-rewards";

type Props = {
  scorePercentage: number;
  score: number;
  totalQuestions: number;
};

export default function QuizzSubmission(props: Props) {
  const { score, scorePercentage, totalQuestions } = props;
  const { reward, isAnimating } = useReward("rewardId", "confetti");
  const { replace } = useRouter();

  const handleFinish = () => replace("/dashboard");

  useEffect(() => {
    if (scorePercentage === 100) {
      reward();
    }
  }, [scorePercentage, reward]);

  return (
    <div className="flex flex-col flex-1">
      <main className="py-11 flex flex-col gap-4 items-center flex-1 mt-24">
        <h2 className="text-3xl font-bold">Quizz Complete!</h2>
        {scorePercentage === 100 ? (
          <div className="flex flex-col items-center">
            <p>You scored {scorePercentage}%</p>
            <p>Congratulations!</p>
            <Image
              src={"/images/owl-smiling.png"}
              alt="Owl smiling"
              width={200}
              height={200}
            />
            <span id="rewardId" />
          </div>
        ) : (
          <div>
            <Bar
              color="green"
              percentage={scorePercentage}
            />
            <p>Total Questions: {totalQuestions}</p>
            <p>Correct Answers: {score}</p>
          </div>
        )}
      </main>
      <footer className="footer pb-9 px-6 relative mb-0">
        <Button
          variant={"neo"}
          size={"lg"}
          onClick={handleFinish}
        >
          {"Finish"}
        </Button>
      </footer>
    </div>
  );
}
