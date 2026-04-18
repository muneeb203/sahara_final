import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, UserCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Message, Conversation } from "@/types/lawyers";

interface ChatWindowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lawyerId: string;
  lawyerName: string;
  clientId: string;
  clientName: string;
  currentUserId: string;
  currentUserName: string;
  readOnly?: boolean; // admin view — no input shown
}

export function ChatWindow({
  open,
  onOpenChange,
  lawyerId,
  lawyerName,
  clientId,
  clientName,
  currentUserId,
  currentUserName,
  readOnly = false,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isLawyer = currentUserId === lawyerId;

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get or create conversation, then load messages
  useEffect(() => {
    if (!open) return;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const init = async () => {
      setLoading(true);

      // Upsert conversation
      const { data: conv, error: convErr } = await supabase
        .from("conversations")
        .upsert(
          { lawyer_id: lawyerId, client_id: clientId, client_name: clientName },
          { onConflict: "lawyer_id,client_id", ignoreDuplicates: false }
        )
        .select("id")
        .single();

      if (convErr || !conv) {
        // If upsert fails (duplicate), just fetch existing
        const { data: existing } = await supabase
          .from("conversations")
          .select("id")
          .eq("lawyer_id", lawyerId)
          .eq("client_id", clientId)
          .single();

        if (!existing) {
          toast.error("Could not open conversation.");
          setLoading(false);
          return;
        }
        setConversationId(existing.id);
        await loadMessages(existing.id);
        channel = subscribeToMessages(existing.id);
      } else {
        setConversationId(conv.id);
        await loadMessages(conv.id);
        channel = subscribeToMessages(conv.id);
      }

      setLoading(false);
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
      setMessages([]);
      setConversationId(null);
    };
  }, [open, lawyerId, clientId]);

  const loadMessages = async (convId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });

    if (!error && data) setMessages(data as Message[]);
  };

  const subscribeToMessages = (convId: string) => {
    const channel = supabase
      .channel(`chat:${convId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${convId}`,
        },
        (payload) => {
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.find((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new as Message];
          });
        }
      )
      .subscribe();

    return channel;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !conversationId || sending) return;

    setSending(true);
    setInput("");

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      sender_name: currentUserName,
      content: text,
    });

    if (error) {
      toast.error("Failed to send message.");
      setInput(text); // restore
    } else {
      // Update last_message on conversation
      await supabase
        .from("conversations")
        .update({ last_message: text, last_message_at: new Date().toISOString() })
        .eq("id", conversationId);
    }

    setSending(false);
  };

  const otherName = isLawyer ? clientName : lawyerName;

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });

  // Group messages by date
  let lastDate = "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-md"
      >
        {/* Header */}
        <SheetHeader className="flex-shrink-0 border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 bg-primary/10">
              <AvatarFallback className="text-primary font-semibold text-sm">
                {otherName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-base leading-tight">
                {readOnly ? `${clientName} ↔ ${lawyerName}` : otherName}
              </SheetTitle>
              <p className="text-xs text-muted-foreground">
                {readOnly ? "Admin view" : isLawyer ? "Client" : "Lawyer"}
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {loading && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="flex flex-col h-full items-center justify-center text-center gap-2">
              <UserCircle2 className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No messages yet. Say hello!
              </p>
            </div>
          )}

          {messages.map((msg) => {
            const isMine = msg.sender_id === currentUserId;
            const msgDate = formatDate(msg.created_at);
            const showDate = msgDate !== lastDate;
            lastDate = msgDate;

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex justify-center my-3">
                    <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
                      {msgDate}
                    </span>
                  </div>
                )}
                <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                      isMine
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p className="leading-relaxed break-words">{msg.content}</p>
                    <span
                      className={`text-[10px] mt-0.5 block ${
                        isMine ? "text-primary-foreground/70 text-right" : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input — hidden for admin read-only view */}
        {readOnly ? (
          <div className="flex-shrink-0 border-t bg-muted/40 px-4 py-3 text-center">
            <p className="text-xs text-muted-foreground">👁 Admin view — read only</p>
          </div>
        ) : (
          <div className="flex-shrink-0 border-t bg-background px-4 py-3">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                disabled={loading || sending}
                className="rounded-xl"
                autoComplete="off"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || loading || sending}
                className="rounded-xl flex-shrink-0"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
