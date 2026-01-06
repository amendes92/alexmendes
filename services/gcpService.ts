import { API_ENDPOINTS } from '../constants';
import { GcpServiceStatus } from '../types';

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface ApiTestResult {
  apiName: string;
  url: string;
  status: number;
  statusText: string;
  latency: number;
  responsePreview: string;
  isSuccess: boolean;
}

export const checkServiceStatus = async (): Promise<GcpServiceStatus[]> => {
  // In a real browser environment, calling these directly often fails CORS without a proxy.
  // We will simulate the "Check" but allow the code structure to support real calls.
  
  const services = [
    { name: 'Resource Manager', id: 'cloudresourcemanager.googleapis.com', desc: 'Project Metadata & Org Policy' },
    { name: 'Firebase Management', id: 'firebase.googleapis.com', desc: 'App provisioning & linking' },
    { name: 'Service Usage', id: 'serviceusage.googleapis.com', desc: 'Enabling/Disabling APIs' },
    { name: 'Identity Toolkit', id: 'identitytoolkit.googleapis.com', desc: 'Auth & User Management' },
    { name: 'Cloud Firestore', id: 'firestore.googleapis.com', desc: 'NoSQL Document Database' },
    { name: 'Firebase Rules', id: 'firebaserules.googleapis.com', desc: 'Security Rules Management' },
    { name: 'Cloud Storage', id: 'storage.googleapis.com', desc: 'Object Storage (Buckets)' },
    { name: 'Cloud Billing', id: 'cloudbilling.googleapis.com', desc: 'Cost Management & Budgeting' },
  ];

  const results: GcpServiceStatus[] = [];

  for (const service of services) {
    // Simulate API call time
    await delay(200 + Math.random() * 300);
    
    results.push({
      name: service.name,
      apiId: service.id,
      status: 'active',
      latency: `${(Math.random() * 100 + 50).toFixed(0)}ms`,
      description: service.desc
    });
  }

  return results;
};

// Simulated Fetch for Billing Data (since actual billing requires high privs)
export const fetchProjectBilling = async () => {
  await delay(800);
  return {
    currency: 'BRL',
    totalCost: 1852.45,
    projected: 2100.00
  };
};

// Simulated Fetch for Identity Users
export const fetchAuthUsers = async () => {
  await delay(600);
  return [
    { email: 'admin@mediconexus.com', lastLogin: '2023-10-25T10:30:00Z', status: 'Enabled' },
    { email: 'alexandre@mediconexus.com', lastLogin: '2023-10-24T16:45:00Z', status: 'Enabled' },
    { email: 'audit@service-account.com', lastLogin: '2023-10-25T00:00:00Z', status: 'Enabled' },
  ];
};

/**
 * Runs a real fetch request to the specified APIs to check connectivity.
 * Note: Many GCP Admin APIs return 401/403 with a standard API Key (vs Service Account Token),
 * but this proves the endpoint is reachable and active.
 */
export const runApiConnectivityTest = async (apiKey: string, projectId: string = 'medico-nexus'): Promise<ApiTestResult[]> => {
  const tests = [
    { name: 'Resource Manager', url: `${API_ENDPOINTS.RESOURCE_MANAGER}?key=${apiKey}` },
    { name: 'Firebase Mgmt', url: `${API_ENDPOINTS.FIREBASE_MGMT}?key=${apiKey}` },
    { name: 'Service Usage', url: `${API_ENDPOINTS.SERVICE_USAGE}?key=${apiKey}` },
    // Fixed: Use V1 public config endpoint for connectivity check instead of V2 Admin list
    { name: 'Identity Toolkit', url: `https://identitytoolkit.googleapis.com/v1/recaptchaParams?key=${apiKey}` },
    { name: 'Firestore', url: `${API_ENDPOINTS.FIRESTORE}/${projectId}/databases?key=${apiKey}` },
    { name: 'Cloud Storage', url: `${API_ENDPOINTS.STORAGE}?key=${apiKey}` },
    { name: 'Cloud Billing', url: `${API_ENDPOINTS.BILLING}?key=${apiKey}` },
  ];

  const results: ApiTestResult[] = [];

  for (const test of tests) {
    const startTime = performance.now();
    try {
      const response = await fetch(test.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      
      let preview = '';
      try {
        const json = await response.json();
        preview = JSON.stringify(json, null, 2).slice(0, 150) + '...';
      } catch (e) {
        preview = 'Non-JSON response or empty';
      }

      results.push({
        apiName: test.name,
        url: test.url,
        status: response.status,
        statusText: response.statusText,
        latency,
        responsePreview: preview,
        // We consider 200, 400, 401, 403 as "Reachable/Success" in terms of network connectivity.
        // A 401/403 means the API is UP, just rejected the key permissions.
        isSuccess: response.status < 500 && response.status !== 404
      });

    } catch (error: any) {
      const endTime = performance.now();
      results.push({
        apiName: test.name,
        url: test.url,
        status: 0,
        statusText: 'Network Error / CORS',
        latency: Math.round(endTime - startTime),
        responsePreview: error.message || 'Failed to fetch',
        isSuccess: false
      });
    }
  }

  return results;
};