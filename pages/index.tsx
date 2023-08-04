import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
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
  const [tableData, setTableData] = useState<Project[]>([]);

  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project>();

  const [snackbar, setSnackbar] = useState({
    message: "",
    display: false,
  });

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
    fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      body: JSON.stringify(project),
    }).then((res) =>
      res.json().then(() => {
        setShowProjectDialog(false);
        fetchProjects();
        setSnackbar({
          message: "Project updated",
          display: true,
        });
      }),
    );
  };

  const deleteProjectHandler = (project: Project) => {
    fetch(`/api/projects/${project.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setShowProjectDialog(false);
        fetchProjects();
        setSnackbar({
          message: "Project deleted",
          display: true,
        });
      });
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
        setSelectedProject(undefined);
        fetchProjects();
        setSnackbar({
          message: "Project created",
          display: true,
        });
      });
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
          content="Configuration management for Arduino projects"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#2d89ef" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff" />
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
                <TableCell>Lastest Voltage</TableCell>
                <TableCell>JSON</TableCell>
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
                    setSelectedProject={setSelectedProject}
                    fetchProjects={fetchProjects}
                    setSnackbar={setSnackbar}
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
        setSelectedProject={setSelectedProject}
        createProjectHandler={createProjectHandler}
        selectedProject={selectedProject}
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
