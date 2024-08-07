"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getStripe } from "@/lib/stripe-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Props = {
  userId?: string;
  price: string;
};

const SubscribeBtn = (props: Props) => {
  const { price, userId } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (price: string) => {
    if (!userId) {
      router.push("/login");
    }
    setLoading(true);

    try {
      const checkoutSession = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price }),
      }).then((r) => r.json());

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId: checkoutSession.sessionId });
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
        onClick={() => handleCheckout(price)}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please Wait
          </>
        ) : (
          "Upgrade Your Plan"
        )}
      </Button>
    </>
  );
};

export default SubscribeBtn;
