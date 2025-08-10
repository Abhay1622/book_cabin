import Link from 'next/link'

export default function CabinNotFound() {
  return (
    <div className="min-h-screen bg-[#141C24] flex items-center justify-center p-6">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold text-[#C69963] mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Cabin Not Found</h2>
        <p className="text-slate-300 mb-8 max-w-md">
          The cabin you're looking for doesn't exist or may have been removed.
        </p>
        <Link 
          href="/cabins"
          className="bg-[#C69963] hover:bg-[#B8954A] text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Cabins
        </Link>
      </div>
    </div>
  )
}