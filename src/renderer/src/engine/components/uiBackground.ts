import UIElement from "../ui/uiElement";

export default class uiBackground extends UIElement {
  uiRenderer!: uiRendererType;
  constructor({ position, size, tags }: UIElementProps) {
    super({ position, size, tags });
    // console.log(this);
    this.attachPlugin("uiRenderer");
    this.uiRenderer.display("shape", {
      color: [200, 100, 100],
      alpha: 1,
      round: 5,
      stroke: {
        size: 1,
        color: [0, 0, 0]
      }
    });
  }
}
