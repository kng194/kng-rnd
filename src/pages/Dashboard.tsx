import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Tag,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { supabase } from '../lib/supabase';

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Tjawang Radio Gen 4',
    description: 'Penyempurnaan desain radio kayu klasik dengan modul bluetooth terbaru dan kualitas suara hi-fi.',
    status: 'Prototyping',
    category: 'Audio',
    designer: 'Singgih S. Kartono',
    start_date: '2024-01-15',
    updated_at: '2024-02-20',
    thumbnail_url: 'https://picsum.photos/seed/radio/400/300'
  },
  {
    id: '2',
    title: 'Bambu Watch Series X',
    description: 'Eksperimen material bambu laminasi untuk case jam tangan ultra ringan.',
    status: 'Testing',
    category: 'Accessories',
    designer: 'Ahmad Fauzi',
    start_date: '2023-11-10',
    updated_at: '2024-02-18',
    thumbnail_url: 'https://picsum.photos/seed/watch/400/300'
  },
  {
    id: '3',
    title: 'Lampu Meja "Lentera"',
    description: 'Konsep pencahayaan ambient menggunakan teknik anyaman rotan modern.',
    status: 'Concept',
    category: 'Lighting',
    designer: 'Siti Aminah',
    start_date: '2024-02-01',
    updated_at: '2024-02-15',
    thumbnail_url: 'https://picsum.photos/seed/lamp/400/300'
  }
];

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');

  // In a real app, we would fetch from Supabase here
  /*
  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase.from('projects').select('*');
      if (data) setProjects(data);
    }
    fetchProjects();
  }, []);
  */

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.designer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">R&D Dashboard</h2>
          <p className="text-slate-500 mt-2 max-w-xl">
            Pantau perkembangan riset dan desain produk terbaru Kriya Nusantara. 
            Dari konsep hingga prototipe final.
          </p>
        </div>
        <button className="bg-brand-primary text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all active:scale-95">
          <Plus size={20} />
          Proyek Baru
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Proyek', value: '12', color: 'bg-blue-50 text-blue-600' },
          { label: 'Prototyping', value: '5', color: 'bg-amber-50 text-amber-600' },
          { label: 'Riset Material', value: '8', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Selesai (Q1)', value: '3', color: 'bg-purple-50 text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className={stat.value + " text-3xl font-bold mt-1"}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari proyek atau desainer..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="px-4 py-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Link key={project.id} to={`/project/${project.id}`}>
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-100">
                <img 
                  src={project.thumbnail_url} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    project.status === 'Concept' && "bg-blue-100 text-blue-700",
                    project.status === 'Prototyping' && "bg-amber-100 text-amber-700",
                    project.status === 'Testing' && "bg-emerald-100 text-emerald-700",
                    project.status === 'Final' && "bg-purple-100 text-purple-700",
                  )}>
                    {project.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-2">
                  <Tag size={12} />
                  {project.category}
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{project.title}</h3>
                <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                      <User size={14} />
                    </div>
                    <span className="text-xs font-medium text-slate-700">{project.designer}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Clock size={12} />
                    {new Date(project.updated_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
