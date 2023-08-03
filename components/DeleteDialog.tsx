import { Dispatch, SetStateAction } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function DeleteDialog(props: {
  open: boolean;
  project: Project;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  fetchProjects: () => void;
  setSnackbar: Dispatch<SetStateAction<{ message: string; display: boolean }>>;
}) {
  const { open, project, setShowDeleteDialog, fetchProjects, setSnackbar } =
    props;

  const deleteProject = () => {
    fetch(`/api/projects/${project.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        fetchProjects();
        setSnackbar({
          message: "Project deleted",
          display: true,
        });
      });
  };

  return (
    <Dialog open={open} onClose={() => setShowDeleteDialog(false)}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        This will delete the project and cannot be undone.
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowDeleteDialog(false)}>No</Button>
        <Button onClick={deleteProject}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
