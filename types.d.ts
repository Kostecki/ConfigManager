interface Config {
  id?: number;
  projectId?: number;
  label: string;
  key: string;
  value: string | number;
  enabled: boolean;
  deleted?: boolean;
}

interface Project {
  id?: number;
  name: string;
  githubLink: string;
  lastSeen?: string;
  configs?: Config[];
}
