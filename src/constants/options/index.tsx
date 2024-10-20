import profileImg from "@app/assets/images/avatar.png";

export const tasks = [
  {
    id: 1,
    title: "Make an Automatic Payment System that enable the design",
    desc: "#40000 aksjdnak aksdjqp ;apa",
    status: "Cancelled",
    formStatus: "Completed",
    subTask: [
      {
        id: 1,
        title: "Make an Automatic Payment System that enable the design",
        desc: "#40000 aksjdnak aksdjqp ;apa",
        status: "Cancelled",
        formStatus: "Completed",
      },
      {
        id: 2,
        title: "Make an Automatic Payment System that enable the design",
        desc: "#40000 aksjdnak aksdjqp ;apa",
        status: "Cancelled",
        formStatus: "Completed",
      },
    ],
  },
  {
    id: 2,
    title: "Make an Automatic Payment System that enable the design",
    desc: "#40000 aksjdnak aksdjqp ;apa",
    status: "Cancelled",
    formStatus: "Completed",
  },
  {
    id: 3,
    title: "Make an Automatic Payment System that enable the design",
    desc: "#40000 aksjdnak aksdjqp ;apa",
    status: "Cancelled",
    formStatus: "Completed",
  },
  {
    id: 4,
    title: "Make an Automatic Payment System that enable the design",
    desc: "#40000 aksjdnak aksdjqp ;apa",
    status: "Cancelled",
    formStatus: "Completed",
  },
  {
    id: 5,
    title: "Make an Automatic Payment System that enable the design",
    desc: "#40000 aksjdnak aksdjqp ;apa",
    status: "Cancelled",
    formStatus: "Completed",
  },
];

// export const projectForm = [
//   {
//     name: "title",
//     label: "Task Title",
//     type:"text" ,

//   },
//   {
//     name: "type",
//     label: "Task Type",
//     type:"text" ,

//   },
//   {
//     name: "desc",
//     label: "Task Description",
//     type:"text" ,

//   },
//   {
//     name: "desc",
//     label: "Task Description",
//     type:"date" ,
//   },
// ];

export const permissions = [
  {
    heading: "Project Management",
    child: [
      {
        label: "Create New Projects",
        userValue: "userCreateProject",
        clientValue: "clientCreateProject",
        adminValue: "adminCreateProject",
        rootValue: "rootCreateProject",
      },
      {
        label: "View Projects",
        userValue: "userCreateProject",
        clientValue: "clientCreateProject",
        adminValue: "adminCreateProject",
        rootValue: "rootCreateProject",
      },
      {
        label: "Edit Projects",
        userValue: "userCreateProject",
        clientValue: "clientCreateProject",
        adminValue: "adminCreateProject",
        rootValue: "rootCreateProject",
      },
      {
        label: "Delete Projects",
        userValue: "userCreateProject",
        clientValue: "clientCreateProject",
        adminValue: "adminCreateProject",
        rootValue: "rootCreateProject",
      },
    ],
  },
  {
    heading: "Task Management",
    child: [
      {
        label: "Create New Task",
        userValue: "userCreateProject",
        clientValue: "clientCreateProject",
        adminValue: "adminCreateProject",
        rootValue: "rootCreateProject",
      },
      {
        label: "View Tasks",
        userValue: "userCreateProject",
        clientValue: "clientCreateProject",
        adminValue: "adminCreateProject",
        rootValue: "rootCreateProject",
      },
      {
        label: "Edit Tasks",
        userValue: "userCreateProject",
        clientValue: "clientCreateProject",
        adminValue: "adminCreateProject",
        rootValue: "rootCreateProject",
      },
      {
        label: "Delete Tasks",
        userValue: "userCreateProject",
        clientValue: "clientCreateProject",
        adminValue: "adminCreateProject",
        rootValue: "rootCreateProject",
      },
    ],
  },
];

export const comments = [
  {
    userProfile: profileImg,
    user: "Patrick Handerson",
    title: "Commenting on a issue",
    children: {
      title: "replying on a issue",
    },
  },
];
