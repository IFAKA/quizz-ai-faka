import { getUserSubscription } from "@/app/actions/userSubscriptions";
import UpgradePlan from "@/app/api/quizz/UpgradePlan";
import { auth, signIn } from "@/auth";
import UploadDoc from "../UploadDoc";

const page = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    signIn();
    return;
  }
  const subscribed = await getUserSubscription({ userId });
  return (
    <div className="flex flex-col flex-1">
      <main className="py-11 flex flex-col text-center gap-4 items-center flex-1 mt-24">
        {subscribed ? (
          <>
            <h2 className="text-3xl font-bold mb-4">
              Generate quizz based on uploaded file
            </h2>
            <UploadDoc />
          </>
        ) : (
          <UpgradePlan />
        )}
      </main>
    </div>
  );
};

export default page;
