import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  ChangeEvent,
} from "react";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Link,
  Switch,
  Tab,
  TableCell,
  TableRow,
  Tabs,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import LinkIcon from "@mui/icons-material/Link";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteDialog from "@/components/DeleteDialog";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import UndoIcon from "@mui/icons-material/Undo";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import VoltageGraph from "./VoltageGraph";

const Row = (props: {
  project: Project;
  setShowProjectDialog: Dispatch<SetStateAction<boolean>>;
  setSelectedProject: Dispatch<SetStateAction<Project | undefined>>;
  fetchProjects: () => void;
  setSnackbar: Dispatch<SetStateAction<{ message: string; display: boolean }>>;
}) => {
  const {
    project,
    setShowProjectDialog,
    setSelectedProject,
    fetchProjects,
    setSnackbar,
  } = props;
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [configs, setConfigs] = useState<Config[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState<Number[]>([]);

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

  const showVoltage = () => {
    const voltages = project?.Voltages;
    if (voltages?.length) {
      return `${voltages[0].reading.toLocaleString()} V`;
    } else {
      return "-";
    }
  };

  const addField = () => {
    if (project.id) {
      const newField = {
        enabled: false,
        key: "",
        label: "",
        value: "",
        projectId: project.id,
      };

      setConfigs([...configs, newField]);
    }
  };

  const removeField = (id?: number) => {
    if (!id) {
      return;
    }

    const deleted = [...toBeDeleted];
    deleted.push(id);
    setToBeDeleted(deleted);
  };

  const undoDelete = (id: number) => {
    let deleted = [...toBeDeleted];
    deleted = deleted.filter((e) => e !== id);
    setToBeDeleted(deleted);
  };

  const handleFormChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value, checked } = event.target;
    const payload = name === "enabled" ? checked : value;

    let data = [...configs];
    data[index][name] = payload;
    setConfigs(data);
  };

  const saveConfig = () => {
    setIsSaving(true);

    const confsNotEmpty = configs.filter(
      (conf) => conf.key && conf.label && conf.value,
    );

    fetch("/api/configs", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updated: confsNotEmpty,
        deleted: toBeDeleted,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setIsSaving(false);
        fetchData();
        setSnackbar({
          message: "Configs saved successfully",
          display: true,
        });
      });
  };

  const fetchData = () => {
    fetch(`/api/projects/${project.id}`)
      .then((res) => res.json())
      .then((data) => setConfigs(data.config));
  };

  function ActionButton({ id }: { id?: number }) {
    if (!id) {
      return (
        <IconButton size="small" disabled={true}>
          <AgricultureIcon
            sx={{
              color: "white",
            }}
          />
        </IconButton>
      );
    } else if (toBeDeleted.includes(id)) {
      return (
        <IconButton size="small" onClick={() => undoDelete(id)}>
          <UndoIcon />
        </IconButton>
      );
    } else {
      return (
        <IconButton size="small" onClick={() => removeField(id)}>
          <ClearIcon />
        </IconButton>
      );
    }
  }

  useEffect(() => {
    if (open) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, project.id]);

  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
        <TableCell component="th">
          {project.battery ? (
            <BatteryChargingFullIcon />
          ) : (
            <ElectricalServicesIcon />
          )}
        </TableCell>
        <TableCell component="th">{project.name}</TableCell>
        <TableCell component="th">
          <Link href={project.githubLink} target="_blank">
            {project.githubLink}
          </Link>
        </TableCell>
        <TableCell>
          {dayjs(project.lastSeen).format("DD-MM-YYYY, HH:mm") ?? "-"}
        </TableCell>
        <TableCell>{showVoltage()}</TableCell>
        <TableCell component="th" sx={{ p: 1 }}>
          <IconButton href={`/api/configs/${project.id}`} target="_blank">
            <LinkIcon />
          </IconButton>
        </TableCell>
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
            <Box sx={{ mx: 3, my: 2, borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={handleChange}>
                <Tab label="Config" />
                <Tab label="Voltage" />
              </Tabs>
            </Box>

            {value === 0 && (
              <>
                <Box sx={{ py: 2 }}>
                  {configs?.map((config, index) => {
                    const { enabled, key, label, value, id } = config;

                    return (
                      <Box
                        key={index}
                        component="form"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          my: 1,
                          mx: 2,
                          opacity: toBeDeleted.includes(id!) ? "0.6" : 1,
                          "& .MuiTextField-root": {
                            m: 1,
                            width: "calc(100% - 16px)",
                          },
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        <Switch
                          name="enabled"
                          checked={enabled}
                          disabled={toBeDeleted.includes(id!)}
                          onChange={(event) => handleFormChange(index, event)}
                        />
                        <TextField
                          type="text"
                          size="small"
                          name="label"
                          label="Label"
                          value={label}
                          disabled={toBeDeleted.includes(id!)}
                          onChange={(event) =>
                            handleFormChange(
                              index,
                              event as ChangeEvent<HTMLInputElement>,
                            )
                          }
                        />
                        <TextField
                          type="text"
                          size="small"
                          name="key"
                          label="Key"
                          value={key}
                          disabled={toBeDeleted.includes(id!)}
                          onChange={(event) =>
                            handleFormChange(
                              index,
                              event as ChangeEvent<HTMLInputElement>,
                            )
                          }
                        />
                        <TextField
                          type="text"
                          size="small"
                          name="value"
                          label="Value"
                          value={value}
                          disabled={toBeDeleted.includes(id!)}
                          onChange={(event) =>
                            handleFormChange(
                              index,
                              event as ChangeEvent<HTMLInputElement>,
                            )
                          }
                        />
                        <ActionButton id={id} />
                      </Box>
                    );
                  })}
                  <Box
                    sx={{ display: "flex", justifyContent: "center", pt: 2 }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<AddCircleIcon />}
                      onClick={addField}
                    >
                      Add Field
                    </Button>
                  </Box>
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
                    onClick={saveConfig}
                  >
                    Save Config
                  </LoadingButton>
                </Box>
              </>
            )}

            {value === 1 && project.id && (
              <Box sx={{ mx: 3, mt: 2, mb: 4 }}>
                <VoltageGraph projectId={project.id} />
              </Box>
            )}
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
