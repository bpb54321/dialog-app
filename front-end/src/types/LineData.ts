import Role from "./Role";

export default interface LineData {
    id: string;
    text: string;
    guess?: string;
    role: Role;
    number: number;
}
