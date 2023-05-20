import Fragment, { FragmentProps } from "../fragment/fragment";
import { keyEventsType } from "../fragment/plugins/keyEvents";
import { MouseEventsType } from "../fragment/plugins/mouseEvents";
import { RendererType } from "../fragment/plugins/renderer";
import { gameObjects, uiObjects } from "../main/engine";

export default class UIElement extends Fragment {
  renderer!: RendererType;
  mouseEvents!: MouseEventsType;
  keyEvents!: keyEventsType;
  constructor({ pos, size, tag }: FragmentProps) {
    super({ pos, size, layer: "uiObjects", tag });
    this.attachPlugin("renderer");
    this.attachPlugin("mouseEvents");
    this.renderer.display("shape", {
      color: [200, 100, 100],
      alpha: 0.6,
      round: 15,
      stroke: {
        size: 1,
        color: [0, 0, 0]
      }
    });
    this.visible = false;
    this.mouseEvents.addEvent("left", () => (this.visible = false));
    this.mouseEvents.addEvent("middle", () => this.renderer.change({ color: [0, 0, 0] }));
    this.mouseEvents.addEvent("right", () => console.log(gameObjects[1]));
  }
}
