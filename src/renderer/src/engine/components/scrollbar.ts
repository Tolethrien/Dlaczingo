import { getMousePosition } from "../main/inputHandlers";
import Vec2D from "../main/vec2D";

export default class Scrollbar {
  constructor() {
    this.scrollPosition = new Vec2D();
    this.thumbPosition = new Vec2D();
    this.scrollSize = new Vec2D();
    this.thumbSize = new Vec2D();
  }
  private mouseCollide() {
    return (
      getMousePosition("fixed").x >=
        (this.relatedTo ? this.relatedTo.get().x : 0) + this.position.get().x &&
      getMousePosition("fixed").x <=
        (this.relatedTo ? this.relatedTo.get().x : 0) + this.position.get().x + this.size.get().x &&
      getMousePosition("fixed").y >=
        (this.relatedTo ? this.relatedTo.get().y : 0) + this.position.get().y &&
      getMousePosition("fixed").y <=
        (this.relatedTo ? this.relatedTo.get().y : 0) + this.position.get().y + this.size.get().y &&
      true
    );
  }
  render() {
    renderRect({
      fill: { color: [0, 0, 0], alpha: this.debugColors.xAxis.alpha },
      position: this.position,
      relatedTo: this.relatedTo,
      size: new Vec2D(20, this.textConfig.box.height),
      offset: {
        x: this.textConfig.box.width - 20,
        y: 0,
        w: 0,
        h: 0
      }
    });
    renderRect({
      fill: { color: [250, 250, 250], alpha: this.debugColors.xAxis.alpha },
      position: this.position,
      relatedTo: this.relatedTo,
      size: new Vec2D(14, 40),
      offset: {
        x: this.textConfig.box.width - 20 + 3,
        y:
          mapRange(
            Math.abs(this.scrollYoffset),
            0,
            this.wrappedLinesData[this.wrappedLinesData.length - 1].offsetY +
              (this.textConfig.fontSize + this.verticalSpacing) -
              this.textConfig.box.height +
              (this.textConfig.padding.bottom + this.textConfig.padding.top),
            40,
            this.textConfig.box.height
          ) - 40,
        w: 0,
        h: 0
      }
    });
  }
}
