import { Dispatch, SetStateAction, useState, useEffect } from "react";

import { MonacoEditor } from "monaco-editor";
import {
  Box,
  Collapse,
  IconButton,
  Link,
  TableCell,
  TableRow,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

import Editor from "./Editor";
import DeleteDialog from "@/components/DeleteDialog";

const Row = (props: {
  project: Project;
  setShowProjectDialog: Dispatch<SetStateAction<boolean>>;
  setSelectedProject: Dispatch<SetStateAction<Project | undefined>>;
  handleEditorDidMount: (editor: MonacoEditor) => void;
  saveConfigHandler: () => void;
  fetchProjects: () => void;
  setSnackbar: Dispatch<SetStateAction<{ message: string; display: boolean }>>;
  isSaving: boolean;
}) => {
  const {
    project,
    setShowProjectDialog,
    setSelectedProject,
    handleEditorDidMount,
    saveConfigHandler,
    fetchProjects,
    setSnackbar,
    isSaving,
  } = props;
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [configs, setConfigs] = useState<Config[]>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const rowClick = (event: any) => {
    const blacklistedTags = ["A", "path", "svg"];
    if (!blacklistedTags.includes(event.target.tagName)) {
      setOpen(!open);
    }
  };

  const editClick = () => {
    setSelectedProject(project);
    setShowProjectDialog(true);
  };

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch(`/api/projects/${project.id}`)
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          setConfigs(data.configs);
        });
    }
  }, [open, project.id]);

  return (
    <>
      <TableRow
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
          "&:hover": { cursor: "pointer" },
        }}
        hover
        onClick={rowClick}
      >
        <TableCell component="th">{project.name}</TableCell>
        <TableCell component="th">
          <Link href={project.githubLink} target="_blank">
            {project.githubLink}
          </Link>
        </TableCell>
        <TableCell>{project.lastSeen ?? "-"}</TableCell>
        <TableCell component="th" sx={{ p: 1 }}>
          <IconButton onClick={editClick}>
            <ModeEditIcon />
          </IconButton>
        </TableCell>
        <TableCell component="th" sx={{ p: 1 }}>
          <IconButton onClick={() => setShowDeleteDialog(true)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={100} sx={{ m: 5, p: 0 }}>
          <Collapse in={open} timeout="auto">
            <Box
              component="form"
              sx={{
                py: 2,
                "& .MuiTextField-root": {
                  m: 1,
                  width: "calc(100% - 16px)",
                },
              }}
              noValidate
              autoComplete="off"
            >
              <Editor
                value={JSON.stringify(configs)}
                handleEditorDidMount={handleEditorDidMount}
                isLoading={isLoading}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                px: 3,
                pb: 3,
              }}
            >
              <LoadingButton
                loading={isSaving}
                variant="contained"
                onClick={saveConfigHandler}
              >
                Save Config
              </LoadingButton>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <DeleteDialog
        open={showDeleteDialog}
        project={project}
        setShowDeleteDialog={setShowDeleteDialog}
        fetchProjects={fetchProjects}
        setSnackbar={setSnackbar}
      />
    </>
  );
};

export default Row;
