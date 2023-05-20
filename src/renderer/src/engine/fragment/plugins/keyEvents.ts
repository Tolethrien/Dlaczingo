// import { keyPressed, keyOnce, keyLeave, fixedTime } from "../../Main/Engine.js";
import { keyTypes, keyPressed } from "../../main/inputHandlers";
import Plugin from "./plugin";
export default class KeyEvents extends Plugin {
  objectKeyUse: [];
  constructor({ position, size, layer, siblings, referanceName }) {
    super(position, size, siblings, layer, referanceName);
    this.objectKeyUse = [];
  }
  onKeyPressed(key: keyTypes, callback: () => void) {
    if (keyPressed.size !== 0 && keyPressed.has(key)) {
      callback();
      keyPressed.delete(key);
    }
  }
  onKeyHold(key: keyTypes, callback: () => void) {
    if (keyPressed.size !== 0 && keyPressed.has(key)) {
      callback();
    }
  }
}
