import React, { useEffect, useState } from 'react';
import { checkServiceStatus, fetchProjectBilling } from '../services/gcpService';
import { GcpServiceStatus } from '../types';
import { RefreshCw, CheckCircle2, AlertTriangle, Database, Lock, Server } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MOCK_BILLING_DATA } from '../constants';

export const InfrastructureView: React.FC = () => {
  const [services, setServices] = useState<GcpServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState<any>(null);

  const refreshData = async () => {
    setLoading(true);
    const [statusData, billingData] = await Promise.all([
      checkServiceStatus(),
      fetchProjectBilling()
    ]);
    setServices(statusData);
    setBilling(billingData);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="p-8 overflow-y-auto h-full bg-slate-50">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cloud Infrastructure</h2>
          <p className="text-slate-500">API Status & Usage Monitoring</p>
        </div>
        <button 
          onClick={refreshData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Status
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Status List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
             <h3 className="font-semibold text-slate-900">Enabled Services</h3>
             <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">All Systems Operational</span>
           </div>
           <div className="divide-y divide-slate-100">
             {loading ? (
               <div className="p-8 text-center text-slate-500">Connecting to Service Usage API...</div>
             ) : (
               services.map((svc) => (
                 <div key={svc.apiId} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                       <Server size={18} />
                     </div>
                     <div>
                       <p className="text-sm font-semibold text-slate-900">{svc.name}</p>
                       <p className="text-xs text-slate-500 font-mono">{svc.apiId}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <span className="text-xs text-slate-400 hidden sm:block">{svc.description}</span>
                     <div className="flex items-center gap-2 text-xs font-medium px-2 py-1 bg-green-50 text-green-600 rounded">
                       <CheckCircle2 size={12} />
                       Active ({svc.latency})
                     </div>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>

        {/* Billing Widget */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Lock size={18} className="text-slate-400" />
              Security & Rules
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-sm font-medium text-slate-700">Firestore Rules</span>
                   <span className="text-xs text-green-600 font-bold">Enforced</span>
                 </div>
                 <p className="text-xs text-slate-500 font-mono">allow read, write: if request.auth != null;</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-sm font-medium text-slate-700">Storage Rules</span>
                   <span className="text-xs text-green-600 font-bold">Enforced</span>
                 </div>
                 <p className="text-xs text-slate-500 font-mono">allow read: if true; allow write: if false;</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2">Estimated Costs</h3>
            {loading ? (
              <div className="h-32 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-3xl font-bold text-slate-900">
                    {billing?.currency} {billing?.totalCost.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500">Current month-to-date</p>
                </div>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_BILLING_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{fill: '#f1f5f9'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                      />
                      <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};