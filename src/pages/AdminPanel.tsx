import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  LogOut, Shield, Users, FileText, MessageSquare,
  CheckCircle, XCircle, Clock, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ServiceRequestsList } from "@/components/lawyers/ServiceRequestsList";
import { ChatWindow } from "@/components/lawyers/ChatWindow";
import { useAllLawyersForAdmin, useAllRequestsForAdmin, useSetLawyerApproval } from "@/hooks/use-lawyer-directory";
import { supabase } from "@/lib/supabase";
import type { Conversation } from "@/types/lawyers";

const ADMIN_SESSION_KEY = "admin_session_id";

type AdminSession = { adminId: string };

function isGmailAddress(email: string) {
  return email.trim().toLowerCase().endsWith("@gmail.com");
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center gap-4 pt-5">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold leading-none">{value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPanel() {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [convsLoading, setConvsLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);

  // Restore session
  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (stored) setAdminSession({ adminId: stored });
    setChecking(false);
  }, []);

  // Load all conversations once logged in
  useEffect(() => {
    if (!adminSession) return;

    const fetchConversations = async () => {
      setConvsLoading(true);
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .order("last_message_at", { ascending: false });

      if (!error && data) setConversations(data as Conversation[]);
      setConvsLoading(false);
    };

    fetchConversations();

    // Realtime updates
    const channel = supabase
      .channel("admin-conversations")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversations" },
        (payload) => setConversations((prev) => [payload.new as Conversation, ...prev])
      )
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "conversations" },
        (payload) =>
          setConversations((prev) =>
            prev
              .map((c) => (c.id === payload.new.id ? { ...c, ...payload.new } : c))
              .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())
          )
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [adminSession]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(value && !isGmailAddress(value) ? "Only @gmail.com addresses are allowed." : "");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGmailAddress(email)) { setEmailError("Only @gmail.com addresses are allowed."); return; }
    setLoading(true);

    const { data, error } = await supabase
      .from("admins")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .eq("password", password)
      .maybeSingle();

    if (error || !data) {
      toast.error("Invalid email or password.");
      setLoading(false);
      return;
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, data.id);
    setAdminSession({ adminId: data.id });
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminSession(null);
    setEmail("");
    setPassword("");
  };

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

  // Stats
  const pendingLawyers = lawyers.filter((l) => l.status === "pending").length;
  const approvedLawyers = lawyers.filter((l) => l.status === "approved").length;
  const pendingRequests = requests.filter((r) => r.status === "pending").length;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // ── Login Form ────────────────────────────────────────────────────────────
  if (!adminSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50/80 to-background px-4">
        <Card className="w-full max-w-sm rounded-2xl shadow-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Sign in with your admin credentials.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  required
                  autoComplete="email"
                />
                {emailError && <p className="text-xs text-destructive">{emailError}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !!emailError}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/80 to-background py-10">
      <div className="container mx-auto space-y-6 px-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Full oversight of lawyers, requests and conversations.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={Users} label="Total Lawyers" value={lawyers.length} color="bg-blue-100 text-blue-600" />
          <StatCard icon={CheckCircle} label="Approved" value={approvedLawyers} color="bg-green-100 text-green-600" />
          <StatCard icon={Clock} label="Pending Approval" value={pendingLawyers} color="bg-amber-100 text-amber-600" />
          <StatCard icon={FileText} label="Pending Requests" value={pendingRequests} color="bg-rose-100 text-rose-600" />
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="lawyers">
          <TabsList className="mb-2 flex-wrap h-auto gap-1">
            <TabsTrigger value="lawyers" className="gap-1.5">
              <Users className="h-4 w-4" />
              Lawyers
              {pendingLawyers > 0 && (
                <Badge variant="destructive" className="h-4 px-1 text-[10px]">{pendingLawyers}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-1.5">
              <FileText className="h-4 w-4" />
              Service Requests
              {pendingRequests > 0 && (
                <Badge variant="destructive" className="h-4 px-1 text-[10px]">{pendingRequests}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="conversations" className="gap-1.5">
              <MessageSquare className="h-4 w-4" />
              All Chats
              {conversations.length > 0 && (
                <Badge variant="secondary" className="h-4 px-1 text-[10px]">{conversations.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Lawyers Tab ── */}
          <TabsContent value="lawyers">
            <Card className="rounded-2xl border-primary/10">
              <CardHeader>
                <CardTitle>Lawyer Approvals</CardTitle>
                <CardDescription>Approve or reject submitted lawyer profiles.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {lawyersLoading && <p className="text-sm text-muted-foreground">Loading lawyers...</p>}
                {!lawyersLoading && lawyers.length === 0 && (
                  <p className="text-sm text-muted-foreground">No lawyers registered yet.</p>
                )}
                {lawyers.map((lawyer) => (
                  <div
                    key={lawyer.id}
                    className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        {lawyer.photo_url ? (
                          <img src={lawyer.photo_url} alt={lawyer.full_name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground font-semibold text-sm">
                            {lawyer.full_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{lawyer.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {lawyer.specialization} · {lawyer.city} · {lawyer.experience_years}y exp
                        </p>
                        <p className="text-xs text-muted-foreground">{lawyer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={
                          lawyer.status === "approved"
                            ? "default"
                            : lawyer.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                        className="capitalize"
                      >
                        {lawyer.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {lawyer.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                        {lawyer.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                        {lawyer.status}
                      </Badge>
                      <Button size="sm" onClick={() => updateApproval(lawyer.id, "approved")} disabled={lawyer.status === "approved"}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateApproval(lawyer.id, "rejected")} disabled={lawyer.status === "rejected"}>
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Service Requests Tab ── */}
          <TabsContent value="requests">
            {requestsLoading && <p className="text-sm text-muted-foreground">Loading requests...</p>}
            <ServiceRequestsList requests={requests} />
          </TabsContent>

          {/* ── All Chats Tab ── */}
          <TabsContent value="conversations">
            <Card className="rounded-2xl border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  All Lawyer–Client Conversations
                </CardTitle>
                <CardDescription>
                  Monitor all active chats between lawyers and clients. Click any to read the full thread.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {convsLoading && <p className="text-sm text-muted-foreground">Loading conversations...</p>}

                {!convsLoading && conversations.length === 0 && (
                  <div className="py-10 text-center">
                    <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No conversations yet.</p>
                  </div>
                )}

                {conversations.map((conv) => {
                  const lawyer = lawyers.find((l) => l.id === conv.lawyer_id);
                  return (
                    <button
                      key={conv.id}
                      onClick={() => { setActiveConv(conv); setChatOpen(true); }}
                      className="w-full flex items-center gap-3 rounded-xl border p-3 text-left hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                          {(conv.client_name || "C").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{conv.client_name || "Client"}</p>
                          <span className="text-muted-foreground text-xs">↔</span>
                          <p className="text-sm text-muted-foreground truncate">
                            {lawyer?.full_name || "Lawyer"}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {conv.last_message || "No messages yet"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {new Date(conv.last_message_at).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                        <Eye className="h-3.5 w-3.5 text-muted-foreground/60" />
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Read-only chat viewer for admin */}
      {activeConv && (
        <ChatWindow
          open={chatOpen}
          onOpenChange={(open) => { setChatOpen(open); if (!open) setActiveConv(null); }}
          lawyerId={activeConv.lawyer_id}
          lawyerName={lawyers.find((l) => l.id === activeConv.lawyer_id)?.full_name || "Lawyer"}
          clientId={activeConv.client_id}
          clientName={activeConv.client_name || "Client"}
          currentUserId={activeConv.client_id}
          currentUserName={activeConv.client_name || "Client"}
          readOnly
        />
      )}
    </div>
  );
}
