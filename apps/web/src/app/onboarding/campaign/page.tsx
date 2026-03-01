export default function OnboardingStep3() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-gray-900">Step 3: Create First Campaign</h3>
      <form action="/dashboard" className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign Title</label>
          <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea className="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
        </div>
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          Create & Go to Dashboard
        </button>
      </form>
    </div>
  );
}
