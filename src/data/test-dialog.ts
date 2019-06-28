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
