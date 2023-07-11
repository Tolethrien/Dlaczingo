import ContextMenu from "./contextMenu";
import Element from "./element";
import Invent from "./invent";

export default class Slott extends Element {
  renderer!: RendererType;
  mouseEvents!: MouseEventsType;
  textRendering!: TextRenderingType;

  constructor(x: number, rel, y) {
    super({ pos: { x: 0, y: y }, size: { height: 50, width: 50 }, tags: [], relatedTo: rel });
    this.attachPlugin("mouseEvents");
    this.attachPlugin("renderer");
    this.attachPlugin("textRendering");
    this.textRendering.settings({
      text: "0",
      font: "Arial",
      fontSize: 18,
      fontWeight: 900,
      align: { Xaxis: "left", Yaxis: "bottom" },
      color: [50, 250, 50],
      offset: { x: 0, y: 0 },
      padding: { left: 0, right: 0, top: 0, bottom: 0 },
      box: { width: this.size.get().x, height: this.size.get().y }
    });
    this.renderer.display("shape", { fill: { color: [0, 0, 0] }, debugText: "a", round: 0 });

    this.mouseEvents.addEvent("left", () => this.position.add([0, -25]));
    this.mouseEvents.addEvent("right", () => {
      Invent.elevatedList.set(
        "contextMenu",
        new ContextMenu(this.relatedPosition ? this.relatedPosition : this.position, () =>
          this.textRendering.setText("1")
        )
      );
    });
    // this.appendChild(new ContextMenu(this.position));
  }
  // update(): void {
  //   super.update();
  // }
  // render(): void {
  //   super.render();
  // }
}
