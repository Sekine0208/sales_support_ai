export * from './call';
export * from './visit';

export interface KPIData {
  kgi: {
    target: number;
    current: number;
    achievementRate: number;
    month: string;
  };
  kpi: {
    calls: {
      target: number;
      current: number;
      achievementRate: number;
    };
    connected: {
      target: number;
      current: number;
      achievementRate: number;
    };
    appointments: {
      target: number;
      current: number;
      achievementRate: number;
    };
    visits: {
      target: number;
      current: number;
      achievementRate: number;
    };
    negotiations: {
      target: number;
      current: number;
      achievementRate: number;
    };
    proposals: {
      target: number;
      current: number;
      achievementRate: number;
    };
    orders: {
      target: number;
      current: number;
      achievementRate: number;
    };
  };
  nextAction: {
    message: string;
    urgency: 'high' | 'medium' | 'low';
    actionType: 'call' | 'appointment' | 'proposal' | 'visit' | 'negotiation' | 'order';
  };
}

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueTime?: string;
  actionType: 'call' | 'appointment' | 'proposal' | 'other';
  relatedCompany?: string;
}

export interface CallItem {
  id: string;
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  priority: 'high' | 'medium' | 'low';
  lastContactDate: string;
  industry: string;
  status: 'new' | 'negotiating' | 'proposal' | 'closed';
  purchasedProducts: string[];
  industryTrends: string[];
  keyPersons: {
    name: string;
    position: string;
    notes: string;
  }[];
  notes: string;
}

export interface ReferenceData {
  companyId: string;
  purchaseHistory: {
    productName: string;
    purchaseDate: string;
    amount: number;
  }[];
  contactHistory: {
    date: string;
    type: 'call' | 'meeting' | 'email';
    summary: string;
    outcome: string;
  }[];
  industryInfo: {
    trends: string[];
    challenges: string[];
    opportunities: string[];
  };
  keyPersons: {
    name: string;
    position: string;
    decisionMakingPower: 'high' | 'medium' | 'low';
    interests: string[];
    notes: string;
  }[];
}
