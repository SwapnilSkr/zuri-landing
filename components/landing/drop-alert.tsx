"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DropAlert() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    const formData = new FormData(form);
    formData.append(
      "access_key",
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || ""
    );
    if (!formData.get("name")) {
      formData.append("name", "Drop Alert Signup");
    }
    if (!formData.get("message")) {
      formData.append("message", "Add me to the Zuri drop alert list.");
    }

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setResult(
      data.success
        ? "Success! You're on the list."
        : `Something went wrong. Try again.`
    );
    setIsSubmitting(false);
    if (data.success) {
      form.reset();
    }
  };

  return (
    <section className="rounded-[36px] border border-black/5 bg-white/80 p-10 text-center shadow-[0_20px_60px_rgba(12,6,24,0.06)] backdrop-blur">
      <div className="flex flex-col items-center gap-6">
        <Badge variant="outline">Drop alert</Badge>
        <h2 className="text-4xl font-semibold text-[#0B090C]">
          Launching soon on iOS and Android.
        </h2>
        <p className="max-w-3xl text-lg text-black/60">
          Zuri is in private testing. Join the waitlist to unlock the mobile
          build, contribute feedback, and co-create the future of personal
          styling before the official drop.
        </p>
        <form
          className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="name" value="Drop Alert Signup" />
          <input
            className="h-12 w-full rounded-full border border-black/10 bg-white/80 px-6 text-base outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10 sm:max-w-sm"
            name="email"
            placeholder="email@you.com"
            required
            type="email"
          />
          <Button
            className="w-full sm:w-auto"
            type="submit"
            variant="gradient"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Join early access"}
          </Button>
        </form>
        <p className="text-sm text-black/60">{result}</p>
        <p className="text-xs uppercase tracking-[0.3em] text-black/40">
          Shipping soon • No spam • Unsubscribe anytime
        </p>
      </div>
    </section>
  );
}
