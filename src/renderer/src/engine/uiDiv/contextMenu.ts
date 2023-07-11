import { mousePressed } from "../main/inputHandlers";
import Element from "./element";
import Invent from "./invent";

export default class ContextMenu extends Element {
  renderer!: RendererType;
  mouseEvents!: MouseEventsType;
  onclick: () => void;
  constructor(parent, func) {
    super({ pos: { x: 25, y: 25 }, size: { height: 80, width: 40 }, tags: [], relatedTo: parent });
    this.attachPlugin("mouseEvents");
    this.attachPlugin("renderer");
    this.renderer.display("shape", { fill: { color: [110, 0, 100] }, debugText: "a", round: 0 });
    this.active = true;
    this.onclick = func;

    this.mouseEvents.addEvent("left", () => {
      console.log("ct");
      this.onclick();
      Invent.elevatedList.delete("contextMenu");
    });
  }

  update(): void {
    if (mousePressed && this.mouseEvents.clickOutside()) Invent.elevatedList.delete("contextMenu");
    super.update();
  }
  render(): void {
    super.render();
  }
}
