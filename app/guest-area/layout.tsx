'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Calendar, User, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import Link from 'next/link';

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  const pathname = usePathname();

  const isActive = href === '/guest-area'
    ? pathname === href
    : pathname.startsWith(href) && pathname.replace(href, '').split('/')[1] === ''; // No extra segments

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
        ? 'bg-[#2A3A47] text-white'
        : 'text-gray-300 hover:text-white hover:bg-[#2A3A47]'
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#141C24] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className='flex flex-col'>
        <hr className='mb-2 border-red-200 border-t-2 w-full' />
        <div className="bg-[#141C24] min-h-screen flex flex-col lg:flex-row w-full max-w-7xl mx-auto pt-25">
      <aside className="w-full lg:w-72 bg-[#141C24] border-b lg:border-b-0 lg:border-r border-gray-800 flex-shrink-0 flex flex-col justify-between">
        <nav className="p-4 space-y-1 flex flex-col gap-[1rem]">
          <NavLink
            href="/guest-area"
            icon={<Home size={20} />}
            label="Home" />
          <NavLink
            href="/guest-area/reservation"
            icon={<Calendar size={20} />}
            label="Reservations"
          />
          <NavLink
            href="/guest-area/profile"
            icon={<User size={20} />}
            label="Guest Profile"
          />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-[#2A3A47] rounded-lg transition-all duration-200"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto px-4  sm:p-6">
        {children}
      </main>
    </div>
    </div>
  );
}