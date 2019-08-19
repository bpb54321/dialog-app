exports.testDialogs = [
  {
    name: "Dialog 0",
    roles: [
      {
        id: 0,
        name: "Role 0.0"
      },
      {
        id: 1,
        name: "Role 0.1"
      }
    ],
    lines: [
      {
        id: 0,
        text: "Text for line 0.0.",
        guess: "",
        role: {
          id: 0,
          name: "Role 0.0"
        },
        number: 0
      },
      {
        id: 1,
        text: "Text for line 0.1.",
        guess: "",
        role: {
          id: 1,
          name: "Role 0.1"
        },
        number: 1
      },
    ],
  },
  {
    name: "Dialog 1",
    roles: [
      {
        id: 0,
        name: "Role 1.0"
      },
      {
        id: 1,
        name: "Role 1.1"
      }
    ],
    lines: [
      {
        id: 4,
        text: "Text for line 1.0.",
        guess: "",
        role: {
          id: 0,
          name: "Role 1.0"
        },
        number: 0
      },
      {
        id: 5,
        text: "Text for line 1.1.",
        guess: "",
        role: {
          id: 1,
          name: "Role 1.1"
        },
        number: 1
      },
    ],
  },
];
