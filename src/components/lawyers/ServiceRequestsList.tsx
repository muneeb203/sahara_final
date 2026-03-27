import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ServiceRequest } from "@/types/lawyers";

interface ServiceRequestsListProps {
  requests: ServiceRequest[];
  onAccept?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  showActions?: boolean;
}

export function ServiceRequestsList({
  requests,
  onAccept,
  onReject,
  showActions = false,
}: ServiceRequestsListProps) {
  return (
    <Card className="rounded-2xl border-primary/10">
      <CardHeader>
        <CardTitle>Service Requests</CardTitle>
        <CardDescription>Review incoming legal assistance requests.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No requests yet.</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="rounded-xl border border-border p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <Badge variant="secondary" className="capitalize">
                  {request.status}
                </Badge>
              </div>
              <p className="mb-3 text-sm">{request.issue_description}</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                {request.phone ? <p>Phone: {request.phone}</p> : null}
                {request.email ? <p>Email: {request.email}</p> : null}
              </div>
              {showActions ? (
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => onAccept?.(request.id)}>
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onReject?.(request.id)}>
                    Reject
                  </Button>
                </div>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
