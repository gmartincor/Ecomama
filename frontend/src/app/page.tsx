export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-sans text-sm lg:flex">
        <div className="text-center">
          <h1 className="font-heading text-6xl font-bold text-primary-600 mb-4">
            🌱 Ecomama
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            Connecting Farmers and Consumers
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A multi-user platform for the direct purchase of organic products.
            More than a marketplace—it's a cultural movement for sustainable food communities.
          </p>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📍 Marketplace</h3>
              <p className="text-gray-600">
                Geolocation-based listings with map and list views
              </p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📅 Events</h3>
              <p className="text-gray-600">
                Community events with RSVP and discussions
              </p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">💬 Community</h3>
              <p className="text-gray-600">
                Forums, groups, and real-time chat
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Project Status: Phase 0 - Foundation Setup Complete ✅</p>
            <p className="mt-2">Next: Phase 1 - Authentication & User Management</p>
          </div>
        </div>
      </div>
    </main>
  );
}
