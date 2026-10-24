import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { ChatMessage } from '../../types';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Sparkles, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck, 
  RotateCcw,
  HelpCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import { DisclaimerBadge } from '../common/DisclaimerBadge';
import { Link } from 'react-router-dom';

const SUGGESTED_PROMPTS = [
  "How do I prepare for a doctor consultation?",
  "Explain a verified healthcare service.",
  "Help me organize my symptoms for my doctor.",
  "What is the senior citizen expansion in Ayushman Bharat?",
  "Where can I find affordable medicines through Jan Aushadhi?"
];

const INITIAL_GREETING: ChatMessage = {
  id: 'msg-welcome',
  sender: 'assistant',
  text: `Namaste! I am your **SwasthyaSetu AI Healthcare Assistant**.\n\nI can help you:\n• Learn about verified Indian health schemes (Ayushman Bharat PM-JAY, eSanjeevani, Jan Aushadhi Kendras, Tele-MANAS)\n• Structure your symptoms and medical questions before you meet with a doctor\n• Guide you on telemedicine readiness\n\n*Important Safety Rule: I do not provide medical diagnoses or prescriptions. In case of life-threatening symptoms (e.g. chest pain, choking, severe stroke signs), emergency care via 108 or 112 must be sought immediately.*`,
  timestamp: new Date().toISOString(),
  citations: [
    {
      title: 'National Health Portal & eSanjeevani Guidelines',
      organization: 'MoHFW, Government of India',
      url: 'https://esanjeevani.mohfw.gov.in',
      sourceType: 'guideline'
    }
  ],
  suggestedPrompts: SUGGESTED_PROMPTS.slice(0, 3)
};

export const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('swasthya_chat_history');
    return saved ? JSON.parse(saved) : [INITIAL_GREETING];
  });
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('swasthya_chat_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await api.sendAssistantMessage(text);
      setMessages(prev => [...prev, response]);

      if (response.isEmergencyAlert) {
        setActiveEmergency(response);
      }
    } catch (err: unknown) {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text: `I encountered an unexpected connection issue. Please check your network or try again. In an emergency, please dial 108 or 112 immediately.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_GREETING]);
    localStorage.removeItem('swasthya_chat_history');
    setActiveEmergency(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[550px] bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
      
      {/* Chat Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-teal-200 shadow-inner">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold">SwasthyaSetu AI Assistant</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-xs text-teal-200">
              Verified Healthcare Schemes & Consultation Readiness • Safety Escalation Enabled
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetChat}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-teal-100 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p>
            <strong>Safety Guardrail:</strong> AI responses do not formulate clinical diagnoses. Serious/emergency symptoms automatically trigger urgent triage instructions.
          </p>
        </div>
        <DisclaimerBadge variant="guidance" />
      </div>

      {/* Urgent Warning Banner if triggered */}
      {activeEmergency && (
        <div className="bg-red-600 text-white p-3 px-4 flex items-center justify-between text-xs sm:text-sm animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span className="font-bold">URGENT SYMPTOM ESCALATION: Routine chat suspended for emergency safety. Call 108 or 112 immediately.</span>
          </div>
          <a
            href="tel:108"
            className="px-3 py-1 bg-white text-red-700 font-bold rounded-lg shadow text-xs hover:bg-red-50"
          >
            Dial 108 Now
          </a>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/60">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isEmergency = msg.isEmergencyAlert;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-sm ${
                  isUser
                    ? 'bg-teal-700 text-white'
                    : isEmergency
                    ? 'bg-red-600 text-white animate-bounce'
                    : 'bg-white text-teal-700 border border-teal-200'
                }`}
              >
                {isUser ? <UserIcon className="w-5 h-5" /> : isEmergency ? <AlertTriangle className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Body */}
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-subtle ${
                    isUser
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : isEmergency
                      ? 'bg-red-50 text-red-950 border-2 border-red-500 rounded-tl-none font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  {/* Text rendered with Markdown bullet support */}
                  <div className="whitespace-pre-wrap space-y-1">
                    {msg.text.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Direct Action Link inside AI message */}
                  {msg.actionPrompt && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80">
                      <Link
                        to={msg.actionPrompt.path}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                      >
                        <span>{msg.actionPrompt.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Sourced Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="bg-white/80 border border-slate-200 rounded-xl p-2.5 text-xs space-y-1.5">
                    <p className="font-semibold text-slate-700 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Information Sources</span>
                    </p>
                    <div className="space-y-1">
                      {msg.citations.map((cite, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px] text-slate-600">
                          <span className="truncate">{cite.title} ({cite.organization})</span>
                          {cite.url && (
                            <a
                              href={cite.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-700 hover:text-teal-900 inline-flex items-center gap-0.5 ml-2 font-medium"
                            >
                              <span>Official Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Prompts buttons */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedPrompts.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-left text-xs bg-white hover:bg-teal-50 text-teal-800 border border-teal-200/80 rounded-lg px-2.5 py-1.5 transition-all shadow-subtle hover:border-teal-400"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                <p className="text-[10px] text-slate-400 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-teal-200 flex items-center justify-center text-teal-600 shadow-sm">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-subtle flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
              <span className="text-xs text-slate-600 font-medium">
                Evaluating healthcare guidelines & screening safety parameters...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts Footer Bar */}
      <div className="px-4 py-2 bg-slate-100/80 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Suggested:
        </span>
        {SUGGESTED_PROMPTS.slice(0, 3).map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-200 rounded-full text-xs transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Text Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about verified healthcare schemes, symptom preparation, or doctor questions..."
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-teal-600"
          aria-label="Send Message"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
