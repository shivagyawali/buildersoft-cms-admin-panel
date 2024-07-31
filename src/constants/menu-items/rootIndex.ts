import { FgPerformanceIcon, FgProjectIcon, FgSettingIcon, FgTaskIcon, FgWorkLogsIcon } from "../SVGCollection";

export const menuItems = [
  {
    name: "Project",
    icon: FgProjectIcon(),
    path: "/project",
  },
  {
    name: "Tasks",
    icon: FgTaskIcon(),
    path: "/tasks",
  },
  {
    name: "Work Logs",
    icon: FgWorkLogsIcon(),
    path: "/work-logs",
  },
  {
    name: "Performance",
    icon: FgPerformanceIcon(),
    path: "/performance",
  },
  {
    name: "Settings",
    icon: FgSettingIcon(),
    path: "/settings",
  },
];
