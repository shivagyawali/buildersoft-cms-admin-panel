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
