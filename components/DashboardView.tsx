import React from 'react';
import { DoctorData } from '../types';
import { Activity, Clock, ShieldAlert, Smartphone, MapPin, TrendingUp, Users } from 'lucide-react';

interface DashboardViewProps {
  data: DoctorData;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ data }) => {
  return (
    <div className="p-8 overflow-y-auto h-full bg-slate-50">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Practice Overview</h2>
        <p className="text-slate-500">Real-time metrics for {data.medico}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          title="PageSpeed Score" 
          value={data.dadosTecnicos.pageSpeedScore.toString()} 
          icon={Activity} 
          trend="Critical" 
          trendColor="text-red-500" 
        />
        <MetricCard 
          title="Load Time" 
          value={data.dadosTecnicos.tempoCarregamento} 
          icon={Clock} 
          trend="+1.2s avg" 
          trendColor="text-orange-500" 
        />
        <MetricCard 
          title="Maps Position" 
          value={`#${data.mercado.posicaoGoogleMaps}`} 
          icon={MapPin} 
          trend="vs Competitors" 
          trendColor="text-slate-500" 
        />
        <MetricCard 
          title="Total Reviews" 
          value={data.mercado.reviewsDrAlexandre.toString()} 
          icon={Users} 
          trend={`Leader: ${data.mercado.concorrenteLider.split(' ')[0]}...`} 
          trendColor="text-blue-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldAlert className="text-red-500" size={20} />
            Technical Audit Issues
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-full text-red-500 shadow-sm">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-red-900">Security Protocol</h4>
                  <p className="text-sm text-red-700">{data.dadosTecnicos.seguranca}</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-white text-red-600 text-sm font-medium rounded shadow-sm border border-red-200">
                Fix Now
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-full text-orange-500 shadow-sm">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-orange-900">Mobile Optimization</h4>
                  <p className="text-sm text-orange-700">
                    {data.dadosTecnicos.mobileFriendly ? 'Optimized' : 'Not Mobile Friendly'}
                  </p>
                </div>
              </div>
              <button className="px-3 py-1 bg-white text-orange-600 text-sm font-medium rounded shadow-sm border border-orange-200">
                Inspect
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-sm font-medium text-slate-900 mb-3">Detected Image Labels (Cloud Vision API)</h4>
            <div className="flex flex-wrap gap-2">
              {data.analiseVisual.labelsEncontradas.map((label, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="text-teal-500" size={20} />
            Market Competitor
          </h3>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Market Leader</p>
            <p className="font-medium text-slate-900">{data.mercado.concorrenteLider}</p>
          </div>
          <div className="relative h-48 w-full bg-slate-100 rounded-lg overflow-hidden flex items-end justify-center pb-4 gap-4">
             {/* Simple CSS Bar Chart Simulation */}
             <div className="w-16 bg-teal-500 rounded-t-md relative group flex justify-center" style={{height: '10%'}}>
                <span className="absolute -top-6 text-xs font-bold text-slate-700">14</span>
                <span className="absolute bottom-2 text-white text-xs font-bold">You</span>
             </div>
             <div className="w-16 bg-slate-400 rounded-t-md relative group flex justify-center" style={{height: '90%'}}>
                <span className="absolute -top-6 text-xs font-bold text-slate-700">350</span>
                <span className="absolute bottom-2 text-white text-xs font-bold">Ldr</span>
             </div>
          </div>
          <p className="text-xs text-slate-500 text-center mt-3">Review Count Comparison</p>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{title: string, value: string, icon: any, trend: string, trendColor: string}> = ({
  title, value, icon: Icon, trend, trendColor
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
        <Icon size={20} />
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded-full bg-slate-50 ${trendColor}`}>
        {trend}
      </span>
    </div>
    <div className="mt-auto">
      <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
      <p className="text-sm text-slate-500 font-medium mt-1">{title}</p>
    </div>
  </div>
);