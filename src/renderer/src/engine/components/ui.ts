import Fragment, { FragmentProps } from "../fragment/fragment";
import { keyEventsType } from "../fragment/plugins/keyEvents";
import { MouseEventsType } from "../fragment/plugins/mouseEvents";
import { RendererType } from "../fragment/plugins/renderer";
import { gameObjects } from "../main/engine";

export default class UITest extends Fragment {
  renderer!: RendererType;
  mouseEvents!: MouseEventsType;
  keyEvents!: keyEventsType;
  constructor({ pos, size, layer, tag }: FragmentProps) {
    super({ pos, size, layer, tag });
    this.attachComponent("renderer");
    this.attachComponent("mouseEvents");
    this.renderer.display("shape", {
      color: [100, 100, 100],
      alpha: 0.6,
      round: 15,
      stroke: {
        size: 1,
        color: [0, 0, 0]
      }
    });
    this.mouseEvents.addEvent("left", () => this.renderer.change({ color: [0, 0, 0] }));
    this.mouseEvents.addEvent("middle", () => this.renderer.change({ color: [0, 0, 0] }));
    this.mouseEvents.addEvent("right", () => console.log(gameObjects[1]));
  }
  update() {
    super.update();
  }
}
