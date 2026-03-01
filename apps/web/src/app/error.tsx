"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-give-bg px-6">
      <div className="text-center max-w-md">
        <p className="text-5xl">😵</p>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Something went wrong
        </h1>
        <p className="mt-4 text-gray-600 leading-relaxed">
          We hit an unexpected error. This has been noted and we&apos;ll look
          into it.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="text-sm font-semibold text-white bg-give-primary hover:bg-give-primary-dark transition-colors px-6 py-3 rounded-lg"
          >
            Try Again
          </button>
          <a
            href="/"
            className="text-sm font-semibold text-give-primary hover:text-give-primary-dark transition-colors px-6 py-3"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
