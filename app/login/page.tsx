import Sing from "@/components/Sing";
import { Suspense } from "react";
export default function Lgoin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Sing sing={false} />;
    </Suspense>
  );
}
