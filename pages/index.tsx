import { useEffect, useState, useRef } from "react";

import Head from "next/head";
import styles from "@/styles/Home.module.css";

import { MonacoEditor } from "monaco-editor";
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Snackbar,
} from "@mui/material";

import Row from "@/components/Row";
import ProjectDialog from "@/components/ProjectDialog";

export default function Home() {
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tableData, setTableData] = useState<Project[]>([]);

  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [editProject, setEditProject] = useState<Project>();

  const [snackbar, setSnackbar] = useState({
    message: "",
    display: false,
  });

  let currentEditorRef = useRef<MonacoEditor>();

  const fetchProjects = () => {
    setLoading(true);
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setTableData(data);
      });
  };

  const editProjectHandler = (project: Project) => {
    console.log("Click, editProjectHandler", project);
  };

  const deleteProjectHandler = () => {
    console.log("Click, deleteProjectHandler");
  };

  const createProjectHandler = (project: Project) => {
    fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((res) => res.json())
      .then(() => {
        setShowProjectDialog(false);
        setSnackbar({
          message: "Project created",
          display: true,
        });
      });
  };

  const saveConfigHandler = () => {
    if (currentEditorRef.current) {
      setIsSaving(true);
      fetch("/api/configs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: currentEditorRef.current.getValue(),
      })
        .then((res) => res.json())
        .then(() => {
          setIsSaving(false);
          setSnackbar({
            message: "Configs saved successfully",
            display: true,
          });
        });
    }
  };

  const handleEditorDidMount = (editor: MonacoEditor) => {
    currentEditorRef.current = editor;
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <Head>
        <title>Config Manager</title>
        <meta
          name="description"
          content="Configuration management for Arduino project"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className={styles.main}>
        <Box sx={{ my: 4, display: "flex", justifyContent: "right" }}>
          <Button
            variant="contained"
            onClick={() => setShowProjectDialog(true)}
          >
            New Project
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell>Github</TableCell>
                <TableCell>Last Fetch</TableCell>
                <TableCell sx={{ width: 10, p: 0 }}></TableCell>
                <TableCell sx={{ width: 10, p: 0 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading &&
                tableData.map((project) => (
                  <Row
                    key={project.id}
                    project={project}
                    setShowProjectDialog={setShowProjectDialog}
                    deleteProjectHandler={deleteProjectHandler}
                    handleEditorDidMount={handleEditorDidMount}
                    saveConfigHandler={saveConfigHandler}
                    isSaving={isSaving}
                  />
                ))}
            </TableBody>
          </Table>
          {isLoading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          )}
        </TableContainer>
      </Container>

      <ProjectDialog
        open={showProjectDialog}
        setShowProjectDialog={setShowProjectDialog}
        createProjectHandler={createProjectHandler}
        editProject={editProject}
        editProjectHandler={editProjectHandler}
      />

      <Snackbar
        open={snackbar.display}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ message: "", display: false })}
        message={snackbar.message}
      />
    </>
  );
}
