import LineData from "./LineData";

export default interface Dialog {
    name: string;
    roles: string[];
    lines: LineData[];
}