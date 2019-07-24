import LineData from "./LineData";
import Role from "./Role";

export default interface Dialog {
    id: string;
    name: string;
    roles: Role[];
    lines: LineData[];
}
