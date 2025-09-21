import { getSession } from './auth';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';

export async function requireAuth() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/login');
  }
  
  return session;
}

export async function requireRole(roles: UserRole[]) {
  const session = await requireAuth();
  
  if (!roles.includes(session.user.role)) {
    redirect('/unauthorized');
  }
  
  return session;
}

export async function getAuthUser() {
  const session = await getSession();
  return session?.user || null;
}