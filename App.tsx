import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { InfrastructureView } from './components/InfrastructureView';
import { AdminView } from './components/AdminView';
import { ApiDiagnostics } from './components/ApiDiagnostics';
import { GeminiAdvisor } from './components/GeminiAdvisor';
import { DOCTOR_DATA } from './constants';
import { Database, UserCircle, Box, CreditCard } from 'lucide-react';

// Simple placeholder components for views not fully implemented in this demo
const PlaceholderView: React.FC<{title: string, icon: any}> = ({ title, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50">
    <div className="p-6 bg-white rounded-full shadow-sm mb-4">
      <Icon size={48} className="text-slate-300" />
    </div>
    <h2 className="text-xl font-semibold text-slate-600">{title}</h2>
    <p className="mt-2 text-sm max-w-md text-center">
      This module connects to the Google Cloud backend. In this demo, please use the 
      <strong> Infrastructure</strong> tab to see the API status or <strong>AI Consultant</strong> for analysis.
    </p>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView data={DOCTOR_DATA} />;
      case 'admin':
        return <AdminView />;
      case 'diagnostics':
        return <ApiDiagnostics />;
      case 'infrastructure':
        return <InfrastructureView />;
      case 'analysis':
        return <GeminiAdvisor data={DOCTOR_DATA} />;
      case 'database':
        return <PlaceholderView title="Cloud Firestore Browser" icon={Database} />;
      case 'identity':
        return <PlaceholderView title="Identity Platform Users" icon={UserCircle} />;
      case 'storage':
        return <PlaceholderView title="Cloud Storage Buckets" icon={Box} />;
      case 'billing':
        return <PlaceholderView title="Billing Reports" icon={CreditCard} />;
      default:
        return <DashboardView data={DOCTOR_DATA} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;