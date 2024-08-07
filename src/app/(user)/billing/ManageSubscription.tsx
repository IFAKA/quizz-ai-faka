"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getStripe } from "@/lib/stripe-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const ManageSubscription = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const redirectToCustomerPortal = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((r) => r.json());

      router.push(response.url.url);
    } catch (error) {
      console.error("Subscribe button error", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        disabled={loading}
        onClick={() => redirectToCustomerPortal()}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please Wait
          </>
        ) : (
          "Change your subscription"
        )}
      </Button>
    </>
  );
};

export default ManageSubscription;
