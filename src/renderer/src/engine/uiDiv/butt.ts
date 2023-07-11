import ContextMenu from "./contextMenu";
import Element from "./element";
import Gridd from "./gridd";
import Slott from "./slott";

export default class Butt extends Element {
  renderer!: RendererType;
  mouseEvents!: MouseEventsType;
  textRendering!: TextRenderingType;

  constructor(x) {
    super({ pos: { x: x, y: 250 }, size: { height: 50, width: 130 }, tags: [] });
    this.attachPlugin("mouseEvents");
    this.attachPlugin("renderer");
    this.attachPlugin("textRendering");
    this.textRendering.settings({
      text: "button",
      font: "Arial",
      fontSize: 18,
      fontWeight: 900,
      align: { Xaxis: "right", Yaxis: "bottom" },
      color: [50, 250, 50],
      offset: { x: 0, y: 0 },
      padding: { left: 0, right: 0, top: 0, bottom: 0 },
      box: { width: this.size.get().x, height: this.size.get().y }
    });
    this.renderer.display("shape", {
      stroke: { color: [0, 0, 0], size: 2 },
      debugText: "a",
      round: 0
    });
    this.mouseEvents.addEvent("left", () => this.func());
  }
  addFunk(func) {
    this.func = func;
  }
  // update(): void {
  //   super.update();
  // }
  // render(): void {
  //   super.render();
  // }
}
