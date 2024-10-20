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
    title: "Commenting on an issue",
    image:
      "data:image/webp;base64,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",
    children: {
      title: "replying on an issue",
    },
  },
];
