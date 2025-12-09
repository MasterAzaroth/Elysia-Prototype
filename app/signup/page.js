import SignUpForm from "@/components/account/signUpForm";
import { Landmark } from "lucide-react"

export default function SignUpPage() {
  return (
    <div>
      <div className="mb-4 flex flex-col items-center">
        <div className="flex h-auto w-auto p-4 items-center justify-center">
          <Landmark size={48} />
        </div>
        <p className="text-lg">Welcome to Elysia</p>
      </div>
      <SignUpForm />
    </div>
  );
}
