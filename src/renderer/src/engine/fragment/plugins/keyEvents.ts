import { keyTypes, keyPressed } from "../../main/inputHandlers";
import Plugin from "./plugin";
export default class KeyEvents extends Plugin {
  objectKeyUse: [];
  constructor(pluginProps: PluginProps) {
    super(pluginProps);
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
    return keyPressed.has(key) ? true : false;
  }
  isNotHolded(errorKeys?: keyTypes[]) {
    if (errorKeys && errorKeys.length !== 0) {
      return errorKeys.every((e) => (keyPressed.has(e) ? false : true)) ? true : false;
    } else {
      return true;
    }
  }
  keyAny() {
    return keyPressed.size !== 0 ? true : false;
  }
}
