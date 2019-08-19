import LineData from "./LineData";
import Role from "./Role";

export interface Dialog {
    id: string;
    name: string;
    roles: Role[];
    lines: LineData[];
    languageCode: string;
}

export interface ShallowDialog {
    id: string;
    name: string;
    languageCode: string;
}
