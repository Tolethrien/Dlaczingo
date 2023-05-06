export type AllKey = "d" | "a" | "w";
type KeyList = { [key in AllKey]?: (() => void) | undefined };
const keyList: KeyList = {};
export default keyList;
