import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, Sparkles, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = "gemini-3-flash-preview";
      
      const result = await ai.models.generateContent({
        model,
        contents: [
          {
            parts: [{
              text: `Anda adalah asisten ahli R&D untuk Kriya Nusantara, sebuah perusahaan kerajinan premium Indonesia yang fokus pada material alam seperti kayu, bambu, dan rotan. 
              Berikan saran teknis, ide desain, atau solusi material untuk pertanyaan berikut: ${prompt}`
            }]
          }
        ],
      });

      setResponse(result.text || 'Maaf, saya tidak bisa memberikan jawaban saat ini.');
    } catch (error) {
      console.error('AI Error:', error);
      setResponse('Terjadi kesalahan saat menghubungi asisten AI.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-brand-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <Sparkles size={24} />
      </button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-8 w-96 max-w-[calc(100vw-4rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 flex flex-col"
          >
            <div className="bg-brand-primary p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles size={18} />
                <span className="font-bold">Kriya AI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto min-h-[300px] max-h-[400px] bg-slate-50">
              {response ? (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-sm leading-relaxed text-slate-700">
                  {response}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                  <Sparkles size={48} className="mb-4 opacity-20" />
                  <p className="text-sm">Tanyakan apa saja tentang riset material, teknik kerajinan, atau tren desain produk.</p>
                </div>
              )}
              {isLoading && (
                <div className="flex items-center gap-2 text-brand-primary mt-4">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-xs font-medium">Berpikir...</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                  placeholder="Ketik pertanyaan..." 
                  className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none"
                />
                <button 
                  onClick={handleAsk}
                  disabled={isLoading}
                  className="p-2 bg-brand-primary text-white rounded-xl disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
