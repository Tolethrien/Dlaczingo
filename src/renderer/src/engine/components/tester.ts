import Fragment, { FragmentProps } from "../fragment/fragment";
import { keyEventsType } from "../fragment/plugins/keyEvents";
import { MouseEventsType } from "../fragment/plugins/mouseEvents";
import { RendererType } from "../fragment/plugins/renderer";
import { gameObjects } from "../main/engine";

export default class Tester extends Fragment {
  renderer!: RendererType;
  mouseEvents!: MouseEventsType;
  keyEvents!: keyEventsType;
  constructor({ pos, size, layer, tag }: FragmentProps) {
    super({ pos, size, layer, tag });
    this.attachComponent("renderer");
    this.attachComponent("mouseEvents");
    this.attachComponent("keyEvents");
    this.renderer.display("shape", {
      color: [200, 100, 100],
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
    this.keyEvents.addKeyHold("w", () => this.position.add([0, -1]));
    this.keyEvents.addKeyHold("a", () => this.position.add([-1, 0]));
    this.keyEvents.addKeyHold("s", () => this.position.add([0, 1]));
    this.keyEvents.addKeyHold("d", () => this.position.add([1, 0]));
    this.keyEvents.addKeyPressed("space", () => console.log("otwarlem"));
  }
  update() {
    super.update();
  }
}
