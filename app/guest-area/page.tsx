'use client';

import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-light text-orange-300 mb-2">
        Welcome, <span className="text-white">{session?.user?.name || 'Guest'}</span>
      </h1>
      <p className="text-gray-400 text-lg">We're glad to see you back.</p>

      <div className="h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent my-8"></div>

      <div className="text-gray-300 leading-relaxed">
        <p>Manage your reservations, view guest details, and more.</p>
      </div>
    </div>
  );
}