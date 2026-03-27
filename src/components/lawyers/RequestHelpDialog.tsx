import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateServiceRequest } from "@/hooks/use-lawyer-directory";
import type { LawyerProfile } from "@/types/lawyers";

interface RequestHelpDialogProps {
  open: boolean;
  selectedLawyer: LawyerProfile | null;
  onOpenChange: (open: boolean) => void;
}

export function RequestHelpDialog({ open, selectedLawyer, onOpenChange }: RequestHelpDialogProps) {
  const [issueDescription, setIssueDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const createRequest = useCreateServiceRequest();

  const resetForm = () => {
    setIssueDescription("");
    setPhone("");
    setEmail("");
  };

  const handleSubmit = async () => {
    if (!selectedLawyer) return;
    if (!issueDescription.trim()) {
      toast.error("Issue description is required.");
      return;
    }

    try {
      await createRequest.mutateAsync({
        lawyer_id: selectedLawyer.id,
        issue_description: issueDescription.trim(),
        phone: phone || undefined,
        email: email || undefined,
      });
      toast.success("Your request has been submitted.");
      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit request.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Request Help</DialogTitle>
          <DialogDescription>
            Send your legal issue to {selectedLawyer?.full_name || "this lawyer"}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Describe your issue..."
            value={issueDescription}
            onChange={(event) => setIssueDescription(event.target.value)}
            rows={5}
          />
          <Input
            placeholder="Phone (optional)"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <Input
            placeholder="Email (optional)"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button className="w-full rounded-xl" onClick={handleSubmit} disabled={createRequest.isPending}>
            {createRequest.isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
