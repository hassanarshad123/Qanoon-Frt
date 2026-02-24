export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newThisWeek: number;
  byRole: { role: string; count: number }[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string | null;
  onboardingCompleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedUsers {
  users: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
