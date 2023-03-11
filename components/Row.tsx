import { useState, Dispatch, SetStateAction } from "react";

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
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

import Editor from "./Editor";

const Row = (props: {
  project: Project;
  editProjectHandler: () => void;
  deleteProjectHandler: () => void;
  openProjectHandler: Dispatch<SetStateAction<Project | undefined>>;
  handleEditorDidMount: (editor: MonacoEditor) => void;
  saveConfigHandler: () => void;
}) => {
  const {
    project,
    editProjectHandler,
    deleteProjectHandler,
    openProjectHandler,
    handleEditorDidMount,
    saveConfigHandler,
  } = props;
  const [open, setOpen] = useState(false);
  const keysLength = project.configs.length;

  openProjectHandler(project);

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
        <TableCell component="th">{project.projectName}</TableCell>
        <TableCell component="th">{keysLength}</TableCell>
        <TableCell component="th">
          <Link href={project.githubLink} target="_blank">
            {project.githubLink}
          </Link>
        </TableCell>
        <TableCell>{project.lastSeen}</TableCell>
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
                value={JSON.stringify(project.configs)}
                handleEditorDidMount={handleEditorDidMount}
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
              <Button variant="contained" onClick={saveConfigHandler}>
                Save Config
              </Button>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
