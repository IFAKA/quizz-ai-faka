import { auth } from "@/auth";

const page = async () => {
  const session = await auth();

  return (
    <div className="p-4 border rounded-md">
      <h1 className="text-4xl mb-3">Subscription Details</h1>
      <p className="mb-2">You are currently on a plan</p>
    </div>
  );
};

export default page;
