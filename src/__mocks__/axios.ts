import {AxiosResponse} from "axios";
import Dialog from "../types/Dialog";

let mockResponse: AxiosResponse<{dialogs: Dialog[]}> = {
    data: {
        dialogs: [
            {
                name: "testDialog",
                lines: [
                    {
                        text: "Text for line 0.",
                        role: "Role 0",
                        key: 0,
                    },
                    {
                        text: "Text for line 1.",
                        role: "Role 1",
                        key: 1,
                    },
                    {
                        text: "Text for line 2.",
                        role: "Role 0",
                        key: 2,
                    },
                    {
                        text: "Text for line 3.",
                        role: "Role 1",
                        key: 3,
                    },
                ],
            }
        ]
    },
    status: 200,
    statusText: "OK",
    headers: {
        "Content-Type": "application/json; charset=utf-8"
    },
    config: {
    },
};


export default {
    get: jest.fn(() => Promise.resolve(mockResponse)),
};