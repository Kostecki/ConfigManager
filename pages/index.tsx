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
} from "@mui/material";

import Row from "@/components/Row";

export default function Home() {
  const [tableData, setTableData] = useState<Project[]>([]);
  const [openProject, setOpenProject] = useState<Project>();

  let currentEditorRef = useRef<MonacoEditor>();

  const editProjectHandler = () => {
    console.log("Click, editProjectHandler");
  };

  const deleteProjectHandler = () => {
    console.log("Click, deleteProjectHandler");
  };

  const newProjectHandler = () => {
    console.log("Click, newProjectHandler");
  };

  const saveConfigHandler = () => {
    if (currentEditorRef.current) {
      const data = JSON.parse(currentEditorRef.current.getValue());
      console.log(data, openProject?.id);
    }
  };

  const handleEditorDidMount = (editor: MonacoEditor) => {
    currentEditorRef.current = editor;

    setTimeout(() => {
      editor.getAction("editor.action.formatDocument")?.run();
    }, 100);
  };

  useEffect(() => {
    setTableData([
      {
        id: 0,
        projectName: "MailboxNotifier",
        githubLink: "https://github.com/Kostecki/MailboxNotifier",
        lastSeen: "05/02/2023 - 02.42",
        configs: [
          {
            label: "SSID",
            key: "wifi-ssid",
            value: "Legacy",
            category: 1,
            enabled: true,
          },
          {
            label: "Password",
            key: "wifi-password",
            value: "Password",
            category: 1,
            enabled: true,
          },
          {
            label: "URL",
            key: "mqtt-url",
            value: "tower.lan",
            category: 2,
            enabled: true,
          },
          {
            label: "Port",
            key: "mqtt-port",
            value: 1883,
            category: 2,
            enabled: true,
          },
          {
            label: "Username",
            key: "mqtt-username",
            value: "mailbox",
            category: 2,
            enabled: true,
          },
          {
            label: "Password",
            key: "mqtt-password",
            value: "Password",
            category: 2,
            enabled: true,
          },
          {
            label: "Topic",
            key: "mqtt-topic",
            value: "smart/mailbox",
            category: 2,
            enabled: true,
          },
          {
            label: "Low Voltage Topic",
            key: "low-voltage-topic",
            value: "smart/mailbox/battery",
            category: 0,
            enabled: true,
          },
          {
            label: "Low Voltage Threshold",
            key: "low-voltage-threshold",
            value: 3.0,
            category: 0,
            enabled: true,
          },
        ],
      },
    ]);
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
          <Button variant="contained" onClick={newProjectHandler}>
            New Project
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell>Keys</TableCell>
                <TableCell>Github</TableCell>
                <TableCell>Last Fetch</TableCell>
                <TableCell sx={{ width: 10, p: 0 }}></TableCell>
                <TableCell sx={{ width: 10, p: 0 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((project) => (
                <Row
                  key={project.id}
                  project={project}
                  editProjectHandler={editProjectHandler}
                  deleteProjectHandler={deleteProjectHandler}
                  openProjectHandler={setOpenProject}
                  handleEditorDidMount={handleEditorDidMount}
                  saveConfigHandler={saveConfigHandler}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
