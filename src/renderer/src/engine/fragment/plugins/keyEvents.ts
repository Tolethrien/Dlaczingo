// import { keyPressed, keyOnce, keyLeave, fixedTime } from "../../Main/Engine.js";
import { keyTypes, keyHoldList, keyList } from "../../main/inputHandlers";
import Plugin from "./plugin";
export interface keyEventsType extends KeyEvents {}
export default class KeyEvents extends Plugin {
  constructor({ position, size, layer, siblings, referanceName }) {
    super(position, size, siblings, layer, referanceName);
  }

  addKeyPressed(key: keyTypes, callback: () => void) {
    if (keyList[key] !== undefined || keyHoldList.has(key))
      console.warn(
        `You are trying to assign functionality to a button(${key}) that already has another value assigned to it, make sure you are not accidentally overwriting it!`
      );
    keyList[key] = callback;
  }
  addKeyHold(key: keyTypes, callback: () => void) {
    if (keyList[key] !== undefined || keyHoldList.has(key))
      console.warn(
        `You are trying to assign functionality to a button(${key}) that already has another value assigned to it, make sure you are not accidentally overwriting it!`
      );
    keyHoldList.set(key, callback);
  }
}
