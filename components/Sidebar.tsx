import React from 'react';
import { LayoutDashboard, Server, Database, Activity, ShieldCheck, CreditCard, Box, UserCircle, Terminal, Stethoscope } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Business Nexus', icon: LayoutDashboard },
    { id: 'admin', label: 'Admin Console', icon: Terminal },
    { id: 'diagnostics', label: 'API Diagnostics', icon: Stethoscope },
    { id: 'infrastructure', label: 'Cloud Infrastructure', icon: Server },
    { id: 'database', label: 'Firestore Data', icon: Database },
    { id: 'identity', label: 'Identity & Access', icon: UserCircle },
    { id: 'storage', label: 'Storage Buckets', icon: Box },
    { id: 'billing', label: 'Cost & Billing', icon: CreditCard },
    { id: 'analysis', label: 'AI Consultant', icon: Activity },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="text-teal-500" />
          CloudMed
        </h1>
        <p className="text-xs text-slate-500 mt-1">GCP & Firebase Manager</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" 
                      : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-xs">
            AM
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Dr. Alexandre</p>
            <p className="text-xs text-slate-500 truncate">Project Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};