import { loadFile } from "../main/utils";
import UIElement from "../ui/uiElement";
import frame from "/frame.png";
export interface SlotType extends Slot {}
export default class Slot extends UIElement {
  uiMouseEvents!: uiMouseEventsType;
  uiRenderer!: uiRendererType;
  item: string;
  amount: number;
  constructor({ position, size, tags }: UIElementProps) {
    super({ position, size, tags });
    this.attachPlugin("uiRenderer");
    this.attachPlugin("uiMouseEvents");
    // console.log(this);
    this.amount = 0;
    this.item = "a";
    this.uiMouseEvents.addEvent("left", () => {
      this.amount += 1;
      this.item = "bu";
    });
    this.image = loadFile<ImageFileType>("img", frame);
    // this.uiRenderer.display("shape", {
    //   color: [100, 100, 100],
    //   alpha: 1,
    //   // round: 5
    //   stroke: {
    //     size: 1,
    //     color: [0, 0, 0]
    //   }
    // });
    this.uiRenderer.display("sprite", { sprite: this.image });
  }
}
