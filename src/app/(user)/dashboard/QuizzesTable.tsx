import { quizzes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";

export type Quizz = InferSelectModel<typeof quizzes>;

type Props = {
  quizzes: Quizz[];
};

const QuizzesTable = (props: Props) => {
  const { quizzes } = props;
  return (
    <div className="rounded-md overflow-hidden p-5 border">
      <table className="table-auto">
        <thead>
          <tr>
            <th className="text-[#6c7381] text-left">Name</th>
            <th className="text-[#6c7381] text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map(({ id, name, description }) => (
            <tr key={id}>
              <td>
                <Link
                  href={`/quizz/${id}`}
                  className="underline"
                >
                  {name}
                </Link>
              </td>
              <td>{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizzesTable;
