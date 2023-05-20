import Fragment from "../fragment/fragment";
import { gameObjects } from "../main/engine";
import mp3 from "/12.mp3";
export default class Player extends Fragment {
  renderer!: RendererType;
  mouseEvents!: MouseEventsType;
  keyEvents!: keyEventsType;
  hitboxes!: HitboxesType;
  speed: number;
  constructor({ pos, size, layer, tag, targetDistanceMessuring }: FragmentProps) {
    super({ pos, size, layer, tag, targetDistanceMessuring });
    this.speed = 6;
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
    this.audio = new Audio();
    this.audio.src = mp3;
    this.audio.volume = 1;
    this.renderer.display("shape", {
      color: [200, 100, 100],
      alpha: 0.6,
      round: 15,
      stroke: {
        size: 1,
        color: [0, 0, 0]
      }
    });
    // this.hitboxes.removeHitbox("se");
    this.mouseEvents.addEvent("left", () => this.audio.play());
    this.mouseEvents.addEvent("middle", () => this.renderer.change({ color: [0, 0, 0] }));
    this.mouseEvents.addEvent("right", () => console.log(gameObjects[1]));
  }
  update() {
    this.keyEvents.onKeyHold("w", () => {
      const target = gameObjects.find(
        (fragment) => fragment !== this && this.isCollide(fragment, [this.speed, 0, 0, 0])
      );
      target
        ? this.position.add([
            0,
            -(this.position.get().y - (target.position.get().y + target.size.get().y))
          ])
        : this.position.add([0, -this.speed]);
    });
    this.keyEvents.onKeyHold("a", () => {
      const target = gameObjects.find(
        (fragment) => fragment !== this && this.isCollide(fragment, [0, 0, 0, this.speed])
      );
      target
        ? this.position.add([
            -(this.position.get().x - (target.position.get().x + target.size.get().x)),
            0
          ])
        : this.position.add([-this.speed, 0]);
    });
    this.keyEvents.onKeyHold("s", () => {
      const target = gameObjects.find(
        (e) => e !== this && this.isCollide(e, [0, 0, this.speed, 0])
      );
      target
        ? this.position.add([
            0,
            target.position.get().y - (this.position.get().y + this.size.get().y)
          ])
        : this.position.add([0, this.speed]);
    });
    this.keyEvents.onKeyHold("d", () => {
      const target = gameObjects.find(
        (fragment) => fragment !== this && this.isCollide(fragment, [0, this.speed, 0, 0])
      );
      target
        ? this.position.add([
            target.position.get().x - (this.position.get().x + this.size.get().x),
            0
          ])
        : this.position.add([this.speed, 0]);
    });

    super.update();
  }
  isCollide(
    // dir: "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW",
    target: FragmentType,
    direction: [number, number, number, number]
  ) {
    if (
      this.hitboxes.get("self") &&
      target.hitboxes.get("self") &&
      this.hitboxes.willBeColliding(
        this.hitboxes.get("self")!,
        target.hitboxes.get("self")!,
        direction
      )
    ) {
      return true;
    }
    return false;
  }
}
