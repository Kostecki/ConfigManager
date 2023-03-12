import { useState, Dispatch, SetStateAction, useEffect } from "react";

import { MonacoEditor } from "monaco-editor";
import {
  Box,
  Button,
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

const Row = (props: {
  project: Project;
  editProjectHandler: () => void;
  deleteProjectHandler: () => void;
  handleEditorDidMount: (editor: MonacoEditor) => void;
  saveConfigHandler: () => void;
  isSaving: boolean;
}) => {
  const {
    project,
    editProjectHandler,
    deleteProjectHandler,
    handleEditorDidMount,
    saveConfigHandler,
    isSaving,
  } = props;
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [configs, setConfigs] = useState<Config[]>();

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
        onClick={() => setOpen(!open)}
      >
        <TableCell component="th">{project.name}</TableCell>
        <TableCell component="th">
          <Link href={project.githubLink} target="_blank">
            {project.githubLink}
          </Link>
        </TableCell>
        <TableCell>{project.lastSeen ?? "-"}</TableCell>
        <TableCell component="th" sx={{ p: 1 }}>
          <IconButton onClick={editProjectHandler}>
            <ModeEditIcon />
          </IconButton>
        </TableCell>
        <TableCell component="th" sx={{ p: 1 }}>
          <IconButton onClick={deleteProjectHandler}>
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
    </>
  );
};

export default Row;
