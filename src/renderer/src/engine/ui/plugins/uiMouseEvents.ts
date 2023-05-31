import { getMousePosition, mousePressed, mouseProxymityList } from "../../main/inputHandlers";
import UIPlugin from "./uiPlugin";

export default class UiMouseEvents extends UIPlugin {
  protected events: Map<string, undefined | (() => void)>;
  constructor({ position, size, relatedTo, siblings, referanceName }) {
    super(position, size, siblings, referanceName, relatedTo);
    this.events = new Map([
      ["left", undefined],
      ["right", undefined],
      ["middle", undefined],
      ["dragOut", undefined]
    ]);
  }

  addEvent(button: "left" | "right" | "middle" | "dragOut", callback: () => void) {
    this.events.set(button, callback);
  }
  update() {
    this.mouseOnTarget();
  }
  onClickEvent() {
    this.events.get("left")?.();
  }
  onClickMiddleEvent() {
    this.events.get("middle")?.();
  }
  onContextEvent() {
    this.events.get("right")?.();
  }
  onDragOut() {
    console.log("drag");
  }

  mouseOnTarget() {
    mousePressed && this.mouseCollide() && mouseProxymityList.add(this);
  }
  clickOutside() {
    return mousePressed && !this.mouseCollide() && true;
  }

  mouseCollide() {
    return (
      getMousePosition("fixed").x >= this.relatedTo.get().x + this.position.get().x &&
      getMousePosition("fixed").x <=
        this.relatedTo.get().x + this.position.get().x + this.size.get().x &&
      getMousePosition("fixed").y >= this.relatedTo.get().y + this.position.get().y &&
      getMousePosition("fixed").y <=
        this.relatedTo.get().y + this.position.get().y + this.size.get().y &&
      true
    );
  }
}
