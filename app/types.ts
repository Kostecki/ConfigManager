type ProjectsJoined = {
  id: number;
  name: string;
  repoLink: string | null;
  lastSeen: string | null;
  batteryProject: boolean;
  createdAt: string;
  lastUpdatedAt: string | null;
  keyValuePairs?: [];
  voltages?: [];
};

export type { ProjectsJoined };
