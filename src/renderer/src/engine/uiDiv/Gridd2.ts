import ContextMenu from "./contextMenu";
import Element from "./element";
import Slott from "./slott";

export default class Gridd extends Element {
  renderer!: RendererType;
  mouseEvents!: MouseEventsType;
  textRendering!: TextRenderingType;

  constructor() {
    super({ pos: { x: 50, y: 50 }, size: { height: 150, width: 730 }, tags: [] });
    // this.attachPlugin("mouseEvents");
    this.attachPlugin("renderer");

    this.renderer.display("shape", {
      stroke: { color: [0, 0, 0], size: 2 },
      debugText: "a",
      round: 0
    });
    Array(4)
      .fill(null)
      .forEach((e, i) => this.appendChild(`slot-${i}`, new Slott(60 * i + 50, undefined)));
  }
  // update(): void {
  //   super.update();
  // }
  // render(): void {
  //   super.render();
  // }
}
