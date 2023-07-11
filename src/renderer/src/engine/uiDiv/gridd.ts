import { ClipShape } from "../main/shapes";
import { loadFile } from "../main/utils";
import ContextMenu from "./contextMenu";
import Element from "./element";
import Slott from "./slott";
import frame from "/char.png";

export default class Gridd extends Element {
  renderer!: RendererType;
  mouseEvents!: MouseEventsType;
  textRendering!: TextRenderingType;

  constructor(rel) {
    super({ pos: { x: 0, y: 0 }, size: { height: 150, width: 430 }, tags: [], relatedTo: rel });
    // this.attachPlugin("mouseEvents");
    this.attachPlugin("renderer");
    this.image = loadFile<ImageFileType>("img", frame);

    this.renderer.display("shape", {
      stroke: { color: [250, 0, 0], size: 2 },
      debugText: "a",
      round: 0
    });
    this.setOverflow({
      type: "scroll-visible",
      shape: "rect",
      path: {
        x: this.relatedPosition.get().x,
        y: this.relatedPosition.get().y,
        w: this.size.get().x,
        h: this.size.get().y
      },
      scroll: {
        scrollWidth: 20,
        thumbWidth: 10,
        thumbOffset: 5,
        thumbHeight: 80,
        scrollbarDisplayStyle: {
          round: 15,
          fill: { color: [250, 0, 250], alpha: 1 },
          debugText: "a"
        },
        scrollThumbDisplayStyle: {
          round: 15,
          fill: { color: [100, 100, 0], alpha: 1 },
          debugText: "a"
        }
      }
    });
    Array(10)
      .fill(null)
      .forEach((e, i) =>
        this.appendChild(`slot-${i}`, new Slott(60 * i + 50, this.relatedPosition, 60 * i))
      );
  }
  // update(): void {
  //   super.update();
  // }
  render(): void {
    super.render();
  }
}
