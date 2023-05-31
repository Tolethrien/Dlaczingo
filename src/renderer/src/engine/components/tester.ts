import Fragment from "../fragment/fragment";
import { gameObjects } from "../main/engine";

export default class Tester extends Fragment {
  renderer!: RendererType;
  mouseEvents!: MouseEventsType;
  keyEvents!: keyEventsType;
  hitboxes!: HitboxesType;
  constructor({ pos, size, layer, tag, targetDistanceMessuring }: FragmentProps) {
    super({ pos, size, layer, tag, targetDistanceMessuring });
    this.attachPlugin("renderer");
    this.attachPlugin("mouseEvents");
    this.attachPlugin("keyEvents");
    this.attachPlugin("hitboxes");
    this.hitboxes.addHitbox("self", {
      active: true,
      offset: {
        x: 0,
        y: 0,
        w: 0,
        h: 0
      }
    });
    // this.hitboxes.setVisibleAll(true);
    this.renderer.display("shape", {
      color: [200, 100, 100],
      alpha: 1,
      round: 0,
      stroke: {
        size: 1,
        color: [0, 0, 0]
      }
    });
    this.mouseEvents.addEvent("left", () => console.log("kliknales w obiekt: ", this));
    this.mouseEvents.addEvent("middle", () => this.renderer.change({ color: [0, 0, 0] }));
    this.mouseEvents.addEvent("right", () => console.log(gameObjects[1]));
  }
  update() {
    super.update();
    this.test() &&
      this.keyEvents.onKeyPressed("h", () => {
        console.log(this.tag);
      });
  }
  test() {
    if (
      this.hitboxes.get("self") &&
      gameObjects[2].hitboxes.get("self") &&
      this.hitboxes.isColliding(this.hitboxes.get("self")!, gameObjects[2].hitboxes.get("self")!)
    ) {
      return true;
    }
  }
}
