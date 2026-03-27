import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LawyerCard } from "@/components/lawyers/LawyerCard";
import { RequestHelpDialog } from "@/components/lawyers/RequestHelpDialog";
import { useApprovedLawyers } from "@/hooks/use-lawyer-directory";
import type { LawyerProfile } from "@/types/lawyers";

export default function Lawyers() {
  const [search, setSearch] = useState("");
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerProfile | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const { data: lawyers = [], isLoading, error } = useApprovedLawyers();

  const filteredLawyers = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return lawyers;
    return lawyers.filter(
      (lawyer) =>
        lawyer.full_name.toLowerCase().includes(term) ||
        lawyer.specialization.toLowerCase().includes(term) ||
        lawyer.city.toLowerCase().includes(term)
    );
  }, [lawyers, search]);

  const openRequest = (lawyer: LawyerProfile) => {
    setSelectedLawyer(lawyer);
    setRequestOpen(true);
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
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, city, or specialization"
              className="rounded-xl border-primary/20 bg-white pl-10"
            />
          </div>
        </div>

        {isLoading ? <p className="text-center text-sm text-muted-foreground">Loading lawyers...</p> : null}
        {error ? (
          <p className="text-center text-sm text-destructive">
            Could not load lawyers. Please verify Supabase configuration.
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLawyers.map((lawyer) => (
            <LawyerCard key={lawyer.id} lawyer={lawyer} onRequestHelp={openRequest} />
          ))}
        </div>

        {!isLoading && !filteredLawyers.length ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No approved lawyers found.</p>
        ) : null}
      </div>

      <RequestHelpDialog
        open={requestOpen}
        selectedLawyer={selectedLawyer}
        onOpenChange={(open) => {
          setRequestOpen(open);
          if (!open) setSelectedLawyer(null);
        }}
      />
    </div>
  );
}
