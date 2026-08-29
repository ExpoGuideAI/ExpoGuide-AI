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
import { useToast } from "@/hooks/use-toast";

export function Chat() {
  const { t, isRtl } = useI18n();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [chatError, setChatError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isStartingConversation, setIsStartingConversation] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { data: conversations, isLoading: loadingConvs } = useListGeminiConversations();
  const { data: activeConv, isLoading: loadingConv } = useGetGeminiConversation(activeConvId!, {
    query: { 
      enabled: !!activeConvId,
      queryKey: getGetGeminiConversationQueryKey(activeConvId!)
    }
  });
  
  const createConv = useCreateGeminiConversation();
  const deleteConv = useDeleteGeminiConversation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConv?.messages, streamingMessage]);

  const createConversation = async () => {
    // The conversation must exist in the database before it becomes active.
    // mutateAsync makes failures catchable instead of silently locking the UI.
    const conv = await createConv.mutateAsync({
      data: { title: t("New Conversation", "محادثة جديدة") }
    });

    queryClient.invalidateQueries({ queryKey: getListGeminiConversationsQueryKey() });
    queryClient.setQueryData(getGetGeminiConversationQueryKey(conv.id), {
      ...conv,
      messages: [],
    });
    setActiveConvId(conv.id);
    return conv;
  };

  const handleNewChat = async () => {
    if (createConv.isPending || isStartingConversation) return;

    setChatError(null);
    try {
      setIsStartingConversation(true);
      await createConversation();
      setMessage("");
      setStreamingMessage("");
      setChatError(null);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast({
        variant: "destructive",
        title: t("Could not start chat", "تعذر بدء المحادثة"),
        description: t("Please try again.", "يرجى المحاولة مرة أخرى."),
      });
    } finally {
      setIsStartingConversation(false);
    }
  };

  const handleDeleteChat = (id: number) => {
    deleteConv.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGeminiConversationsQueryKey() });
          if (activeConvId === id) setActiveConvId(null);
        },
        onError: (error) => {
          console.error("Failed to delete conversation:", error);
          toast({
            variant: "destructive",
            title: t("Could not delete chat", "تعذر حذف المحادثة"),
            description: t("Please try again.", "يرجى المحاولة مرة أخرى."),
          });
        }
      }
    );
  };

  const handleSelectConversation = (id: number) => {
    setActiveConvId(id);
    setMessage("");
    setStreamingMessage("");
    setChatError(null);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isStreaming || isStartingConversation || createConv.isPending) return;

    const userMessage = message.trim();
    setMessage("");
    setStreamingMessage("");
    setChatError(null);
    let conversationId = activeConvId;
    const hadNoActiveConversation = !conversationId;

    try {
      // Allow sending directly from the empty state. Create the conversation
      // first, then continue with the same message and returned ID.
      if (!conversationId) {
        setIsStartingConversation(true);
        const conv = await createConversation();
        conversationId = conv.id;
      }

      setIsStreaming(true);

      const tempUserMsg = {
        id: -1,
        conversationId,
        role: "user",
        content: userMessage,
        createdAt: new Date().toISOString()
      };
      queryClient.setQueryData(getGetGeminiConversationQueryKey(conversationId), (old: any) => {
        if (!old) return old;
        return { ...old, messages: [...old.messages, tempUserMsg] };
      });

      abortControllerRef.current = new AbortController();
      const response = await fetch(`/api/gemini/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessage }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        let serverMessage = "";
        try {
          const errorBody = await response.json();
          serverMessage = typeof errorBody?.error === "string" ? errorBody.error : "";
        } catch {
          // The response may not be JSON (for example, a proxy error page).
        }
        throw new Error(serverMessage || `Request failed with status ${response.status}`);
      }

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
            let parsed: any;
            try {
              parsed = JSON.parse(data);
            } catch (e) {
              console.error("Failed to parse SSE chunk:", data);
              continue;
            }
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.content) {
              fullResponse += parsed.content;
              setStreamingMessage(fullResponse);
            }
            if (parsed.done) {
              queryClient.invalidateQueries({ queryKey: getGetGeminiConversationQueryKey(conversationId) });
              break;
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Stream aborted");
      } else {
        console.error("Stream error:", err);
        if (conversationId) {
          queryClient.invalidateQueries({ queryKey: getGetGeminiConversationQueryKey(conversationId) });
        }
        setChatError(
          t(
            "Sorry, I couldn't get an AI response. Please try again.",
            "عذراً، تعذر الحصول على رد من الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.",
          ),
        );
        toast({
          variant: "destructive",
          title: t("Message failed", "تعذر إرسال الرسالة"),
          description: t("Please try again.", "يرجى المحاولة مرة أخرى."),
        });
      }
    } finally {
      // Always release the input, including when the stream closes without a
      // final `done` event or the request fails.
      setIsStreaming(false);
      setStreamingMessage("");
      abortControllerRef.current = null;
      setIsStartingConversation(false);
      if (hadNoActiveConversation && !conversationId) {
        setMessage(userMessage);
      }
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
  if (chatError) {
    allMessages.push({
      id: -3,
      conversationId: activeConvId!,
      role: "assistant",
      content: chatError,
      createdAt: new Date().toISOString()
    });
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] bg-gray-50/50" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-gray-100 p-4 flex flex-col gap-4 max-h-48 md:max-h-full overflow-y-auto shadow-[2px_0_15px_rgba(0,0,0,0.02)] z-10">
        <button 
          onClick={handleNewChat} 
          disabled={createConv.isPending}
          className="btn-gradient-green w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium hover:shadow-[0_4px_15px_rgba(0,108,53,0.3)] transition-shadow"
        >
          <Plus className="w-5 h-5" />
          {t("New Chat", "محادثة جديدة")}
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {loadingConvs ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))
          ) : conversations && conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              {t("No conversations yet.", "لا توجد محادثات بعد.")}
            </div>
          ) : (
            conversations?.map((conv) => (
              <div 
                key={conv.id}
                className={cn(
                  "p-3 rounded-xl cursor-pointer flex items-center justify-between gap-2 transition-colors group",
                  activeConvId === conv.id 
                    ? "bg-[#006C35]/10 text-[#006C35] font-medium" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                onClick={() => handleSelectConversation(conv.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="text-sm truncate">{conv.title}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-md"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white relative min-h-0">
        {!activeConvId ? (
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-8 text-center bg-white/50 backdrop-blur-sm z-10">
            <img src="/expo2030-logo.png" alt="Riyadh Expo 2030" className="h-20 w-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-gray-900">{t("ExpoGuide AI", "المرشد الذكي")}</h2>
            <p className="text-gray-500 max-w-md mb-8 text-lg">
              {t("Your intelligent companion at Riyadh Expo 2030. Ask me anything about pavilions, restaurants, events, or navigation.", "مرافقك الذكي في إكسبو الرياض 2030. اسألني عن أي شيء حول الأجنحة أو المطاعم أو الفعاليات أو التنقل.")}
            </p>
            {chatError && (
              <div className="mb-6 max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {chatError}
              </div>
            )}
            <button 
              onClick={handleNewChat} 
              disabled={isStartingConversation || createConv.isPending}
              className="btn-gradient-green px-8 py-3 rounded-full flex items-center gap-2 font-medium text-lg hover:shadow-[0_8px_25px_rgba(0,108,53,0.3)] transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              {t("Start Your Journey", "ابدأ رحلتك")}
            </button>
          </div>
        ) : loadingConv ? (
          <div className="flex-1 min-h-0 p-6 space-y-4 overflow-y-auto z-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={cn("flex gap-3", i % 2 === 0 ? "justify-end" : "justify-start")}>
                <Skeleton className="h-16 w-3/4 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="flex-1 min-h-0 p-4 md:p-6 pb-28 z-10" ref={scrollRef}>
            <div className="space-y-6 max-w-4xl mx-auto">
              {allMessages.length === 0 && (
                <div className="text-center py-12 text-gray-400">
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
                      <div className="w-10 h-10 rounded-full gradient-nature flex items-center justify-center shrink-0 shadow-sm mt-auto">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div 
                      className={cn(
                        "px-5 py-3.5 rounded-2xl max-w-[80%] break-words shadow-sm text-[15px] leading-relaxed",
                        msg.role === "user" 
                          ? "gradient-nature text-white rounded-br-sm" 
                          : "bg-white border-l-4 border-l-[#006C35] text-gray-800 rounded-bl-sm"
                      )}
                    >
                      <div className="prose prose-sm max-w-none">
                        {msg.content}
                      </div>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 mt-auto">
                        <div className="text-sm font-bold text-gray-500">U</div>
                      </div>
                    )}
                  </motion.div>
              ))}
            </div>
          </ScrollArea>

        )}

        {/* Input is always available, including before a conversation exists. */}
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-80 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 z-30">
          <div className="max-w-4xl mx-auto flex gap-3 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t("Ask me anything about Expo 2030...", "اسألني أي شيء عن إكسبو 2030...")}
              className="flex-1 bg-white border-gray-200 rounded-full pl-5 pr-14 py-6 shadow-sm text-base focus-visible:ring-[#006C35] focus-visible:border-[#006C35]"
              disabled={isStreaming || isStartingConversation}
              aria-busy={isStreaming || isStartingConversation}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isStreaming || isStartingConversation}
              className="absolute right-2 top-2 bottom-2 aspect-square rounded-full btn-gradient-green flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-shadow"
              style={{ right: isRtl ? 'auto' : '0.5rem', left: isRtl ? '0.5rem' : 'auto' }}
            >
              <Send className={cn("w-4 h-4", isRtl && "rotate-180")} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
