export default function OnboardingStep1() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg sm:text-xl font-bold mb-1 text-gray-900">
        Step 1: Organization Details
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Tell us about your nonprofit so we can set up your account.
      </p>
      <form action="/onboarding/stripe" className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Hope Foundation"
            className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-give-primary/20 focus:border-give-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Slug
          </label>
          <input
            type="text"
            required
            placeholder="e.g. hope-foundation"
            className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-give-primary/20 focus:border-give-primary transition-colors"
          />
          <p className="mt-1 text-xs text-gray-400">
            This will be your donation page URL: give.fund/hope-foundation
          </p>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-give-primary hover:bg-give-primary-dark transition-colors"
        >
          Continue to Stripe Setup
        </button>
      </form>
    </div>
  );
}
