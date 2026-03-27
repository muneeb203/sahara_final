import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type {
  LawyerProfile,
  LawyerProfileInput,
  RequestStatus,
  ServiceRequest,
  ServiceRequestInput,
} from "@/types/lawyers";

const LAWYERS_TABLE = import.meta.env.VITE_SUPABASE_LAWYERS_TABLE || "lawyers";
const SERVICE_REQUESTS_TABLE =
  import.meta.env.VITE_SUPABASE_SERVICE_REQUESTS_TABLE || "service_requests";

const QUERY_KEYS = {
  approvedLawyers: ["approved-lawyers"] as const,
  lawyerProfile: (userId: string) => ["lawyer-profile", userId] as const,
  lawyerRequests: (lawyerId: string) => ["lawyer-requests", lawyerId] as const,
  allRequests: ["all-service-requests"] as const,
  allLawyers: ["all-lawyer-profiles"] as const,
};

export function useApprovedLawyers() {
  return useQuery({
    queryKey: QUERY_KEYS.approvedLawyers,
    queryFn: async (): Promise<LawyerProfile[]> => {
      const { data, error } = await supabase
        .from(LAWYERS_TABLE)
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as LawyerProfile[]) || [];
    },
  });
}

export function useCreateServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ServiceRequestInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from(SERVICE_REQUESTS_TABLE)
        .insert({
          ...payload,
          status: "pending",
          user_id: user?.id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as ServiceRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allRequests });
    },
  });
}

export function useLawyerProfile(userId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.lawyerProfile(userId || "anonymous"),
    enabled: !!userId,
    queryFn: async (): Promise<LawyerProfile | null> => {
      const { data, error } = await supabase
        .from(LAWYERS_TABLE)
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      return (data as LawyerProfile | null) || null;
    },
  });
}

export function useUpsertLawyerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, profile }: { userId: string; profile: LawyerProfileInput }) => {
      const { data, error } = await supabase
        .from(LAWYERS_TABLE)
        .upsert(
          {
            id: userId,
            ...profile,
            status: "pending",
          },
          { onConflict: "id" }
        )
        .select()
        .single();

      if (error) throw error;
      return data as LawyerProfile;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.lawyerProfile(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allLawyers });
    },
  });
}

export function useLawyerRequests(lawyerId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.lawyerRequests(lawyerId || "none"),
    enabled: !!lawyerId,
    queryFn: async (): Promise<ServiceRequest[]> => {
      const { data, error } = await supabase
        .from(SERVICE_REQUESTS_TABLE)
        .select("*")
        .eq("lawyer_id", lawyerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as ServiceRequest[]) || [];
    },
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      status,
      lawyerId,
    }: {
      requestId: string;
      status: RequestStatus;
      lawyerId: string;
    }) => {
      const { data, error } = await supabase
        .from(SERVICE_REQUESTS_TABLE)
        .update({ status })
        .eq("id", requestId)
        .eq("lawyer_id", lawyerId)
        .select()
        .single();

      if (error) throw error;
      return data as ServiceRequest;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.lawyerRequests(variables.lawyerId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allRequests });
    },
  });
}

export function useAllLawyersForAdmin() {
  return useQuery({
    queryKey: QUERY_KEYS.allLawyers,
    queryFn: async (): Promise<LawyerProfile[]> => {
      const { data, error } = await supabase
        .from(LAWYERS_TABLE)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as LawyerProfile[]) || [];
    },
  });
}

export function useSetLawyerApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lawyerId, status }: { lawyerId: string; status: "approved" | "rejected" }) => {
      const { data, error } = await supabase
        .from(LAWYERS_TABLE)
        .update({ status })
        .eq("id", lawyerId)
        .select()
        .single();

      if (error) throw error;
      return data as LawyerProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allLawyers });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.approvedLawyers });
    },
  });
}

export function useAllRequestsForAdmin() {
  return useQuery({
    queryKey: QUERY_KEYS.allRequests,
    queryFn: async (): Promise<ServiceRequest[]> => {
      const { data, error } = await supabase
        .from(SERVICE_REQUESTS_TABLE)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as ServiceRequest[]) || [];
    },
  });
}
