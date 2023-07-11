import { mouseProxymityList, getMousePosition, mousePressed } from "../../main/inputHandlers";
import Plugin from "./plugin";

export default class MouseEvents extends Plugin {
  protected events: Map<string, undefined | (() => void)>;
  private mousePositionType: "fixed" | "translated";
  constructor(pluginProps: PluginProps) {
    super(pluginProps);
    this.mousePositionType = this.layer !== "uiObjects" ? "translated" : "fixed";
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
      getMousePosition(this.mousePositionType).x >= this.position.get().x &&
      getMousePosition(this.mousePositionType).x <= this.position.get().x + this.size.get().x &&
      getMousePosition(this.mousePositionType).y >= this.position.get().y &&
      getMousePosition(this.mousePositionType).y <= this.position.get().y + this.size.get().y &&
      true
    );
  }
}
