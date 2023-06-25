import { canvas, canvasBox, uiObjects } from "../main/engine";
import Vec2D from "../main/vec2D";
import UIFrame from "../ui/uiFrame";
import Slot, { SlotType } from "./slot";
import Textbox from "./textbox";
import Bar from "./uiBar";

export default class Inventory extends UIFrame {
  position: Vec2DType;
  test: SlotType[];
  tete: DynamicGridType<Slot>;
  constructor() {
    super({ type: "static" });
    this.position = new Vec2D(canvasBox.RIGHT - 6 * 55, 10);
    this.visible = true;
    // this.test = UIFrame.createSimpleGrid<SlotType>(Slot, {
    //   numberOfCols: 3,
    //   numberOfRows: 7,
    //   startPoint: { x: 0, y: 5, relatedTo: this.position },
    //   sizeOfElement: { width: 55, height: 55 },
    //   gap: { x: 0, y: 0 }
    // });
    this.healthBar = new Bar({
      layer: "uiObjects",
      pos: { x: canvasBox.CENTERX - 80, y: canvasBox.BOTTOM - 40 },
      size: { height: 20, width: 160 },
      tags: []
    });
    this.healthBar.setBar({ initial: 50, min: 0, max: 100, text: true });
    console.log(this.healthBar.getValue("current"));
    // this.frame = new UIBackground({
    //   position: { x: 0, y: 0, relatedTo: this.position },
    //   size: { width: 155, height: 300 },
    //   tags: ["srsrsr"]
    // });
    // console.log(this.inv);
    // uiObjects.push(this);
    this.textbox = new Textbox({
      layer: "uiObjects",
      pos: { x: 100, y: 100 },
      size: { width: 200, height: 200 },
      tags: []
    });
    // this.tete = UIFrame.createDynamicGrid<SlotType>(Slot, {
    //   maxRows: 6,
    //   // maxItems: 12,
    //   numberOfItems: 10,
    //   gap: { x: 0, y: 0 },
    //   sizeOfElement: { height: 55, width: 55 },
    //   startPoint: { x: 200, y: 200 }
    // });
  }

  setup() {
    //   this.visible && this.test.forEach((e) => e.setup());
    //   this.visible &&
    //     this.tete.grid.forEach((e) =>
    //       e.mouseEvents.addEvent("left", () => this.tete.removeFromGrid(e))
    //     );
    //   this.visible &&
    //     this.tete.grid.forEach((e) => e.mouseEvents.addEvent("right", () => this.tete.addToGrid()));
    //
  }
  update() {
    // this.visible && this.test.forEach((e) => e.update());
    // this.visible && this.tete.grid.forEach((e) => e.update());
    // this.healthBar.update();
    this.position.add([0.5, 0]);
    this.textbox.update();
  }
  render() {
    // this.visible && this.frame.render();
    // this.tete.grid.forEach((e) => e.render());
    // this.healthBar.render();
    // this.test.forEach((e) => e.render());
    this.textbox.render();
  }
}
