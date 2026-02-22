import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Leaf, 
  Droplets, 
  Layers, 
  AlertCircle,
  Info
} from 'lucide-react';
import { Material } from '../types';

const MOCK_MATERIALS: Material[] = [
  {
    id: 'm1',
    name: 'Kayu Mahoni Grade A',
    type: 'Wood',
    origin: 'Jawa Tengah',
    properties: ['Hardwood', 'Fine Grain', 'Reddish Brown'],
    stock_status: 'Available',
    notes: 'Sangat baik untuk finishing natural. Kadar air 12%.'
  },
  {
    id: 'm2',
    name: 'Bambu Petung',
    type: 'Bamboo',
    origin: 'Bali',
    properties: ['Flexible', 'High Tensile', 'Sustainable'],
    stock_status: 'Low',
    notes: 'Perlu proses pengawetan khusus untuk mencegah rayap.'
  },
  {
    id: 'm3',
    name: 'Rotan Manau',
    type: 'Rattan',
    origin: 'Kalimantan',
    properties: ['Lightweight', 'Durable'],
    stock_status: 'Available',
    notes: 'Digunakan untuk aksen anyaman pada produk lighting.'
  },
  {
    id: 'm4',
    name: 'Resin Bio-Based',
    type: 'Synthetic',
    origin: 'Import',
    properties: ['Clear', 'Eco-friendly'],
    stock_status: 'Out of Stock',
    notes: 'Menunggu pengiriman batch baru dari supplier.'
  }
];

export default function Materials() {
  const [materials, setMaterials] = useState<Material[]>(MOCK_MATERIALS);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = materials.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">Material Library</h2>
          <p className="text-slate-500 mt-2 max-w-xl">
            Katalog material yang digunakan dalam proses R&D. 
            Informasi teknis, asal-usul, dan status ketersediaan.
          </p>
        </div>
        <button className="bg-brand-primary text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-brand-primary/20">
          <Plus size={20} />
          Tambah Material
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Cari material..." 
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((material) => (
          <motion.div 
            key={material.id}
            layout
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brand-primary/5 rounded-xl text-brand-primary">
                {material.type === 'Wood' && <Leaf size={24} />}
                {material.type === 'Bamboo' && <Layers size={24} />}
                {material.type === 'Synthetic' && <Droplets size={24} />}
                {material.type === 'Rattan' && <Leaf size={24} />}
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                material.stock_status === 'Available' && "bg-emerald-100 text-emerald-700",
                material.stock_status === 'Low' && "bg-amber-100 text-amber-700",
                material.stock_status === 'Out of Stock' && "bg-rose-100 text-rose-700",
              )}>
                {material.stock_status}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900">{material.name}</h3>
            <p className="text-brand-accent text-xs font-bold uppercase tracking-widest mt-1">{material.origin}</p>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {material.properties.map((prop, i) => (
                <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-medium">
                  {prop}
                </span>
              ))}
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-start gap-2 text-slate-500 text-xs italic leading-relaxed">
                <Info size={14} className="shrink-0 mt-0.5" />
                {material.notes}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
