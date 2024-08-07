import { db } from "@/db";
import { eq } from "drizzle-orm";
import { quizzes } from "@/db/schema";
import { auth } from "@/auth";
import QuizzesTable from "./QuizzesTable";
import getUserMetrics from "@/app/actions/getUserMetrics";
import MetricCard from "./MetricCard";
import getHeatMapData from "@/app/actions/getHeatMapData";
import SubmissionsHeatMap from "./HeatMap";
import SubscribeBtn from "../billing/SubscribeBtn";
import { PRICE_ID } from "@/lib/utils";

const Dashboard = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <p>User not found</p>;
  }

  const userQuizzes = await db.query.quizzes.findMany({
    where: eq(quizzes.userId, userId),
  });

  const userData = await getUserMetrics();
  const heatMapData = await getHeatMapData();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {userData && userData.length > 0
          ? userData.map(({ label, value }) => (
              <MetricCard
                key={label}
                label={label}
                value={+value}
              />
            ))
          : null}
      </div>
      <div>
        {heatMapData ? <SubmissionsHeatMap data={heatMapData.data} /> : null}
      </div>
      <QuizzesTable quizzes={userQuizzes} />
    </>
  );
};

export default Dashboard;
