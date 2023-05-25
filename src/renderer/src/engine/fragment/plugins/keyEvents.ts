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
  onKeyHold(keys: keyTypes[], callback: () => void, errorKeys?: keyTypes[]) {
    if (keyPressed.size !== 0 && keys.every((e) => (keyPressed.has(e) ? true : false))) {
      if (errorKeys && errorKeys.length !== 0) {
        if (errorKeys.every((e) => (keyPressed.has(e) ? false : true))) {
          callback();
        }
      } else {
        callback();
      }
    }
  }
  isKeyHolded(key: keyTypes) {
    if (keyPressed.has(key)) return true;
    return false;
  }
  isNotHolded(errorKeys?: keyTypes[]) {
    if (errorKeys && errorKeys.length !== 0) {
      if (errorKeys.every((e) => (keyPressed.has(e) ? false : true))) {
        return true;
      } else return false;
    } else {
      return true;
    }
  }
  keyAny() {
    if (keyPressed.size !== 0) return true;
    return false;
  }
}
