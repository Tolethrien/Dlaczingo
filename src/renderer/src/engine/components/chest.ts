import Fragment, { FragmentProps, FragmentType } from "../fragment/fragment";
import { HitboxesType } from "../fragment/plugins/hitboxes";
import { keyEventsType } from "../fragment/plugins/keyEvents";
import { RendererType } from "../fragment/plugins/renderer";
import { gameObjects, uiObjects } from "../main/engine";

export default class Chest extends Fragment {
  renderer!: RendererType;
  keyEvents!: keyEventsType;
  hitboxes!: HitboxesType;
  player?: FragmentType | undefined;
  constructor({ pos, size, layer, tag, targetDistanceMessuring }: FragmentProps) {
    super({ pos, size, layer, tag, targetDistanceMessuring });
    this.attachPlugin("renderer");
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
      alpha: 0.6,
      round: 15,
      stroke: {
        size: 1,
        color: [0, 0, 0]
      }
    });
    // this.hitboxes.setVisibleAll(true);
  }
  setup() {
    super.setup();
    this.player = gameObjects.find((e) => e.tag === "gameObject_player");
    // console.log("🚀 ~ file: chest.ts:43 ~ Chest ~ setup ~ player:", this.player);
  }
  update() {
    super.update();
  }
  test() {
    if (
      this.hitboxes.get("self") &&
      this.player?.hitboxes.get("self") &&
      this.hitboxes.onWillCollide(
        this.hitboxes.get("self")!,
        this.player!.hitboxes.get("self")!,
        [30, 30, 0, 0]
      )
    ) {
      console.log("koliduje");
    }
  }
}
