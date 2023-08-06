import { Dispatch, SetStateAction, useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
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
  const [battery, setBattery] = useState(false);

  const saveHandler = () => {
    if (selectedProject) {
      const data = selectedProject;
      delete selectedProject.Voltages;

      editProjectHandler({ ...data, name, githubLink, battery });
    } else {
      createProjectHandler({
        name,
        githubLink,
        battery,
      });
    }
  };

  const closeHandler = () => {
    setName("");
    setGithubLink("");
    setBattery(false);

    setSelectedProject(undefined);
    setShowProjectDialog(false);
  };

  useEffect(() => {
    setName(selectedProject?.name ?? "");
    setGithubLink(selectedProject?.githubLink ?? "");
    setBattery(selectedProject?.battery ?? false);
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
        <FormGroup sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={battery}
                onChange={(e) => setBattery(e.target.checked)}
              />
            }
            label="Battery-project"
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={saveHandler}>
          {selectedProject ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
