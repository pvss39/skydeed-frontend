const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://skydeedexperiment-production.up.railway.app";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-green-400 mb-2">SkyDeed</h1>
          <p className="text-gray-400 text-lg">Satellite Land Monitoring</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Monitor your land from space</h2>
          <p className="text-gray-400 mb-6">
            Get real Sentinel-2 satellite images of your farm. Receive instant alerts
            when encroachment, construction, or vegetation loss is detected.
          </p>

          <a
            href={`${API_URL}/auth/google/login`}
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-lg"
          >
            Sign in with Google
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-xl mb-2">🛰️</p>
            <p>Real Sentinel-2 imagery every few days</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-xl mb-2">🚨</p>
            <p>Instant alerts for encroachment & changes</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-xl mb-2">📄</p>
            <p>PDF evidence reports for legal use</p>
          </div>
        </div>
      </div>
    </main>
  );
}
