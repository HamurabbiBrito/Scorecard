"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WithRole({ children, allowedRoles }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && !allowedRoles.includes(session.user.role)) {
      router.push("/unauthorized");
    }
  }, [status, session, allowedRoles]);

  if (status === "loading") return <div>Cargando...</div>;
  if (status === "authenticated" && allowedRoles.includes(session.user.role)) {
    return children;
  }

  return null;
}