interface Config {
  label: string;
  key: string;
  value: string | number;
  category: number;
  enabled: boolean;
  deleted?: boolean;
}

interface Project {
  id: number;
  projectName: string;
  githubLink: string;
  lastSeen: string;
  configs: Config[];
}
