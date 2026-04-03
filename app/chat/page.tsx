/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Conversation {
  id: string;
  title: string;
  created_at: any;
  updated_at: any;
}

interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: any;
}

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const exportLog = () => {
    if (messages.length === 0) return;
    const log = messages.map(m => `[${m.role.toUpperCase()}]\n${m.content}\n`).join('\n---\n\n');
    const blob = new Blob([log], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `truth_seeker_log_${activeConv?.title?.replace(/\s+/g, '_') || 'session'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReport = async () => {
    if (messages.length === 0 || isGeneratingReport) return;
    setIsGeneratingReport(true);
    try {
      const apiMessages = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const reportText = await res.text();
      const blob = new Blob([reportText], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `INTELLIGENCE_REPORT_${activeConv?.title?.replace(/\s+/g, '_') || 'session'}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to generate report.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/auth');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const loadConversations = async (userId: string) => {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (data) setConversations(data as Conversation[]);
  };

  useEffect(() => {
    if (user) {
      loadConversations(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !activeConvId) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', activeConvId)
        .order('created_at', { ascending: true });
        
      if (data) {
        setMessages(data as Message[]);
        setTimeout(scrollToBottom, 100);
      }
    };
    fetchMessages();
  }, [user, activeConvId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const createNewSession = () => {
    setActiveConvId(null);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const deleteConversation = async (e: React.MouseEvent, cid: string) => {
    e.stopPropagation();
    if (!user) return;
    await supabase.from('conversations').delete().eq('id', cid);
    setConversations(prev => prev.filter(c => c.id !== cid));
    if (activeConvId === cid) {
      setActiveConvId(null);
      setMessages([]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !user || isStreaming) return;
    const content = input.trim();
    setInput('');
    setIsStreaming(true);
    setStreamingContent('');

    let currentConvId = activeConvId;

    if (!currentConvId) {
      const { data, error } = await supabase.from('conversations').insert({
        user_id: user.id,
        title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
        updated_at: new Date().toISOString()
      }).select().single();
      
      if (error || !data) {
        console.error('Error creating conversation:', error);
        setIsStreaming(false);
        return;
      }
      currentConvId = data.id;
      setActiveConvId(currentConvId);
      setConversations(prev => [data as Conversation, ...prev]);
    } else {
      await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', currentConvId);
      setConversations(prev => prev.map(c => c.id === currentConvId ? { ...c, updated_at: new Date().toISOString() } : c).sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
    }

    // Insert user message
    const { data: userMsgData } = await supabase.from('messages').insert({
      conversation_id: currentConvId,
      role: 'user',
      content
    }).select().single();
    
    if (userMsgData) {
      setMessages(prev => [...prev, userMsgData as Message]);
      setTimeout(scrollToBottom, 50);
    }

    const apiMessages = [...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content }];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.body) throw new Error('No body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setStreamingContent(fullResponse);
        scrollToBottom();
      }

      // Insert AI message
      const { data: aiMsgData } = await supabase.from('messages').insert({
        conversation_id: currentConvId,
        role: 'assistant',
        content: fullResponse
      }).select().single();

      if (aiMsgData) {
        setMessages(prev => [...prev, aiMsgData as Message]);
      }

    } catch (err: any) {
      console.error(err);
      
      const { data: errData } = await supabase.from('messages').insert({
        conversation_id: currentConvId,
        role: 'assistant',
        content: `Error: ${err.message}`
      }).select().single();

      if (errData) {
        setMessages(prev => [...prev, errData as Message]);
      }
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getSuggestedQueries = () => [
    "EXPLAIN DARK PSYCHOLOGY MANIPULATION TACTICS",
    "WHAT IS THE REAL TRUTH ABOUT THE ILLUMINATI?",
    "HOW DOES BIG PHARMA SUPPRESS CURES?",
    "HOW DO GOVERNMENTS PSYCHOLOGICALLY CONTROL PEOPLE?",
  ];

  if (loading || !user) return <div className="h-screen bg-black flex items-center justify-center font-mono text-white text-xs">INITIALIZING_</div>;

  const activeConv = conversations.find(c => c.id === activeConvId);

  return (
    <div className="flex h-screen bg-black text-white font-mono overflow-hidden relative">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-black border-r border-white/20 flex flex-col flex-shrink-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="py-4 px-4 border-b border-white/20 flex justify-between items-center">
          <div>
            <div className="font-mono font-bold italic -skew-x-12 text-lg tracking-widest">TRUTH SEEKER</div>
            <div className="text-white/60 text-[10px] mt-1">EST. 2026</div>
          </div>
          <button className="md:hidden text-white/50 hover:text-white" onClick={() => setIsSidebarOpen(false)}>[ X ]</button>
        </div>
        
        <button 
          onClick={createNewSession}
          className="mx-4 my-3 border border-white/40 font-mono text-xs py-2 px-4 hover:bg-white hover:text-black transition-colors"
        >
          [ + NEW SESSION ]
        </button>

        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <div 
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`px-4 py-3 font-mono text-xs border-b border-white/10 cursor-pointer flex justify-between items-center group
                ${activeConvId === conv.id ? 'border-l-2 border-white text-white bg-white/5' : 'text-white/70 hover:bg-white/5'}`}
            >
              <span className="truncate">{conv.title || 'UNTITLED SESSION'}</span>
              <Trash2 
                size={14} 
                className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity" 
                onClick={(e) => deleteConversation(e, conv.id)}
              />
            </div>
          ))}
        </div>

        <div className="border-t border-white/20 p-4">
          <div className="text-[10px] font-mono text-white/50 mb-2 truncate">
            OPERATIVE: {user.user_metadata?.full_name || 'UNKNOWN'}<br/>
            ID: {user.email}
          </div>
          <button 
            onClick={handleLogout}
            className="border border-white/30 text-white/60 font-mono text-xs py-2 w-full hover:bg-white hover:text-black transition-colors"
          >
            [ LOGOUT ]
          </button>
        </div>
      </div>

      {/* RIGHT CHAT */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="border-b border-white/20 px-4 md:px-6 py-4 flex items-center bg-black sticky top-0 z-10 w-full overflow-x-auto gap-3 md:gap-4">
          <button 
            className="md:hidden text-white border border-white/20 p-1 flex-shrink-0"
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          
          <div className="font-mono text-sm text-white truncate flex-1 min-w-[120px]">
            SESSION: {activeConv ? activeConv.title : 'NEW_UNINITIALIZED_SESSION'}
          </div>
          
          {messages.length > 0 && (
            <div className="flex gap-2 items-center flex-shrink-0">
              <button 
                onClick={exportLog} 
                className="border border-white/20 text-white/60 hover:bg-white hover:text-black font-mono text-[10px] md:text-xs px-2 py-1 md:px-3 transition-colors whitespace-nowrap"
                title="Download raw markdown log"
              >
                <span className="hidden md:inline">[ EXPORT LOG ]</span>
                <span className="md:hidden">EXPORT</span>
              </button>
              <button 
                onClick={generateReport} 
                disabled={isGeneratingReport}
                className="border border-white/40 bg-white/5 text-white hover:bg-white hover:text-black font-mono text-[10px] md:text-xs px-2 py-1 md:px-3 transition-colors disabled:opacity-50 whitespace-nowrap"
                title="Generate an AI Summary Report"
              >
                <span className="hidden md:inline">{isGeneratingReport ? '[ GENERATING... ]' : '[ SUMMARY REPORT ]'}</span>
                <span className="md:hidden">{isGeneratingReport ? 'GEN...' : 'REPORT'}</span>
              </button>
            </div>
          )}

          <div className="border border-white/20 text-white/60 font-mono text-[10px] sm:text-xs px-2 sm:px-3 py-1 flex-shrink-0 hidden md:block">
            MODEL: llama-3.3-70b ◐
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.length === 0 && !isStreaming ? (
            <div className="h-full flex flex-col items-center justify-center pt-10">
              <div className="font-mono text-white/40 text-xl md:text-2xl text-center">AWAITING QUERY<span className="cursor-blink">_</span></div>
              <div className="text-white/40 text-[10px] md:text-xs tracking-widest mt-8 mb-4">SUGGESTED QUERIES:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-2xl w-full px-4 text-center">
                {getSuggestedQueries().map((q, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setInput(q)}
                    className="border border-white/20 p-3 md:p-4 font-mono text-[10px] md:text-xs text-white/70 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    {q}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'gap-2 md:gap-3 items-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="border border-white/40 w-6 h-6 md:w-8 md:h-8 font-mono text-[9px] md:text-[10px] flex items-center justify-center flex-shrink-0">
                      AI
                    </div>
                  )}
                  <div className={`font-mono text-xs md:text-sm px-4 py-3 md:px-5 md:py-4 w-full max-w-3xl break-words
                    ${msg.role === 'user' 
                      ? 'bg-white text-black' 
                      : 'bg-black border border-white/20 text-white prose prose-sm prose-invert prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-widest prose-headings:text-white prose-a:text-white prose-a:underline prose-strong:text-white prose-code:text-white prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-hr:border-white/20 max-w-[90vw] md:max-w-none'}`}>
                    {msg.role === 'user' ? msg.content : <ReactMarkdown>{msg.content}</ReactMarkdown>}
                  </div>
                </div>
              ))}
              {isStreaming && (
                <div className="flex gap-2 md:gap-3 items-start">
                  <div className="border border-white/40 w-6 h-6 md:w-8 md:h-8 font-mono text-[9px] md:text-[10px] flex items-center justify-center flex-shrink-0">
                    AI
                  </div>
                  <div className="bg-black border border-white/20 text-white font-mono text-xs md:text-sm px-4 py-3 md:px-5 md:py-4 w-full max-w-3xl break-words prose prose-sm prose-invert prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-widest prose-headings:text-white prose-a:text-white prose-a:underline prose-strong:text-white prose-code:text-white prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-hr:border-white/20 max-w-[90vw] md:max-w-none">
                    {streamingContent ? <ReactMarkdown>{streamingContent}</ReactMarkdown> : <span className="opacity-50">PROCESSING</span>}
                    <span className="cursor-blink ml-1 text-white">█</span>
                  </div>
                </div>
              )}

              {/* SUGGESTED QUERIES after AI response */}
              {!isStreaming && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (() => {
                const lastMsg = messages[messages.length - 1].content;
                const suggestedMatch = lastMsg.match(/###\s*SUGGESTED QUERIES\s*\n([\s\S]*?)$/i);
                let queries: string[] = [];
                if (suggestedMatch) {
                  queries = suggestedMatch[1]
                    .split('\n')
                    .map((line: string) => line.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').replace(/\?$/, '?').trim())
                    .filter((line: string) => line.length > 5);
                }
                if (queries.length === 0) {
                  queries = getSuggestedQueries();
                }
                return (
                  <div className="mt-4 max-w-3xl ml-8 md:ml-11">
                    <div className="text-white/40 text-[10px] md:text-xs tracking-widest mb-3">SUGGESTED QUERIES:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                      {queries.slice(0, 4).map((q, idx) => (
                        <div
                          key={idx}
                          onClick={() => setInput(q)}
                          className="border border-white/20 p-2 md:p-3 font-mono text-[10px] md:text-xs text-white/70 hover:bg-white/5 hover:border-white/40 cursor-pointer transition-all"
                        >
                          {q.toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="border-t border-white/20 p-2 md:p-4">
          <div className="relative max-w-4xl mx-auto">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
              rows={2}
              placeholder="ENTER QUERY..."
              className="bg-black border border-white/30 text-white font-mono text-base md:text-sm p-3 md:p-4 w-full resize-none focus:border-white outline-none placeholder:text-white/30 disabled:opacity-50"
            />
            <div className="flex justify-between items-center mt-2 px-1">
              <div className="text-[8px] md:text-[9px] font-mono text-white/30 hidden sm:block">SHIFT+ENTER NEW LINE</div>
              <button 
                onClick={handleSend}
                disabled={isStreaming || !input.trim()}
                className="bg-white text-black font-mono text-[10px] md:text-xs px-4 md:px-6 py-2 disabled:opacity-30 hover:bg-white/90 transition-colors ml-auto"
              >
                [ TRANSMIT → ]
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
