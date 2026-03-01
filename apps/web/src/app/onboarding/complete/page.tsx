import Link from 'next/link';

export default function OnboardingComplete() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
      <h3 className="text-xl font-bold mb-4 text-gray-900">Stripe Setup Complete!</h3>
      <p className="text-gray-600 mb-6">Your payment processing is ready to go.</p>
      <Link href="/onboarding/campaign" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
        Continue to Campaign
      </Link>
    </div>
  );
}
