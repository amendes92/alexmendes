import React, { useState } from 'react';
import { adminApi, AdminTaskStatus } from '../services/adminService';
import { 
  Shield, 
  Terminal, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Database, 
  Flame, 
  Users, 
  Server,
  Key
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [useSimulation, setUseSimulation] = useState(true);
  
  const [steps, setSteps] = useState<{ [key: string]: AdminTaskStatus['status'] }>({
    create_project: 'pending',
    add_firebase: 'pending',
    config_auth: 'pending',
    provision_db: 'pending',
  });
  
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const updateStep = (step: string, status: AdminTaskStatus['status']) => {
    setSteps(prev => ({ ...prev, [step]: status }));
  };

  const executeProvisioning = async () => {
    if (!projectId || !projectName) {
      addLog("Error: Missing Project ID or Name");
      return;
    }

    setLogs([]);
    addLog("Starting provisioning sequence...");
    
    if (useSimulation) {
      addLog("MODE: Simulation (No Real API Charges)");
    } else {
      addLog("MODE: Live API Execution (Requires Valid Access Token)");
    }

    // Step 1: Create Project
    try {
      updateStep('create_project', 'loading');
      addLog(`Initializing Project: ${projectId}...`);
      await adminApi.createProject(projectId, projectName, useSimulation ? '' : accessToken);
      updateStep('create_project', 'success');
      addLog("SUCCESS: Project created via Cloud Resource Manager.");
    } catch (e: any) {
      updateStep('create_project', 'error');
      addLog(`ERROR: ${e.message}`);
      return;
    }

    // Step 2: Add Firebase
    try {
      updateStep('add_firebase', 'loading');
      addLog("Adding Firebase capabilities...");
      await adminApi.addFirebase(projectId, useSimulation ? '' : accessToken);
      updateStep('add_firebase', 'success');
      addLog("SUCCESS: Firebase Management API linked.");
    } catch (e: any) {
      updateStep('add_firebase', 'error');
      addLog(`ERROR: ${e.message}`);
      return;
    }

    // Step 3: Configure Auth
    try {
      updateStep('config_auth', 'loading');
      addLog("Configuring Identity Toolkit (Email/Anonymous)...");
      await adminApi.configureAuth(projectId, useSimulation ? '' : accessToken);
      updateStep('config_auth', 'success');
      addLog("SUCCESS: Auth providers enabled.");
    } catch (e: any) {
      updateStep('config_auth', 'error');
      addLog(`ERROR: ${e.message}`);
      return;
    }

    // Step 4: Provision Database
    try {
      updateStep('provision_db', 'loading');
      addLog("Provisioning Firestore (Native Mode) in us-central1...");
      await adminApi.createDatabase(projectId, 'us-central1', useSimulation ? '' : accessToken);
      updateStep('provision_db', 'success');
      addLog("SUCCESS: Cloud Firestore provisioned.");
    } catch (e: any) {
      updateStep('provision_db', 'error');
      addLog(`ERROR: ${e.message}`);
      return;
    }

    addLog("Provisioning Complete. Service Account ready for app integration.");
  };

  return (
    <div className="p-8 overflow-y-auto h-full bg-slate-50 flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="text-indigo-600" />
          Admin Provisioning Console
        </h2>
        <p className="text-slate-500">
          Orchestrate Google Cloud resources using Service Account privileges.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Key size={20} className="text-slate-400" />
              Service Account Configuration
            </h3>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">New Project ID</label>
                  <input 
                    type="text" 
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="medico-nexus-prod-001"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Name</label>
                  <input 
                    type="text" 
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Medico Nexus Production"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Service Account OAuth Access Token</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Simulation Mode</span>
                    <button 
                      onClick={() => setUseSimulation(!useSimulation)}
                      className={`w-10 h-5 rounded-full p-1 transition-colors ${useSimulation ? 'bg-indigo-500' : 'bg-slate-300'}`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${useSimulation ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                </div>
                {!useSimulation && (
                   <input 
                     type="password" 
                     value={accessToken}
                     onChange={(e) => setAccessToken(e.target.value)}
                     placeholder="ya29.c.c0..."
                     className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm placeholder:text-slate-400"
                   />
                )}
                <p className="text-xs text-slate-500 mt-2">
                  {useSimulation 
                    ? "Simulation enabled. Actions will mimic API success without making real network calls." 
                    : "Paste a valid OAuth 2.0 Access Token with 'Project Creator' scope."}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={executeProvisioning}
                  className="w-full py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-slate-900/10"
                >
                  <Terminal size={18} />
                  Execute Provisioning Sequence
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 font-mono text-sm h-64 overflow-y-auto">
            <div className="flex items-center gap-2 text-slate-900 font-semibold mb-4 border-b border-slate-100 pb-2">
              <Terminal size={16} className="text-slate-500" />
              <span>System Output</span>
            </div>
            {logs.length === 0 && <span className="text-slate-400 italic">Waiting for commands...</span>}
            {logs.map((log, i) => (
              <div key={i} className="text-slate-600 mb-1.5 border-b border-slate-50 pb-1 last:border-0">{log}</div>
            ))}
          </div>
        </div>

        {/* Status Pipeline */}
        <div className="space-y-4">
          <StatusCard 
            title="Create Project" 
            api="cloudresourcemanager" 
            status={steps.create_project} 
            icon={Server}
          />
          <StatusCard 
            title="Add Firebase" 
            api="firebase.googleapis.com" 
            status={steps.add_firebase} 
            icon={Flame}
          />
          <StatusCard 
            title="Configure Auth" 
            api="identitytoolkit" 
            status={steps.config_auth} 
            icon={Users}
          />
          <StatusCard 
            title="Provision Database" 
            api="firestore.googleapis.com" 
            status={steps.provision_db} 
            icon={Database}
          />
        </div>
      </div>
    </div>
  );
};

const StatusCard: React.FC<{title: string, api: string, status: string, icon: any}> = ({
  title, api, status, icon: Icon
}) => {
  const getStatusColor = () => {
    switch(status) {
      case 'success': return 'border-green-500 bg-green-50';
      case 'error': return 'border-red-500 bg-red-50';
      case 'loading': return 'border-blue-500 bg-blue-50';
      default: return 'border-slate-200 bg-white opacity-60';
    }
  };

  const getIconColor = () => {
    switch(status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'loading': return 'text-blue-600';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 shadow-sm transition-all duration-300 ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={getIconColor()}>
            <Icon size={20} />
          </div>
          <div>
            <h4 className={`font-semibold ${status === 'pending' ? 'text-slate-500' : 'text-slate-900'}`}>
              {title}
            </h4>
            <p className="text-xs text-slate-500 font-mono">{api}</p>
          </div>
        </div>
        <div>
          {status === 'loading' && <Loader2 size={18} className="animate-spin text-blue-500" />}
          {status === 'success' && <CheckCircle2 size={18} className="text-green-500" />}
          {status === 'error' && <AlertCircle size={18} className="text-red-500" />}
        </div>
      </div>
    </div>
  );
};