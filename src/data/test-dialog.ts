import Dialog from "../types/Dialog";

export const testDialog: Dialog = {
    name: "Test Dialog",
    roles: ["Role 0", "Role 1"],
    lines: [
        {
            text: "Text for line 0.",
            guess: "",
            role: "Role 0",
            key: 0,
        },
        {
            text: "Text for line 1.",
            guess: "",
            role: "Role 1",
            key: 1,
        },
        {
            text: "Text for line 2.",
            guess: "",
            role: "Role 0",
            key: 2,
        },
        {
            text: "Text for line 3.",
            guess: "",
            role: "Role 1",
            key: 3,
        },
    ],
};

export const testDialogs: Dialog[] = [
  {
    name: "Dialog 0",
    roles: ["Role 0.0", "Role 0.1"],
    lines: [
      {
        text: "Text for line 0.0.",
        guess: "",
        role: "Role 0.0",
        key: 0,
      },
      {
        text: "Text for line 0.1.",
        guess: "",
        role: "Role 0.1",
        key: 1,
      },
      {
        text: "Text for line 0.2.",
        guess: "",
        role: "Role 0.0",
        key: 2,
      },
      {
        text: "Text for line 0.3.",
        guess: "",
        role: "Role 0.1",
        key: 3,
      },
    ],
  },
  {
    name: "Dialog 1",
    roles: ["Role 1.0", "Role 1.1"],
    lines: [
      {
        text: "Text for line 1.0.",
        guess: "",
        role: "Role 1.0",
        key: 0,
      },
      {
        text: "Text for line 1.1.",
        guess: "",
        role: "Role 1.1",
        key: 1,
      },
      {
        text: "Text for line 1.2.",
        guess: "",
        role: "Role 1.0",
        key: 2,
      },
      {
        text: "Text for line 1.3.",
        guess: "",
        role: "Role 1.1",
        key: 3,
      },
    ],
  },
];
