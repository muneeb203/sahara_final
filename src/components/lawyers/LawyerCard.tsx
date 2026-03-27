import { Briefcase, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LawyerProfile } from "@/types/lawyers";

interface LawyerCardProps {
  lawyer: LawyerProfile;
  onRequestHelp: (lawyer: LawyerProfile) => void;
}

export function LawyerCard({ lawyer, onRequestHelp }: LawyerCardProps) {
  return (
    <Card className="rounded-2xl border-primary/10 bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg">{lawyer.full_name}</CardTitle>
        <p className="text-sm text-muted-foreground">{lawyer.specialization}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{lawyer.city}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4 text-primary" />
          <span>{lawyer.experience_years} years experience</span>
        </div>
        <p className="line-clamp-3 text-sm text-foreground/90">{lawyer.bio}</p>
        <Button className="w-full rounded-xl" onClick={() => onRequestHelp(lawyer)}>
          Request Help
        </Button>
      </CardContent>
    </Card>
  );
}
