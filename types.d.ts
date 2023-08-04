interface Config {
  [key: string]: any;
  id?: number;
  projectId?: number;
  label: string;
  key: string;
  value: string | number;
  enabled: boolean;
  deleted?: boolean;
}

interface Voltages {
  id: number;
  reading: number;
  createdAt: string;
}

interface Project {
  id?: number;
  name: string;
  githubLink: string;
  lastSeen?: string;
  configs?: Config[];
  Voltages: Voltages[];
}
