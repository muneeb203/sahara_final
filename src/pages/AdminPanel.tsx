import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Bell, MessageCircleMore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceRequestsList } from "@/components/lawyers/ServiceRequestsList";
import { useAllLawyersForAdmin, useAllRequestsForAdmin, useSetLawyerApproval } from "@/hooks/use-lawyer-directory";
import { supabase } from "@/lib/supabase";

const getAdminEmails = () =>
  (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((value: string) => value.trim().toLowerCase())
    .filter(Boolean);

export default function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const adminEmails = useMemo(() => getAdminEmails(), []);
  const isAdmin = !!user?.email && adminEmails.includes(user.email.toLowerCase());

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };
    loadUser();
  }, []);

  const { data: lawyers = [], isLoading: lawyersLoading } = useAllLawyersForAdmin();
  const { data: requests = [], isLoading: requestsLoading } = useAllRequestsForAdmin();
  const setApproval = useSetLawyerApproval();

  const updateApproval = async (lawyerId: string, status: "approved" | "rejected") => {
    try {
      await setApproval.mutateAsync({ lawyerId, status });
      toast.success(`Lawyer ${status}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update lawyer status.");
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-xl rounded-2xl">
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
            <CardDescription>Please login from the Lawyer Portal first, then open `/admin`.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-xl rounded-2xl">
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
            <CardDescription>
              Add your account email to `VITE_ADMIN_EMAILS` (comma separated) to enable admin actions.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/80 to-background py-10">
      <div className="container mx-auto space-y-6 px-4">
        <div>
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Approve lawyers and monitor all service requests.</p>
        </div>

        <Card className="rounded-2xl border-primary/10">
          <CardHeader>
            <CardTitle>Lawyer Approvals</CardTitle>
            <CardDescription>Approve or reject submitted lawyer profiles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lawyersLoading ? <p className="text-sm text-muted-foreground">Loading lawyers...</p> : null}
            {lawyers.map((lawyer) => (
              <div key={lawyer.id} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{lawyer.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {lawyer.specialization} - {lawyer.city}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {lawyer.status}
                  </Badge>
                  <Button size="sm" onClick={() => updateApproval(lawyer.id, "approved")}>
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateApproval(lawyer.id, "rejected")}>
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <ServiceRequestsList requests={requests} />
        {requestsLoading ? <p className="text-sm text-muted-foreground">Loading all requests...</p> : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="rounded-2xl border-dashed border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageCircleMore className="h-4 w-4" />
                Chat System
              </CardTitle>
              <CardDescription>Placeholder for admin oversight of future chat workflows.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl border-dashed border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
              <CardDescription>Placeholder for admin notifications and audit alerts.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
