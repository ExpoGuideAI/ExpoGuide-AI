import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { 
  useListGeminiConversations, 
  useCreateGeminiConversation, 
  useDeleteGeminiConversation,
  useGetGeminiConversation,
  getListGeminiConversationsQueryKey,
  getGetGeminiConversationQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Plus, Sparkles, Trash, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function Chat() {
  const { t, isRtl } = useI18n();
  const queryClient = useQueryClient();

  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { data: conversations, isLoading: loadingConvs } = useListGeminiConversations();
  const { data: activeConv, isLoading: loadingConv } = useGetGeminiConversation(activeConvId!, {
    query: { 
      enabled: !!activeConvId,
      queryKey: activeConvId ? getGetGeminiConversationQueryKey(activeConvId) : undefined
    }
  });
  
  const createConv = useCreateGeminiConversation();
  const deleteConv = useDeleteGeminiConversation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConv?.messages, streamingMessage]);

  const handleNewChat = () => {
    createConv.mutate(
      { data: { title: t("New Conversation", "محادثة جديدة") } },
      {
        onSuccess: (conv) => {
          queryClient.invalidateQueries({ queryKey: getListGeminiConversationsQueryKey() });
          setActiveConvId(conv.id);
        }
      }
    );
  };

  const handleDeleteChat = (id: number) => {
    deleteConv.mutate(
      { data: { id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGeminiConversationsQueryKey() });
          if (activeConvId === id) setActiveConvId(null);
        }
      }
    );
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeConvId || isStreaming) return;

    const userMessage = message.trim();
    setMessage("");
    setStreamingMessage("");
    setIsStreaming(true);

    // Optimistically add user message to UI (we won't have the DB id yet, but we show it)
    const tempUserMsg = { id: -1, conversationId: activeConvId, role: "user", content: userMessage, createdAt: new Date().toISOString() };
    queryClient.setQueryData(getGetGeminiConversationQueryKey(activeConvId), (old: any) => {
      if (!old) return old;
      return { ...old, messages: [...old.messages, tempUserMsg] };
    });

    try {
      abortControllerRef.current = new AbortController();
      const response = await fetch(`/api/gemini/conversations/${activeConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessage }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream reader");

      const decoder = new TextDecoder();
      let buffer = "";
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullResponse += parsed.content;
                setStreamingMessage(fullResponse);
              }
              if (parsed.done) {
                // Stream completed, refetch conversation to get final DB messages
                queryClient.invalidateQueries({ queryKey: getGetGeminiConversationQueryKey(activeConvId) });
                setStreamingMessage("");
                setIsStreaming(false);
                return;
              }
            } catch (e) {
              console.error("Failed to parse SSE chunk:", data);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Stream aborted");
      } else {
        console.error("Stream error:", err);
      }
      setIsStreaming(false);
      setStreamingMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const allMessages = [...(activeConv?.messages || [])];
  if (streamingMessage) {
    allMessages.push({
      id: -2,
      conversationId: activeConvId!,
      role: "assistant",
      content: streamingMessage,
      createdAt: new Date().toISOString()
    });
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Sidebar */}
      <div className="w-full md:w-80 glass-panel border-r border-white/5 p-4 flex flex-col gap-4 max-h-48 md:max-h-full overflow-y-auto">
        <Button 
          onClick={handleNewChat} 
          variant="gradient" 
          className="w-full rounded-xl flex items-center gap-2"
          disabled={createConv.isPending}
        >
          <Plus className="w-5 h-5" />
          {t("New Chat", "محادثة جديدة")}
        </Button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {loadingConvs ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))
          ) : conversations && conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {t("No conversations yet.", "لا توجد محادثات بعد.")}
            </div>
          ) : (
            conversations?.map((conv) => (
              <div 
                key={conv.id}
                className={cn(
                  "p-3 rounded-xl cursor-pointer flex items-center justify-between gap-2 transition-colors group",
                  activeConvId === conv.id ? "bg-white/10 text-white" : "text-muted-foreground hover:bg-white/5"
                )}
                onClick={() => setActiveConvId(conv.id)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="text-sm truncate">{conv.title}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                >
                  <Trash className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {!activeConvId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-expo-teal to-expo-blue flex items-center justify-center mb-6 shadow-2xl shadow-expo-teal/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">{t("ExpoGuide AI", "خريطة الذكاء الاصطناعي")}</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              {t("Your intelligent companion at Riyadh Expo 2030. Ask me anything about pavilions, restaurants, events, or navigation.", "مرافقك الذكي في إكسبو الرياض 2030. اسألني عن أي شيء حول الأجنحة أو المطاعم أو الفعاليات أو التنقل.")}
            </p>
            <Button variant="gradient" onClick={handleNewChat} className="rounded-2xl px-8">
              <Plus className="w-5 h-5 mr-2" />
              {t("Start Your Journey", "ابدأ رحلتك")}
            </Button>
          </div>
        ) : loadingConv ? (
          <div className="flex-1 p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={cn("flex gap-3", i % 2 === 0 ? "justify-end" : "justify-start")}>
                <Skeleton className="h-16 w-3/4 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
              <div className="space-y-4 max-w-4xl mx-auto">
                {allMessages.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    {t("Send a message to start the conversation.", "أرسل رسالة لبدء المحادثة.")}
                  </div>
                )}
                {allMessages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "flex gap-3",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-expo-teal to-expo-blue flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div 
                      className={cn(
                        "px-5 py-3 rounded-2xl max-w-[80%] break-words",
                        msg.role === "user" 
                          ? "bg-gradient-to-r from-expo-green to-expo-teal text-white" 
                          : "glass-panel text-white"
                      )}
                    >
                      <div className="prose prose-invert prose-sm max-w-none">
                        {msg.content}
                      </div>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <div className="text-sm font-bold text-white">U</div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 glass-panel border-t border-white/5">
              <div className="max-w-4xl mx-auto flex gap-3">
                <Input 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={t("Ask me anything about Expo 2030...", "اسألني أي شيء عن إكسبو 2030...")}
                  className="flex-1 bg-white/5 border-white/10 rounded-2xl px-4"
                  disabled={isStreaming}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!message.trim() || isStreaming}
                  variant="gradient"
                  size="icon"
                  className="shrink-0 rounded-2xl w-12 h-12"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
