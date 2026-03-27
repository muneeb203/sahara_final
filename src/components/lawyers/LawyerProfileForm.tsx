import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { LawyerProfileInput } from "@/types/lawyers";

interface LawyerProfileFormProps {
  onSubmit: (values: LawyerProfileInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function LawyerProfileForm({ onSubmit, isSubmitting }: LawyerProfileFormProps) {
  const [values, setValues] = useState<LawyerProfileInput>({
    full_name: "",
    specialization: "",
    city: "",
    experience_years: 0,
    bio: "",
    phone: "",
  });

  const updateField = <K extends keyof LawyerProfileInput>(key: K, value: LawyerProfileInput[K]) => {
    setValues((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = async () => {
    await onSubmit({
      ...values,
      phone: values.phone?.trim() || undefined,
      experience_years: Number(values.experience_years) || 0,
    });
  };

  return (
    <Card className="rounded-2xl border-primary/10">
      <CardHeader>
        <CardTitle>Create Your Lawyer Profile</CardTitle>
        <CardDescription>Submit your details for admin approval.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Full Name"
          value={values.full_name}
          onChange={(event) => updateField("full_name", event.target.value)}
        />
        <Input
          placeholder="Specialization"
          value={values.specialization}
          onChange={(event) => updateField("specialization", event.target.value)}
        />
        <Input placeholder="City" value={values.city} onChange={(event) => updateField("city", event.target.value)} />
        <Input
          placeholder="Experience (years)"
          type="number"
          min={0}
          value={values.experience_years}
          onChange={(event) => updateField("experience_years", Number(event.target.value))}
        />
        <Textarea placeholder="Bio" rows={4} value={values.bio} onChange={(event) => updateField("bio", event.target.value)} />
        <Input
          placeholder="Phone (optional)"
          value={values.phone || ""}
          onChange={(event) => updateField("phone", event.target.value)}
        />
        <Button onClick={handleSubmit} className="w-full rounded-xl" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit for Approval"}
        </Button>
      </CardContent>
    </Card>
  );
}
