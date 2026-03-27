import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Bell, MessageCircleMore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LawyerProfileForm } from "@/components/lawyers/LawyerProfileForm";
import { ServiceRequestsList } from "@/components/lawyers/ServiceRequestsList";
import {
  useLawyerProfile,
  useLawyerRequests,
  useUpdateRequestStatus,
  useUpsertLawyerProfile,
} from "@/hooks/use-lawyer-directory";
import { supabase } from "@/lib/supabase";

export default function LawyerPortal() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };
    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const { data: profile, isLoading: profileLoading } = useLawyerProfile(user?.id);
  const { data: requests = [], isLoading: requestsLoading } = useLawyerRequests(user?.id);
  const upsertProfile = useUpsertLawyerProfile();
  const updateRequest = useUpdateRequestStatus();

  const authUnavailable = useMemo(
    () => !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY,
    []
  );

  const login = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed.");
    }
  };

  const signup = async () => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success("Account created. Please verify your email if required.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed.");
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (authUnavailable) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-xl rounded-2xl">
          <CardHeader>
            <CardTitle>Lawyer Portal</CardTitle>
            <CardDescription>
              Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to use lawyer authentication.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50/80 to-background py-12">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-md rounded-2xl">
            <CardHeader>
              <CardTitle>Lawyer Portal</CardTitle>
              <CardDescription>Login or create an account to manage your legal service requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Signup</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="space-y-3">
                  <Input placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <Button className="w-full rounded-xl" onClick={login}>
                    Login
                  </Button>
                </TabsContent>
                <TabsContent value="signup" className="space-y-3">
                  <Input placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <Button className="w-full rounded-xl" onClick={signup}>
                    Create Account
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const submitProfile = async (values: {
    full_name: string;
    specialization: string;
    city: string;
    experience_years: number;
    bio: string;
    phone?: string;
  }) => {
    try {
      await upsertProfile.mutateAsync({ userId: user.id, profile: values });
      toast.success("Profile submitted for admin approval.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/80 to-background py-10">
      <div className="container mx-auto space-y-6 px-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Lawyer Dashboard</h1>
            <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
          </div>
          <Button variant="outline" className="rounded-xl" onClick={logout}>
            Logout
          </Button>
        </div>

        {profileLoading ? <p className="text-sm text-muted-foreground">Loading profile...</p> : null}

        {!profile ? <LawyerProfileForm onSubmit={submitProfile} isSubmitting={upsertProfile.isPending} /> : null}

        {profile?.status === "pending" ? (
          <Card className="rounded-2xl border-amber-300 bg-amber-50/80">
            <CardHeader>
              <CardTitle>Your profile is under review by admin</CardTitle>
              <CardDescription>You will access service requests as soon as your profile is approved.</CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {profile?.status === "approved" ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ServiceRequestsList
                requests={requests}
                showActions
                onAccept={(requestId) =>
                  updateRequest.mutate({ requestId, status: "accepted", lawyerId: user.id })
                }
                onReject={(requestId) =>
                  updateRequest.mutate({ requestId, status: "rejected", lawyerId: user.id })
                }
              />
              {requestsLoading ? <p className="mt-3 text-sm text-muted-foreground">Loading requests...</p> : null}
            </div>
            <div className="space-y-4">
              <Card className="rounded-2xl border-dashed border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageCircleMore className="h-4 w-4" />
                    Chat System
                  </CardTitle>
                  <CardDescription>Placeholder for future real-time chat with users.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="rounded-2xl border-dashed border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Placeholder for request and status notifications.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
