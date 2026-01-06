import { API_ENDPOINTS } from '../constants';

// Helper to handle API responses
const handleResponse = async (response: Response, action: string) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`${action} failed:`, errorData);
    throw new Error(`${action} failed: ${response.statusText} - ${errorData.error?.message || ''}`);
  }
  return response.json();
};

export interface AdminTaskStatus {
  step: 'create_project' | 'add_firebase' | 'config_auth' | 'provision_db';
  status: 'pending' | 'loading' | 'success' | 'error';
  message?: string;
}

export const adminApi = {
  /**
   * 1. Create GCP Project
   * Endpoint: cloudresourcemanager.googleapis.com
   */
  createProject: async (projectId: string, displayName: string, accessToken: string) => {
    // In a real scenario, we use the accessToken from the Service Account.
    // For demo/simulation when no token is provided, we simulate a delay.
    if (!accessToken) {
      await new Promise(r => setTimeout(r, 2000));
      return { projectId, name: displayName, lifecycleState: 'ACTIVE' };
    }

    const response = await fetch(API_ENDPOINTS.RESOURCE_MANAGER, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        projectId,
        name: displayName
      })
    });
    return handleResponse(response, 'Create Project');
  },

  /**
   * 2. Add Firebase to Project
   * Endpoint: firebase.googleapis.com
   */
  addFirebase: async (projectId: string, accessToken: string) => {
    if (!accessToken) {
      await new Promise(r => setTimeout(r, 1500));
      return { projectId, resources: {} };
    }

    const url = `${API_ENDPOINTS.FIREBASE_MGMT}/${projectId}:addFirebase`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    return handleResponse(response, 'Add Firebase');
  },

  /**
   * 3. Configure Auth (Identity Toolkit)
   * Endpoint: identitytoolkit.googleapis.com
   */
  configureAuth: async (projectId: string, accessToken: string) => {
    if (!accessToken) {
      await new Promise(r => setTimeout(r, 1200));
      return { email: { enabled: true }, anonymous: { enabled: true } };
    }

    // Enable Identity Platform Config
    const url = `${API_ENDPOINTS.IDENTITY}/${projectId}/config`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        signIn: {
          email: { enabled: true },
          anonymous: { enabled: true }
        }
      })
    });
    return handleResponse(response, 'Configure Auth');
  },

  /**
   * 4. Provision Firestore Database
   * Endpoint: firestore.googleapis.com
   */
  createDatabase: async (projectId: string, locationId: string, accessToken: string) => {
    if (!accessToken) {
      await new Promise(r => setTimeout(r, 2500));
      return { name: `projects/${projectId}/databases/(default)` };
    }

    const url = `${API_ENDPOINTS.FIRESTORE}/${projectId}/databases?databaseId=(default)`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        locationId: locationId,
        type: 'FIRESTORE_NATIVE'
      })
    });
    return handleResponse(response, 'Create Database');
  }
};