import { canvas, uiObjects } from "../main/engine";
import { renderCircle } from "../main/shapes";
import Vec2D from "../main/vec2D";
import UIFrame from "../ui/uiFrame";
import Slot, { SlotType } from "./slot";

export default class Inventory extends UIFrame {
  position: Vec2DType;
  test: SlotType[];
  constructor() {
    super();
    this.position = new Vec2D(390, 10);
    this.visible = true;
    console.log(canvas.width);
    this.test = this.createGrid<SlotType>(Slot, {
      numberOfCols: 3,
      numberOfRows: 7,
      startPoint: { x: 0, y: 5, relatedTo: this.position },
      sizeOfElement: { width: 55, height: 55 },
      gap: { x: 0, y: 0 }
    });

    // this.frame = new UIBackground({
    //   position: { x: 0, y: 0, relatedTo: this.position },
    //   size: { width: 155, height: 300 },
    //   tags: ["srsrsr"]
    // });
    // console.log(this.inv);
    uiObjects.push(this);
  }

  setup() {
    this.visible && this.test.forEach((e) => e.setup());
  }
  update() {
    this.visible && this.test.forEach((e) => e.update());

    // this.position.add([0.5, 0]);
  }
  render() {
    // this.visible && this.frame.render();
    this.test.forEach((e) => e.render());
  }
}
