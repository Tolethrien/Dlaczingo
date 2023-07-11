import Gridd2 from "./Gridd2";
import ButList from "./buttList";
import Element from "./element";
import Gridd from "./gridd";

export default class Invent extends Element {
  renderer!: RendererType;
  mouseEvents!: MouseEventsType;
  textRendering!: TextRenderingType;
  static elevatedList: Map<string, Element>;
  constructor() {
    super({ pos: { x: 60, y: 50 }, size: { height: 150, width: 730 }, tags: [] });
    this.attachPlugin("mouseEvents");
    this.attachPlugin("renderer");
    Invent.elevatedList = new Map();
    this.renderer.display("shape", {
      stroke: { color: [250, 250, 0], size: 2 },
      debugText: "a",
      round: 0
    });
    this.appendChild("buttonList", new ButList(220));
    this.appendChild("ItemGrid", new Gridd(this.position));
    // this.appendChild("ResourceGrid", new Gridd2());
    this.getChild("buttonList")!.funcList(
      () => {
        this.appendChild("ItemGrid", new Gridd(this.position));
        this.removeChild("ResourceGrid");
      },
      () => {
        this.appendChild("ResourceGrid", new Gridd2());
        this.removeChild("ItemGrid");
      }
    );
    // this.children.get("buttonList")!.funcList(
    //   () => {
    //     this.appendChild("ItemGrid", new Gridd());
    //     this.removeChild("ResourceGrid");
    //   },
    //   () => {
    //     this.appendChild("ResourceGrid", new Gridd2());
    //     this.removeChild("ItemGrid");
    //   }
    // );
  }

  update(): void {
    super.update();
    Invent.elevatedList.forEach((e) => e.update());
    // this.sorted.forEach((e) => {
    //   e["update"]?.();
    // });
    // console.log(Invent.elevatedList);
  }
  render(): void {
    super.render();
    Invent.elevatedList.forEach((e) => e.render());

    // this.sorted.forEach((e) => {
    //   e["render"]?.();
    // });
  }
}
