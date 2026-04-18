import { Briefcase, MapPin, UserCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { LawyerProfile } from "@/types/lawyers";

interface LawyerCardProps {
  lawyer: LawyerProfile;
  onRequestHelp: (lawyer: LawyerProfile) => void;
  onMessage: (lawyer: LawyerProfile) => void;
}

export function LawyerCard({ lawyer, onRequestHelp, onMessage }: LawyerCardProps) {
  return (
    <Card className="rounded-2xl border-primary/10 bg-card shadow-sm transition-shadow hover:shadow-md flex flex-col">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 flex-shrink-0 rounded-full overflow-hidden border-2 border-primary/20 bg-muted flex items-center justify-center">
            {lawyer.photo_url ? (
              <img
                src={lawyer.photo_url}
                alt={lawyer.full_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserCircle2 className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-base leading-tight">{lawyer.full_name}</h3>
            <p className="text-sm text-muted-foreground">{lawyer.specialization}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
          <span>{lawyer.city}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4 text-primary flex-shrink-0" />
          <span>{lawyer.experience_years} years experience</span>
        </div>
        <p className="line-clamp-3 text-sm text-foreground/80 flex-1">{lawyer.bio}</p>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            className="rounded-xl"
            onClick={() => onRequestHelp(lawyer)}
          >
            Request Help
          </Button>
          <Button
            variant="outline"
            className="rounded-xl gap-1.5"
            onClick={() => onMessage(lawyer)}
          >
            <MessageCircle className="h-4 w-4" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
