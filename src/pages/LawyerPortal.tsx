import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { MessageCircleMore, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LawyerProfileForm } from "@/components/lawyers/LawyerProfileForm";
import { ServiceRequestsList } from "@/components/lawyers/ServiceRequestsList";
import { ChatWindow } from "@/components/lawyers/ChatWindow";
import {
  useLawyerProfile,
  useLawyerRequests,
  useUpdateRequestStatus,
  useUpsertLawyerProfile,
} from "@/hooks/use-lawyer-directory";
import { supabase } from "@/lib/supabase";
import type { Conversation } from "@/types/lawyers";

export default function LawyerPortal() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Conversations (for lawyer's messages tab)
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [convsLoading, setConvsLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);

  // Signup OTP flow
  const [signupStep, setSignupStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

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

  // Load conversations for this lawyer + subscribe to real-time updates
  useEffect(() => {
    if (!user?.id || !profile || profile.status !== "approved") return;

    const fetchConversations = async () => {
      setConvsLoading(true);
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("lawyer_id", user.id)
        .order("last_message_at", { ascending: false });

      if (!error && data) setConversations(data as Conversation[]);
      setConvsLoading(false);
    };

    fetchConversations();

    // Realtime: refresh list when a new message arrives
    const channel = supabase
      .channel("lawyer-conversations")
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "conversations",
        filter: `lawyer_id=eq.${user.id}`,
      }, (payload) => {
        setConversations((prev) =>
          prev
            .map((c) => (c.id === payload.new.id ? { ...c, ...payload.new } : c))
            .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())
        );
      })
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "conversations",
        filter: `lawyer_id=eq.${user.id}`,
      }, (payload) => {
        setConversations((prev) => [payload.new as Conversation, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id, profile?.status]);
  const upsertProfile = useUpsertLawyerProfile();
  const updateRequest = useUpdateRequestStatus();

  const authUnavailable = useMemo(
    () => !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY,
    []
  );

  const login = async () => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed.");
    }
    setAuthLoading(false);
  };

  // Step 1 — always use signInWithOtp for both new & existing users.
  // shouldCreateUser:true creates the account if it doesn't exist yet.
  // This guarantees type:"email" in verifyOtp — no more expired token errors.
  const signup = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      setSignupStep("otp");
      toast.success("A 6-digit verification code has been sent to your email.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send code. Please try again.");
    }
    setAuthLoading(false);
  };

  // Step 2 — verify OTP. Type is always "email" because signInWithOtp sent it.
  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the verification code.");
      return;
    }
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: "email",
      });
      if (error) throw error;
      toast.success("Email verified! Welcome to the Lawyer Portal.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid or expired code. Please try again.");
    }
    setAuthLoading(false);
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
                  {signupStep === "form" ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Enter your email and we'll send you a 6-digit code to verify and access your account.
                      </p>
                      <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        onKeyDown={(e) => e.key === "Enter" && signup()}
                      />
                      <Button className="w-full rounded-xl" onClick={signup} disabled={authLoading}>
                        {authLoading ? "Sending code..." : "Send Verification Code"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Enter the 6-digit code sent to <strong>{email}</strong>
                      </p>
                      <Input
                        placeholder="123456"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                        autoFocus
                      />
                      <Button className="w-full rounded-xl" onClick={verifyOtp} disabled={authLoading}>
                        {authLoading ? "Verifying..." : "Verify & Continue"}
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full text-sm"
                        onClick={() => { setSignupStep("form"); setOtp(""); }}
                      >
                        ← Change email / resend code
                      </Button>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const submitProfile = async (values: import("@/types/lawyers").LawyerProfileInput) => {
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

        {!profile ? <LawyerProfileForm onSubmit={submitProfile} isSubmitting={upsertProfile.isPending} lawyerId={user.id} /> : null}

        {profile?.status === "pending" ? (
          <Card className="rounded-2xl border-amber-300 bg-amber-50/80">
            <CardHeader>
              <CardTitle>Your profile is under review by admin</CardTitle>
              <CardDescription>You will access service requests as soon as your profile is approved.</CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {profile?.status === "approved" ? (
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="requests">Service Requests</TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
                {conversations.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {conversations.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Service Requests Tab */}
            <TabsContent value="requests">
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
              {requestsLoading && <p className="mt-3 text-sm text-muted-foreground">Loading requests...</p>}
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card className="rounded-2xl border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircleMore className="h-5 w-5 text-primary" />
                    Client Conversations
                  </CardTitle>
                  <CardDescription>Real-time messages from clients.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {convsLoading && <p className="text-sm text-muted-foreground">Loading conversations...</p>}

                  {!convsLoading && conversations.length === 0 && (
                    <div className="py-10 text-center">
                      <MessageSquare className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No messages yet. Clients can message you from the Lawyers page.</p>
                    </div>
                  )}

                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => { setActiveConv(conv); setChatOpen(true); }}
                      className="w-full flex items-center gap-3 rounded-xl border border-border p-3 text-left hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {(conv.client_name || "C").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{conv.client_name || "Client"}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.last_message || "No messages yet"}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(conv.last_message_at).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : null}

        {/* Chat window for lawyer replying to client */}
        {activeConv && user && (
          <ChatWindow
            open={chatOpen}
            onOpenChange={(open) => { setChatOpen(open); if (!open) setActiveConv(null); }}
            lawyerId={activeConv.lawyer_id}
            lawyerName={profile?.full_name || user.email || "Lawyer"}
            clientId={activeConv.client_id}
            clientName={activeConv.client_name || "Client"}
            currentUserId={user.id}
            currentUserName={profile?.full_name || user.email || "Lawyer"}
          />
        )}
      </div>
    </div>
  );
}
