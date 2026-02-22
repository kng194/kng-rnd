import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  User, 
  Phone, 
  Calendar, 
  Briefcase, 
  Award, 
  Camera,
  X,
  Trash2,
  Edit2,
  Upload,
  AlertCircle
} from 'lucide-react';
import { Crew, Position } from '../types';
import { supabase } from '../lib/supabase';
import { differenceInYears, parseISO, format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const POSITIONS: Position[] = ['Designer Produk', 'Interior', 'Motif', 'Drafter'];

export default function CrewPage() {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrew, setEditingCrew] = useState<Partial<Crew> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCrews();
  }, []);

  async function fetchCrews() {
    setIsLoading(true);
    setDbError(null);
    try {
      const { data, error } = await supabase.from('crews').select('*').order('name');
      
      if (error) {
        console.warn('Supabase fetch error:', error);
        if (error.message.includes('relation "crews" does not exist')) {
          setDbError('Tabel "crews" belum ada di Supabase. Menggunakan data simulasi.');
        }
      }

      if (data && data.length > 0) {
        setCrews(data);
      } else {
        // Fallback mock data if table is empty or doesn't exist
        const mockData: Crew[] = [
          {
            id: '1',
            name: 'Budi Santoso',
            phone: '08123456789',
            birth_date: '1990-05-15',
            join_date: '2018-03-10',
            position: 'Designer Produk',
            photo_url: 'https://picsum.photos/seed/budi/200'
          },
          {
            id: '2',
            name: 'Siti Rahma',
            phone: '082233445566',
            birth_date: '1995-11-20',
            join_date: '2022-06-01',
            position: 'Motif',
            photo_url: 'https://picsum.photos/seed/siti/200'
          },
          {
            id: '3',
            name: 'Andi Wijaya',
            phone: '085566778899',
            birth_date: '1998-01-05',
            join_date: '2025-01-15',
            position: 'Drafter',
            photo_url: 'https://picsum.photos/seed/andi/200'
          }
        ];
        setCrews(mockData);
        if (error) console.warn('Supabase fetch error (using mock data):', error);
      }
    } catch (err) {
      console.error('Unexpected error fetching crews:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const getLevel = (joinDate: string) => {
    const years = differenceInYears(new Date(), parseISO(joinDate));
    if (years < 1) return { label: 'Pemula', color: 'bg-blue-100 text-blue-700' };
    if (years <= 5) return { label: 'Junior', color: 'bg-amber-100 text-amber-700' };
    return { label: 'Senior', color: 'bg-emerald-100 text-emerald-700' };
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCrew?.name || !editingCrew?.join_date || !editingCrew?.position) return;

    const crewData = {
      ...editingCrew,
      id: editingCrew.id || crypto.randomUUID(),
    };

    const { error } = await supabase.from('crews').upsert(crewData);
    
    if (!error) {
      fetchCrews();
      setIsModalOpen(false);
      setEditingCrew(null);
    } else {
      // If table doesn't exist, just update local state for demo
      if (editingCrew.id) {
        setCrews(crews.map(c => c.id === editingCrew.id ? (crewData as Crew) : c));
      } else {
        setCrews([...crews, crewData as Crew]);
      }
      setIsModalOpen(false);
      setEditingCrew(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus crew ini?')) return;
    const { error } = await supabase.from('crews').delete().eq('id', id);
    if (!error) {
      fetchCrews();
    } else {
      setCrews(crews.filter(c => c.id !== id));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingCrew({ ...editingCrew, photo_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredCrews = crews.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">Crew R&D</h2>
          <p className="text-slate-500 mt-2 max-w-xl">
            Manajemen tim kreatif Kriya Nusantara. Pantau level keahlian dan spesialisasi setiap anggota.
          </p>
        </div>
        <button 
          onClick={() => {
            setEditingCrew({ position: 'Designer Produk', join_date: format(new Date(), 'yyyy-MM-dd'), birth_date: '1995-01-01' });
            setIsModalOpen(true);
          }}
          className="bg-brand-primary text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all active:scale-95"
        >
          <Plus size={20} />
          Tambah Anggota
        </button>
      </div>

      {dbError && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800 text-sm">
          <AlertCircle size={18} className="shrink-0" />
          <p>{dbError}</p>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Cari nama atau jabatan..." 
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-pulse">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-full" />
              </div>
            </div>
          ))
        ) : filteredCrews.length > 0 ? (
          filteredCrews.map((crew) => {
            const level = getLevel(crew.join_date);
            return (
              <motion.div 
                key={crew.id}
                layout
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group relative"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group-hover:border-brand-primary transition-colors">
                    {crew.photo_url ? (
                      <img src={crew.photo_url} alt={crew.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <User size={32} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{crew.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider", level.color)}>
                        {level.label}
                      </span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className="text-slate-500 text-xs font-medium">{crew.position}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Phone size={16} className="text-slate-400" />
                    {crew.phone}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Calendar size={16} className="text-slate-400" />
                    Lahir: {format(parseISO(crew.birth_date), 'dd MMM yyyy')}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Award size={16} className="text-slate-400" />
                    Gabung: {format(parseISO(crew.join_date), 'dd MMM yyyy')}
                  </div>
                </div>

                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setEditingCrew(crew);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-brand-primary hover:text-white transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(crew.id)}
                    className="p-2 bg-slate-100 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <User size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">Tidak ada anggota crew ditemukan.</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">
                  {editingCrew?.id ? 'Edit Anggota' : 'Tambah Anggota Baru'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-6">
                <div className="flex justify-center">
                  <div 
                    className="w-24 h-24 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {editingCrew?.photo_url ? (
                      <img src={editingCrew.photo_url} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera size={24} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Upload</span>
                      </>
                    )}
                    <div className="absolute inset-0 bg-brand-primary/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Upload size={20} className="text-white" />
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none"
                      value={editingCrew?.name || ''}
                      onChange={e => setEditingCrew({ ...editingCrew, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">No. HP</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none"
                      value={editingCrew?.phone || ''}
                      onChange={e => setEditingCrew({ ...editingCrew, phone: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal Lahir</label>
                      <input 
                        required
                        type="date" 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none"
                        value={editingCrew?.birth_date || ''}
                        onChange={e => setEditingCrew({ ...editingCrew, birth_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal Gabung</label>
                      <input 
                        required
                        type="date" 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none"
                        value={editingCrew?.join_date || ''}
                        onChange={e => setEditingCrew({ ...editingCrew, join_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jabatan</label>
                    <select 
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none"
                      value={editingCrew?.position || ''}
                      onChange={e => setEditingCrew({ ...editingCrew, position: e.target.value as Position })}
                    >
                      {POSITIONS.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
