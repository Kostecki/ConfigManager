import { Dispatch, SetStateAction, useState, useEffect } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

export default function CreateProjectDialog(props: {
  open: boolean;
  setShowProjectDialog: Dispatch<SetStateAction<boolean>>;
  setSelectedProject: Dispatch<SetStateAction<Project | undefined>>;
  createProjectHandler: (project: Project) => void;
  selectedProject?: Project;
  editProjectHandler: (project: Project) => void;
}) {
  const {
    open,
    setShowProjectDialog,
    setSelectedProject,
    createProjectHandler,
    selectedProject,
    editProjectHandler,
  } = props;

  const [name, setName] = useState("");
  const [githubLink, setGithubLink] = useState("");

  const saveHandler = () => {
    if (selectedProject) {
      editProjectHandler({ ...selectedProject, name, githubLink });
    } else {
      createProjectHandler({
        name,
        githubLink,
      });
    }
  };

  const closeHandler = () => {
    setName("");
    setGithubLink("");

    setSelectedProject(undefined);
    setShowProjectDialog(false);
  };

  useEffect(() => {
    setName(selectedProject?.name ?? "");
    setGithubLink(selectedProject?.githubLink ?? "");
  }, [selectedProject]);

  return (
    <Dialog open={open} onClose={closeHandler}>
      <DialogTitle>Create project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Project Name"
          type="project-name"
          fullWidth
          variant="standard"
          required
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setName(event.target.value)
          }
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Github Link"
          type="github-link"
          fullWidth
          variant="standard"
          value={githubLink}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setGithubLink(event.target.value)
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={saveHandler}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
