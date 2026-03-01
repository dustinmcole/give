import Link from 'next/link';

export default function OnboardingStep2() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-gray-900">Step 2: Payment Setup</h3>
      <p className="text-gray-600 mb-6">Connect your bank account to receive donations via Stripe Connect.</p>
      <div className="space-y-4">
        <Link href="/onboarding/complete" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          Connect with Stripe
        </Link>
        <Link href="/onboarding/campaign" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          Skip for now
        </Link>
      </div>
    </div>
  );
}
