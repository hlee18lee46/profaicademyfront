import RegisterForm from "@/app/components/RegisterForm";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-200 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 flex max-w-4xl w-full gap-8">
        {/* Form Section */}
        <div className="w-1/2">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Create Account</h1>
          <RegisterForm />
        </div>

        {/* Image Section */}
        <div className="w-1/2 flex items-center justify-center">
          <Image
            src="/instruction.png"
            alt="Canvas Registration Instructions"
            width={350}
            height={350}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
