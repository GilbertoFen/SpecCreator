export type SpecSection = {
  title: string;
  content: string[];
};

export type GeneratedSpec = {
  vision: SpecSection;
  usuarios: SpecSection;
  funcionalidades: SpecSection;
  flujos: SpecSection;
  arquitectura: SpecSection;
  requisitos: SpecSection;
};

export type SpecApiResponse = {
  spec: StoredSpecRecord;
  message?: string;
};

export type StoredSpecRecord = {
  createdAt: string;
  description: string;
  id: number;
  spec: GeneratedSpec;
  updatedAt: string;
};

export type SpecHistoryResponse = {
  specs: StoredSpecRecord[];
  message?: string;
};

export type BackendErrorPayload = {
  error?: string;
  message?: string;
  statusCode?: number;
};

export type LoginRequest = {
  password: string;
  username: string;
};

export type AuthenticatedUser = {
  id: number;
  lastLogin: string | null;
  registeredAt: string;
  username: string;
};

export type AuthLoginResponse = {
  message: string;
  user: AuthenticatedUser;
};

export const orderedSections: Array<keyof GeneratedSpec> = [
  'vision',
  'usuarios',
  'funcionalidades',
  'flujos',
  'arquitectura',
  'requisitos',
];

export const sectionLabels: Record<keyof GeneratedSpec, string> = {
  vision: 'Vision',
  usuarios: 'Usuarios',
  funcionalidades: 'Funcionalidades',
  flujos: 'Flujos',
  arquitectura: 'Arquitectura',
  requisitos: 'Requisitos',
};
