import LineData from "./LineData";

export default interface Dialog {
    id: string;
    name: string;
    lines: LineData[];
}
