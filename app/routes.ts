import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [index("routes/home.tsx")]),

  ...prefix("api", [
    ...prefix("projects", [
      index("routes/api/projects/index.ts"),
      ...prefix(":projectId", [
        index("routes/api/projects/project.ts"),
        route("ping", "routes/api/projects/ping.ts"),
      ]),
    ]),
    route("kv/:projectId?", "routes/api/key-value-pairs/index.ts"),
    route("voltages/:projectId", "routes/api/voltages/index.ts"),
  ]),
] satisfies RouteConfig;
