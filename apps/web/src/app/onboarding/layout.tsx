import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <Link
            href="/"
            className="text-2xl font-bold text-give-primary tracking-tight"
          >
            Give
          </Link>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-gray-900">
            Set up your nonprofit
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Get started in under 5 minutes
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
