import LineData from "./LineData";
import Role from "./Role";

export interface Dialog {
    id: string;
    name: string;
    roles: Role[];
    lines: LineData[];
}

export interface ShallowDialog {
    id: string;
    name: string;
}
