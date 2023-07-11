import Butt from "./butt";
import ContextMenu from "./contextMenu";
import Element from "./element";
import Gridd from "./gridd";
import Slott from "./slott";

export default class ButList extends Element {
  renderer!: RendererType;
  mouseEvents!: MouseEventsType;
  textRendering!: TextRenderingType;

  constructor(y) {
    super({ pos: { x: 250, y: y }, size: { height: 150, width: 330 }, tags: [] });
    // this.attachPlugin("mouseEvents");
    this.attachPlugin("renderer");

    this.renderer.display("shape", {
      stroke: { color: [0, 0, 0], size: 2 },
      debugText: "a",
      round: 0
    });
    this.appendChild("setItemList", new Butt(300));
    this.appendChild("setResList", new Butt(450));
    // this.setActive(false);
  }
  funcList(func, funk) {
    this.getChild("setItemList")!.addFunk(func);
    this.getChild("setResList")!.addFunk(funk);
  }
  // update(): void {
  //   super.update();
  // }
  // render(): void {
  //   super.render();
  // }
}
