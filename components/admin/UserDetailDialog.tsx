"use client";

import { useEffect, useState } from "react";
import { adminApi, type AdminUser, type AdminUserDetail } from "@/lib/api/admin";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface UserDetailDialogProps {
  user: AdminUser | null;
  onClose: () => void;
}

export function UserDetailDialog({ user, onClose }: UserDetailDialogProps) {
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setDetail(null);
      return;
    }
    setLoading(true);
    adminApi.getUserDetail(user.id)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-[#A21CAF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : detail ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Name</span>
                <p className="font-medium">{detail.name}</p>
              </div>
              <div>
                <span className="text-gray-500">Email</span>
                <p className="font-medium">{detail.email}</p>
              </div>
              <div>
                <span className="text-gray-500">Role</span>
                <Badge variant="outline" className="capitalize mt-1">
                  {detail.role || "Unassigned"}
                </Badge>
              </div>
              <div>
                <span className="text-gray-500">Status</span>
                <Badge variant={detail.isActive ? "default" : "destructive"} className="mt-1">
                  {detail.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <span className="text-gray-500">Last Login</span>
                <p className="font-medium">
                  {detail.lastLoginAt
                    ? new Date(detail.lastLoginAt).toLocaleString()
                    : "Never"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Joined</span>
                <p className="font-medium">{new Date(detail.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Activity Count</span>
                <p className="font-medium">{detail.activityCount}</p>
              </div>
              {detail.lastActivity && (
                <div>
                  <span className="text-gray-500">Last Activity</span>
                  <p className="font-medium">{new Date(detail.lastActivity).toLocaleString()}</p>
                </div>
              )}
            </div>

            {detail.profileData && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Profile Data</h4>
                  <pre className="bg-gray-50 rounded-lg p-3 text-xs overflow-x-auto max-h-[300px]">
                    {JSON.stringify(detail.profileData, null, 2)}
                  </pre>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Failed to load user details.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
