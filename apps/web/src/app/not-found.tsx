import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-give-bg px-6">
      <div className="text-center max-w-md">
        <p className="text-7xl font-extrabold text-give-primary">404</p>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Page not found
        </h1>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Sorry, we couldn&apos;t find what you were looking for. It might have
          been moved or no longer exists.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-white bg-give-primary hover:bg-give-primary-dark transition-colors px-6 py-3 rounded-lg"
          >
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-give-primary hover:text-give-primary-dark transition-colors px-6 py-3"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
