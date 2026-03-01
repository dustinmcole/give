export default function OnboardingStep1() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-gray-900">Step 1: Organization Details</h3>
      <form action="/onboarding/stripe" className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Organization Name</label>
          <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Organization Slug</label>
          <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          Continue
        </button>
      </form>
    </div>
  );
}
