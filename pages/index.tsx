import { useEffect, useState } from "react";

import Head from "next/head";
import styles from "@/styles/Home.module.css";

import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Container,
  Divider,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Grid from "@mui/system/Unstable_Grid/Grid";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import UndoIcon from "@mui/icons-material/Undo";

interface Category {
  id: number;
  order: number;
  name: string;
}

interface Config {
  label: string;
  key: string;
  value: string | number;
  category: number;
  enabled: boolean;
  deleted?: boolean;
}

interface Row {
  id: number;
  projectName: string;
  githubLink: string;
  lastSeen: string;
  configs: Config[];
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [rows, setRows] = useState<Row[]>([]);

  const editProjectHandler = () => {
    console.log("Click, editProjectHandler");
  };

  const deleteProjectHandler = () => {
    console.log("Click, deleteProjectHandler");
  };

  const newProjectHandler = () => {
    console.log("Click, newProjectHandler");
  };

  const newConfigHandler = (projectId: number, categoryId: number) => {
    const payload = rows;
    payload[projectId].configs.push({
      label: "",
      key: "",
      value: "",
      category: categoryId,
      enabled: false,
    });

    setRows([...payload]);
  };

  const deleteConfigHandler = (projectId: number, configKey: string) => {
    let payload = rows;

    const index = payload[projectId].configs.findIndex(
      (config) => config.key === configKey
    );

    if (!configKey) {
      payload[projectId].configs.splice(index, 1);
    } else {
      payload[projectId].configs[index].deleted =
        !payload[projectId].configs[index].deleted;
    }

    setRows([...payload]);
  };

  const newGroupHandler = () => {
    console.log("Click, newGroupHandler");
  };

  const saveConfigHandler = () => {
    console.log("saveConfigHandler");
  };

  const updateFieldValue = (
    input: string,
    projectId: number,
    categoryId: number,
    groupIndex: number
  ) => {
    const payload = rows;
    const config = payload[projectId].configs.filter(
      (config) => config.category === categoryId
    );

    console.log(config, payload);
  };

  function Config(props: {
    config: Config;
    projectId: number;
    groupIndex: number;
  }) {
    const { config, projectId, groupIndex } = props;

    return (
      <Grid
        container
        spacing={2}
        sx={{ mx: 1 }}
        className={`${config.deleted ? "deleted" : ""}`}
      >
        <Grid sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox checked={config.enabled} disabled={config.deleted} />
        </Grid>
        <Grid xs>
          <TextField
            label="Name"
            defaultValue={config.label}
            size="small"
            disabled={config.deleted}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              updateFieldValue(
                event.target.value,
                projectId,
                config.category,
                groupIndex
              );
            }}
          />
        </Grid>
        <Grid xs>
          <TextField
            label="Key"
            defaultValue={config.key}
            size="small"
            disabled={config.deleted}
          />
        </Grid>
        <Grid xs>
          <TextField
            label="Value"
            defaultValue={config.value}
            size="small"
            disabled={config.deleted}
          />
        </Grid>
        <Grid sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => deleteConfigHandler(projectId, config.key)}
          >
            {config.deleted ? <UndoIcon /> : <DeleteIcon />}
          </IconButton>
        </Grid>
      </Grid>
    );
  }

  const groupedConfigs = (config: Config[]) => {
    return config.reduce(function (memo: any, x: any) {
      if (!memo[x["category"]]) {
        memo[x["category"]] = [];
      }
      memo[x["category"]].push(x);
      return memo;
    }, []);
  };

  function Row(props: { row: Row }) {
    const { row } = props;
    const [open, setOpen] = useState(true);

    const keysLength = row.configs.length;

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
          <TableCell component="th">{row.projectName}</TableCell>
          <TableCell component="th">{keysLength}</TableCell>
          <TableCell component="th">
            <Link href={row.githubLink} target="_blank">
              {row.githubLink}
            </Link>
          </TableCell>
          <TableCell>{row.lastSeen}</TableCell>
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
                  p: 2,
                  "& .MuiTextField-root": {
                    m: 1,
                    width: "calc(100% - 16px)",
                  },
                }}
                noValidate
                autoComplete="off"
              >
                <Grid container>
                  <Grid xs={12} sx={{ mb: 2 }}>
                    {groupedConfigs(row.configs).map(
                      (group: Config[], index: any) => (
                        <Box key={index} sx={{ mb: 4 }}>
                          <Box sx={{ mx: 1, mb: 2 }}>
                            <Typography variant="h5">
                              {categories[index].name}
                            </Typography>
                            <Divider />
                          </Box>
                          {group.map((config, i) => (
                            <Config
                              key={row.id}
                              config={config}
                              projectId={row.id}
                              groupIndex={i}
                            />
                          ))}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "right",
                              mt: 1,
                              mr: 2,
                            }}
                          >
                            <IconButton
                              onClick={() => newConfigHandler(row.id, index)}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      )
                    )}
                  </Grid>
                </Grid>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  px: 3,
                  pb: 3,
                }}
              >
                <Button variant="outlined" onClick={newGroupHandler}>
                  New Group
                </Button>
                <Button variant="contained" onClick={saveConfigHandler}>
                  Save Config
                </Button>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  useEffect(() => {
    setCategories([
      {
        id: 0,
        order: 99,
        name: "Miscellaneous",
      },
      {
        id: 1,
        order: 0,
        name: "WiFi",
      },
      {
        id: 2,
        order: 1,
        name: "MQTT",
      },
    ]);

    setRows([
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
              {rows.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
