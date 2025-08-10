"use client";
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session, status } = useSession(); 

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Not logged in</p>;

  return (
    <div>
      <p>Full Name: {session.user?.name}</p>
      <p>Email: {session.user?.email}</p>
    </div>
  );
}