import React, { useState } from 'react';
import { runApiConnectivityTest, ApiTestResult } from '../services/gcpService';
import { Play, Activity, AlertTriangle, CheckCircle, XCircle, Globe, ShieldAlert } from 'lucide-react';

export const ApiDiagnostics: React.FC = () => {
  const [apiKey, setApiKey] = useState('AIzaSyDZk_tY0pjDrAOWH1-t4a6chhHIUh43icM');
  const [projectId, setProjectId] = useState('cloud-med-nexus-prod');
  const [results, setResults] = useState<ApiTestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRunTests = async () => {
    setLoading(true);
    setResults([]);
    // Execute the real network tests
    const data = await runApiConnectivityTest(apiKey, projectId);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="p-8 overflow-y-auto h-full bg-slate-50">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="text-blue-600" />
          API Connectivity Diagnostics
        </h2>
        <p className="text-slate-500">
          Verify reachability and response codes for Google Cloud Platform endpoints.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Test Configuration</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">API Key</label>
                <div className="relative">
                    <input 
                    type="text" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm placeholder:text-slate-400"
                    />
                    <ShieldAlert size={16} className="absolute right-3 top-3 text-slate-400" />
                </div>
                <p className="text-xs text-slate-400 mt-2">Using the provided static key for testing.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Project ID Context</label>
                <input 
                  type="text" 
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm placeholder:text-slate-400"
                />
              </div>

              <button
                onClick={handleRunTests}
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-600/10"
              >
                {loading ? (
                    <>
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     Running Tests...
                    </>
                ) : (
                    <>
                     <Play size={18} />
                     Run Diagnostics
                    </>
                )}
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
            <strong>Note on Status Codes:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
                <li><span className="font-mono bg-white px-1 rounded">200 OK</span>: API Active & Authorized.</li>
                <li><span className="font-mono bg-white px-1 rounded">400 Bad Request</span>: API Active, invalid params.</li>
                <li><span className="font-mono bg-white px-1 rounded">401/403</span>: API Active, Authentication Required (Service Account vs API Key).</li>
                <li><span className="font-mono bg-white px-1 rounded">0 Error</span>: CORS or Network Block.</li>
            </ul>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-semibold text-slate-900">Endpoint Results</h3>
                    {results.length > 0 && (
                        <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full font-mono">
                            {results.filter(r => r.isSuccess).length}/{results.length} Reachable
                        </span>
                    )}
                </div>

                {results.length === 0 && !loading && (
                    <div className="p-12 text-center text-slate-400">
                        <Globe size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Ready to test network connectivity.</p>
                        <p className="text-sm">Click "Run Diagnostics" to start.</p>
                    </div>
                )}
                
                {loading && results.length === 0 && (
                     <div className="p-12 text-center text-slate-400">
                        <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                        <p>Pinging Google Cloud Endpoints...</p>
                    </div>
                )}

                <div className="divide-y divide-slate-100">
                    {results.map((result, idx) => (
                        <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    {result.isSuccess ? (
                                        <CheckCircle size={20} className="text-green-500" />
                                    ) : (
                                        <XCircle size={20} className="text-red-500" />
                                    )}
                                    <div>
                                        <h4 className="font-semibold text-slate-900">{result.apiName}</h4>
                                        <p className="text-xs text-slate-500 font-mono break-all">{result.url}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                                        result.status === 200 ? 'bg-green-100 text-green-700' :
                                        result.status === 401 || result.status === 403 ? 'bg-orange-100 text-orange-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {result.status === 0 ? 'ERR' : result.status} {result.statusText}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">{result.latency}ms</p>
                                </div>
                            </div>
                            
                            <div className="mt-3 bg-slate-900 rounded p-3 overflow-hidden">
                                <p className="text-xs text-slate-500 mb-1 font-mono select-none">Response Preview:</p>
                                <code className="text-xs font-mono text-green-400 block whitespace-pre-wrap break-all">
                                    {result.responsePreview}
                                </code>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};