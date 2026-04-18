import { useRef, useState } from "react";
import { Camera, Loader2, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { LawyerProfileInput } from "@/types/lawyers";

const BUCKET = "lawyersimages";

interface LawyerProfileFormProps {
  onSubmit: (values: LawyerProfileInput) => Promise<void>;
  isSubmitting?: boolean;
  lawyerId: string; // needed to name the file uniquely in storage
}

export function LawyerProfileForm({ onSubmit, isSubmitting, lawyerId }: LawyerProfileFormProps) {
  const [values, setValues] = useState<LawyerProfileInput>({
    full_name: "",
    specialization: "",
    city: "",
    experience_years: 0,
    bio: "",
    phone: "",
    photo_url: "",
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof LawyerProfileInput>(key: K, value: LawyerProfileInput[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size (max 2MB)
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB.");
      return;
    }

    // Show local preview immediately
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoUploading(true);

    const ext = file.name.split(".").pop();
    const filePath = `${lawyerId}/profile.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      toast.error("Failed to upload photo. Please try again.");
      setPhotoPreview(null);
      setPhotoUploading(false);
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    updateField("photo_url", data.publicUrl);
    setPhotoUploading(false);
    toast.success("Photo uploaded.");
  };

  const handleSubmit = async () => {
    if (!values.full_name || !values.specialization || !values.city) {
      toast.error("Please fill in all required fields.");
      return;
    }
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

        {/* Photo Upload */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="relative h-24 w-24 cursor-pointer rounded-full border-2 border-dashed border-primary/30 bg-muted flex items-center justify-center overflow-hidden hover:border-primary/60 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <UserCircle2 className="h-12 w-12 text-muted-foreground" />
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
              {photoUploading
                ? <Loader2 className="h-6 w-6 text-white animate-spin" />
                : <Camera className="h-6 w-6 text-white" />
              }
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {photoUploading ? "Uploading..." : "Click to upload profile photo (max 2MB)"}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        <Input
          placeholder="Full Name *"
          value={values.full_name}
          onChange={(e) => updateField("full_name", e.target.value)}
        />
        <Input
          placeholder="Specialization *"
          value={values.specialization}
          onChange={(e) => updateField("specialization", e.target.value)}
        />
        <Input
          placeholder="City *"
          value={values.city}
          onChange={(e) => updateField("city", e.target.value)}
        />
        <Input
          placeholder="Experience (years)"
          type="number"
          min={0}
          value={values.experience_years}
          onChange={(e) => updateField("experience_years", Number(e.target.value))}
        />
        <Textarea
          placeholder="Bio"
          rows={4}
          value={values.bio}
          onChange={(e) => updateField("bio", e.target.value)}
        />
        <Input
          placeholder="Phone (optional)"
          value={values.phone || ""}
          onChange={(e) => updateField("phone", e.target.value)}
        />
        <Button
          onClick={handleSubmit}
          className="w-full rounded-xl"
          disabled={isSubmitting || photoUploading}
        >
          {isSubmitting ? "Submitting..." : "Submit for Approval"}
        </Button>
      </CardContent>
    </Card>
  );
}
