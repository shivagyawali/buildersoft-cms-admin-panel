import {
  FgPerformanceIcon,
  FgProjectIcon,
  FgSettingIcon,
  FgTaskIcon,
  FgWorkLogsIcon,
} from "../SVGCollection";

export const menuItems = [
  {
    name: "Project",
    icon: FgProjectIcon(),
    path: "/admin/project",
  },
  {
    name: "Tasks",
    icon: FgTaskIcon(),
    path: "/admin/tasks",
  },
  {
    name: "Work Logs",
    icon: FgWorkLogsIcon(),
    path: "/admin/work-logs",
  },
  {
    name: "Performance",
    icon: FgPerformanceIcon(),
    path: "/admin/performance",
  },
  {
    name: "Settings",
    icon: FgSettingIcon(),
    path: "/admin/settings",
  },
];
export const userMenu = [
  {
    name: "Project",
    icon: FgProjectIcon(),
    path: "/user/project",
  },
  {
    name: "Tasks",
    icon: FgTaskIcon(),
    path: "/user/tasks",
  },
  {
    name: "Work Logs",
    icon: FgWorkLogsIcon(),
    path: "/user/work-logs",
  },
  {
    name: "Performance",
    icon: FgPerformanceIcon(),
    path: "/user/performance",
  },
  {
    name: "Settings",
    icon: FgSettingIcon(),
    path: "/user/settings",
  },
];

export const taskAssignedTo = [
  {
    label: "Option 1",
    value: 1,
  },
  {
    label: "Option 2",
    value: 2,
  },
  {
    label: "Option 3",
    value: 3,
  },
];
