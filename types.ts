export interface DoctorData {
  medico: string;
  especialidade: string;
  cidade: string;
  dadosTecnicos: {
    pageSpeedScore: number;
    tempoCarregamento: string;
    seguranca: string;
    mobileFriendly: boolean;
  };
  analiseVisual: {
    labelsEncontradas: string[];
    temFotoReal: boolean;
  };
  mercado: {
    posicaoGoogleMaps: number;
    concorrenteLider: string;
    reviewsDrAlexandre: number;
  };
}

export interface GcpServiceStatus {
  name: string;
  apiId: string;
  status: 'active' | 'inactive' | 'error';
  latency: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}