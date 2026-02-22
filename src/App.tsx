/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Beaker, 
  Box, 
  Settings, 
  Plus, 
  Search,
  ChevronRight,
  Menu,
  X,
  Users
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Pages (to be created)
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import ProjectDetail from './pages/ProjectDetail';
import AIAssistant from './components/AIAssistant';
import CrewPage from './pages/Crew';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function SidebarItem({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean, key?: string }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ x: 4 }}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
          active 
            ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
            : "text-slate-600 hover:bg-slate-200/50"
        )}
      >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </motion.div>
    </Link>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/materials', icon: Beaker, label: 'Materials' },
    { to: '/crew', icon: Users, label: 'Crew R&D' },
    { to: '/inventory', icon: Box, label: 'Inventory' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-brand-secondary">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 p-6 border-r border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 h-screen">
        <div className="mb-10 px-4">
          <h1 className="text-2xl font-bold text-brand-primary tracking-tight">
            Kriya <span className="font-serif italic font-normal">Nusantara</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mt-1">R&D Management</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.to} 
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to} 
            />
          ))}
        </nav>

        <div className="mt-auto p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
          <p className="text-xs text-brand-primary font-medium">System Version</p>
          <p className="text-[10px] text-slate-500 font-mono">v1.2.4-stable</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-bottom border-slate-200 z-50 flex items-center justify-between px-6">
        <h1 className="text-xl font-bold text-brand-primary">Kriya Nusantara</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-16 bg-white z-40 p-6 flex flex-col gap-4"
          >
            {navItems.map((item) => (
              <Link 
                key={item.to} 
                to={item.to} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl",
                  location.pathname === item.to ? "bg-brand-primary text-white" : "bg-slate-50"
                )}
              >
                <item.icon size={24} />
                <span className="text-lg font-medium">{item.label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/crew" element={<CrewPage />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="*" element={<div className="flex items-center justify-center h-[60vh] text-slate-400">Page under development</div>} />
        </Routes>
        <AIAssistant />
      </Layout>
    </Router>
  );
}

