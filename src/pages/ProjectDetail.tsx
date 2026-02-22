import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  CheckCircle2, 
  Circle,
  History,
  FileText,
  MessageSquare,
  Send
} from 'lucide-react';
import { useState } from 'react';
import { Project, PrototypeLog } from '../types';

const MOCK_LOGS: PrototypeLog[] = [
  {
    id: 'l1',
    project_id: '1',
    date: '2024-02-15',
    version: 'v0.3',
    notes: 'Uji coba modul bluetooth 5.3. Koneksi stabil namun ada sedikit noise pada volume maksimal. Perlu penambahan kapasitor pada jalur power.',
    image_url: 'https://picsum.photos/seed/pcb/600/400'
  },
  {
    id: 'l2',
    project_id: '1',
    date: '2024-01-28',
    version: 'v0.2',
    notes: 'Pemotongan casing kayu menggunakan CNC. Presisi sangat baik, namun finishing amplas manual masih diperlukan untuk sudut-sudut tajam.',
    image_url: 'https://picsum.photos/seed/woodwork/600/400'
  }
];

export default function ProjectDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'discussion'>('overview');

  // In a real app, fetch project by ID
  const project: Project = {
    id: '1',
    title: 'Tjawang Radio Gen 4',
    description: 'Penyempurnaan desain radio kayu klasik dengan modul bluetooth terbaru dan kualitas suara hi-fi. Fokus pada keberlanjutan material dan kemudahan perbaikan.',
    status: 'Prototyping',
    category: 'Audio',
    designer: 'Singgih S. Kartono',
    start_date: '2024-01-15',
    updated_at: '2024-02-20',
    thumbnail_url: 'https://picsum.photos/seed/radio/800/400'
  };

  const stages = ['Concept', 'Design', 'Prototyping', 'Testing', 'Final'];
  const currentStageIndex = stages.indexOf(project.status);

  return (
    <div className="space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Kembali ke Dashboard
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Project Info */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                {project.category}
              </span>
              <span className="text-slate-400 text-sm">•</span>
              <div className="flex items-center gap-1 text-slate-500 text-sm">
                <Calendar size={14} />
                Dimulai {new Date(project.start_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <h1 className="text-5xl font-bold text-slate-900 leading-tight">{project.title}</h1>
            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
              {project.description}
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Tahapan Pengembangan</h3>
            <div className="relative flex justify-between">
              {/* Progress Line */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-100 -z-0" />
              <div 
                className="absolute top-4 left-0 h-0.5 bg-brand-primary transition-all duration-1000" 
                style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
              />
              
              {stages.map((stage, i) => (
                <div key={stage} className="relative z-10 flex flex-col items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500",
                    i <= currentStageIndex ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30" : "bg-white border-2 border-slate-100 text-slate-300"
                  )}>
                    {i < currentStageIndex ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    i <= currentStageIndex ? "text-brand-primary" : "text-slate-400"
                  )}>
                    {stage}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="space-y-6">
            <div className="flex gap-8 border-b border-slate-200">
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'logs', label: 'Prototype Logs', icon: History },
                { id: 'discussion', label: 'Discussion', icon: MessageSquare },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "pb-4 flex items-center gap-2 font-medium transition-all relative",
                    activeTab === tab.id ? "text-brand-primary" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <tab.icon size={18} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[300px]">
              {activeTab === 'logs' && (
                <div className="space-y-6">
                  {MOCK_LOGS.map((log) => (
                    <div key={log.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex gap-6">
                      <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                        <img src={log.image_url} alt="Log" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900">Versi {log.version}</h4>
                          <span className="text-xs text-slate-400 font-medium">{new Date(log.date).toLocaleDateString('id-ID')}</span>
                        </div>
                        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                          {log.notes}
                        </p>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium hover:border-brand-primary hover:text-brand-primary transition-all">
                    + Tambah Log Baru
                  </button>
                </div>
              )}

              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4">Spesifikasi Teknis</h4>
                    <ul className="space-y-3">
                      {[
                        { label: 'Material Utama', value: 'Kayu Mahoni' },
                        { label: 'Finishing', value: 'Linseed Oil' },
                        { label: 'Dimensi', value: '25 x 15 x 10 cm' },
                        { label: 'Berat', value: '1.2 kg' },
                      ].map((spec, i) => (
                        <li key={i} className="flex justify-between text-sm">
                          <span className="text-slate-500">{spec.label}</span>
                          <span className="font-medium text-slate-900">{spec.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4">Tim R&D</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">S</div>
                        <div>
                          <p className="text-sm font-bold">Singgih S. Kartono</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Lead Designer</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold">A</div>
                        <div>
                          <p className="text-sm font-bold">Ahmad Fauzi</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Technical Engineer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'discussion' && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[400px]">
                  <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                      <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                        <p className="text-sm text-slate-700">Bagaimana dengan ketahanan baterai untuk modul bluetooth baru ini?</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">09:15 AM</span>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-brand-primary shrink-0" />
                      <div className="bg-brand-primary text-white p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                        <p className="text-sm">Sudah diuji, bertahan sekitar 12 jam pemakaian kontinu. Cukup ideal untuk radio portabel.</p>
                        <span className="text-[10px] text-white/60 mt-1 block">09:20 AM</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-100 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Tulis pesan..." 
                      className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    />
                    <button className="p-2 bg-brand-primary text-white rounded-xl">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Meta */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">Status Proyek</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                <span className="text-sm font-medium text-brand-primary">Aktif</span>
                <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              </div>
              <button className="w-full py-3 bg-brand-primary text-white rounded-xl font-medium shadow-lg shadow-brand-primary/20">
                Update Status
              </button>
              <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium">
                Export Dokumentasi
              </button>
            </div>
          </div>

          <div className="bg-brand-primary p-6 rounded-3xl text-white shadow-xl shadow-brand-primary/20 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-bold mb-2">AI Assistant</h4>
              <p className="text-white/80 text-xs leading-relaxed mb-4">
                Tanyakan saran material atau optimasi desain berdasarkan data riset sebelumnya.
              </p>
              <button className="w-full py-2 bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/30 transition-all">
                Mulai Konsultasi
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Beaker size={120} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

function Beaker(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 3h15" />
      <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
      <path d="M6 14h12" />
    </svg>
  );
}
