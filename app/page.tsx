import { Hero } from "@/components/hero";
import { Statistics } from "@/components/statistics";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Statistics />
      <Features />
      <HowItWorks />
    </div>
  );
}

