import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LawyerCard } from "@/components/lawyers/LawyerCard";
import { RequestHelpDialog } from "@/components/lawyers/RequestHelpDialog";
import { ChatWindow } from "@/components/lawyers/ChatWindow";
import { useApprovedLawyers } from "@/hooks/use-lawyer-directory";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { LawyerProfile } from "@/types/lawyers";

export default function Lawyers() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerProfile | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatLawyer, setChatLawyer] = useState<LawyerProfile | null>(null);

  const { data: lawyers = [], isLoading, error } = useApprovedLawyers();

  const filteredLawyers = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return lawyers;
    return lawyers.filter(
      (l) =>
        l.full_name.toLowerCase().includes(term) ||
        l.specialization.toLowerCase().includes(term) ||
        l.city.toLowerCase().includes(term)
    );
  }, [lawyers, search]);

  const openRequest = (lawyer: LawyerProfile) => {
    setSelectedLawyer(lawyer);
    setRequestOpen(true);
  };

  const openChat = (lawyer: LawyerProfile) => {
    if (!isLoggedIn || !user) {
      toast.error("Please log in to message a lawyer.", {
        action: { label: "Login", onClick: () => navigate("/login") },
      });
      return;
    }
    setChatLawyer(lawyer);
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/70 to-background py-10">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Find a Lawyer</h1>
          <p className="mt-3 text-muted-foreground">
            Connect with approved lawyers for women-focused legal support in Pakistan.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="rounded-xl">
              <Link to="/lawyer-portal">Are you a Lawyer?</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mb-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, city, or specialization"
              className="rounded-xl border-primary/20 bg-white pl-10"
            />
          </div>
        </div>

        {isLoading && <p className="text-center text-sm text-muted-foreground">Loading lawyers...</p>}
        {error && (
          <p className="text-center text-sm text-destructive">
            Could not load lawyers. Please verify Supabase configuration.
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLawyers.map((lawyer) => (
            <LawyerCard
              key={lawyer.id}
              lawyer={lawyer}
              onRequestHelp={openRequest}
              onMessage={openChat}
            />
          ))}
        </div>

        {!isLoading && !filteredLawyers.length && (
          <p className="py-10 text-center text-sm text-muted-foreground">No approved lawyers found.</p>
        )}
      </div>

      <RequestHelpDialog
        open={requestOpen}
        selectedLawyer={selectedLawyer}
        onOpenChange={(open) => {
          setRequestOpen(open);
          if (!open) setSelectedLawyer(null);
        }}
      />

      {chatLawyer && user && (
        <ChatWindow
          open={chatOpen}
          onOpenChange={(open) => {
            setChatOpen(open);
            if (!open) setChatLawyer(null);
          }}
          lawyerId={chatLawyer.id}
          lawyerName={chatLawyer.full_name}
          clientId={user.id}
          clientName={user.name || user.email}
          currentUserId={user.id}
          currentUserName={user.name || user.email}
        />
      )}
    </div>
  );
}
