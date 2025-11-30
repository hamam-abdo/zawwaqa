import Sing from "@/components/Sing";
import { Suspense } from "react";

export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Sing sing={true} />;
    </Suspense>
  );
}
