/**
 * @deprecated This module is replaced by the API client layer (lib/api/).
 * All frontend code should use the corresponding API client instead.
 * Kept for rollback purposes only — do not use in new code.
 */

"use server";

import { auth } from "@/auth";
import { getSQL } from "@/lib/db";
import type { AdminStats, AdminUser, PaginatedUsers } from "./types";

async function verifyAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return session;
}

export async function getAdminStats(): Promise<AdminStats> {
  await verifyAdmin();
  const sql = getSQL();

  const [totalRows, activeRows, inactiveRows, weekRows, roleRows] = await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM users`,
    sql`SELECT COUNT(*)::int AS count FROM users WHERE is_active = true`,
    sql`SELECT COUNT(*)::int AS count FROM users WHERE is_active = false`,
    sql`SELECT COUNT(*)::int AS count FROM users WHERE created_at >= now() - interval '7 days'`,
    sql`SELECT COALESCE(role, 'unassigned') AS role, COUNT(*)::int AS count FROM users GROUP BY role ORDER BY count DESC`,
  ]);

  return {
    totalUsers: totalRows[0].count,
    activeUsers: activeRows[0].count,
    inactiveUsers: inactiveRows[0].count,
    newThisWeek: weekRows[0].count,
    byRole: roleRows.map((r: any) => ({ role: r.role, count: r.count })),
  };
}

export async function getUsers(
  search?: string,
  roleFilter?: string,
  statusFilter?: string,
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedUsers> {
  await verifyAdmin();
  const sql = getSQL();

  // Build WHERE clauses
  const conditions: string[] = [];
  const params: any[] = [];
  let paramIdx = 1;

  if (search) {
    conditions.push(`(email ILIKE $${paramIdx} OR name ILIKE $${paramIdx})`);
    params.push(`%${search}%`);
    paramIdx++;
  }
  if (roleFilter && roleFilter !== "all") {
    if (roleFilter === "unassigned") {
      conditions.push(`role IS NULL`);
    } else {
      conditions.push(`role = $${paramIdx}`);
      params.push(roleFilter);
      paramIdx++;
    }
  }
  if (statusFilter === "active") {
    conditions.push(`is_active = true`);
  } else if (statusFilter === "inactive") {
    conditions.push(`is_active = false`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * pageSize;

  const countQuery = `SELECT COUNT(*)::int AS count FROM users ${whereClause}`;
  const dataQuery = `SELECT id, email, name, role, onboarding_completed, is_active, created_at, updated_at FROM users ${whereClause} ORDER BY created_at DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;

  const [countRows, dataRows] = await Promise.all([
    sql(countQuery, [...params]),
    sql(dataQuery, [...params, pageSize, offset]),
  ]);

  const total = countRows[0].count;

  return {
    users: dataRows.map((r: any) => ({
      id: r.id,
      email: r.email,
      name: r.name,
      role: r.role,
      onboardingCompleted: r.onboarding_completed,
      isActive: r.is_active,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
  await verifyAdmin();
  const sql = getSQL();
  await sql`UPDATE users SET is_active = ${isActive}, updated_at = now() WHERE id = ${userId}`;
}

export async function changeUserRole(userId: string, newRole: string) {
  await verifyAdmin();
  const sql = getSQL();
  const validRoles = ["lawyer", "judge", "admin"];
  if (!validRoles.includes(newRole)) throw new Error("Invalid role");
  await sql`UPDATE users SET role = ${newRole}, updated_at = now() WHERE id = ${userId}`;
}

export async function getUserDetail(userId: string) {
  await verifyAdmin();
  const sql = getSQL();

  const userRows = await sql`
    SELECT id, email, name, role, onboarding_completed, is_active, created_at, updated_at
    FROM users WHERE id = ${userId}
  `;
  if (!userRows[0]) return null;

  const onboardingRows = await sql`
    SELECT role, data, full_name, phone, created_at, updated_at
    FROM onboarding_submissions WHERE user_id = ${userId}
    ORDER BY created_at DESC LIMIT 1
  `;

  const user = userRows[0];
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    onboardingCompleted: user.onboarding_completed,
    isActive: user.is_active,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    onboardingData: onboardingRows[0] || null,
  };
}
