// Hardcoded data from the user prompt for the "Firestore" simulation
export const DOCTOR_DATA = {
  medico: "Dr. Alexandre Mendes",
  especialidade: "Cirurgião de Quadril",
  cidade: "São Paulo - SP",
  dadosTecnicos: {
    pageSpeedScore: 45,
    tempoCarregamento: "6.2s",
    seguranca: "Site não seguro (HTTP)",
    mobileFriendly: false
  },
  analiseVisual: {
    labelsEncontradas: ["Business", "Blue", "Handshake", "Building", "Generic"],
    temFotoReal: false
  },
  mercado: {
    posicaoGoogleMaps: 12,
    concorrenteLider: "Instituto do Quadril SP (4.9 estrelas, 350 reviews)",
    reviewsDrAlexandre: 14
  }
};

export const API_ENDPOINTS = {
  RESOURCE_MANAGER: 'https://cloudresourcemanager.googleapis.com/v1/projects',
  FIREBASE_MGMT: 'https://firebase.googleapis.com/v1beta1/projects',
  SERVICE_USAGE: 'https://serviceusage.googleapis.com/v1/services',
  IDENTITY: 'https://identitytoolkit.googleapis.com/v2/projects',
  FIRESTORE: 'https://firestore.googleapis.com/v1/projects',
  STORAGE: 'https://storage.googleapis.com/storage/v1/b',
  BILLING: 'https://cloudbilling.googleapis.com/v1/services'
};

export const MOCK_BILLING_DATA = [
  { name: 'Jan', cost: 120 },
  { name: 'Feb', cost: 132 },
  { name: 'Mar', cost: 105 },
  { name: 'Apr', cost: 145 },
  { name: 'May', cost: 160 },
  { name: 'Jun', cost: 190 },
];