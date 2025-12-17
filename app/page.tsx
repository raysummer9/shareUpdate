import { Hero } from "@/components/hero";
import { Statistics } from "@/components/statistics";
import { Features } from "@/components/features";
export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Statistics />
      <Features />
    </div>
  );
}

