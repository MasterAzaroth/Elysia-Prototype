import SignUpForm from "@/components/account/signUpForm";
import { Landmark } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start px-6 pt-10">
      <div className="mb-6 flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-grey2">
          <Landmark size={28} />
        </div>
        <p className="mt-3 text-sm md:text-lg">Welcome to Elysia</p>
      </div>

      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
