import Fragment from "../fragment/fragment";
import { gameObjects, uiObjects } from "../main/engine";

export default class Chest extends Fragment {
  renderer!: RendererType;
  keyEvents!: keyEventsType;
  player?: FragmentType | undefined;
  constructor(props: FragmentProps) {
    super(props);
    this.attachPlugin("renderer", { bindThis: false });
    this.attachPlugin("keyEvents");
    this.attachPlugin("hitboxes", { bindThis: false });
    this.getPlugin<HitboxesType>("hitboxes")?.addHitbox("self", {
      shape: "rect",
      active: true,
      visible: true,
      size: { relatedTo: this.size, height: 0, width: 0 }
    });
    this.getPlugin<RendererType>("renderer")?.display("shape", {
      fill: { color: [200, 100, 100], alpha: 1 },
      stroke: { color: [0, 0, 0], size: 2 },
      round: 0,
      debugText: this.id
    });
    // this.getPlugin<RendererType>("renderer")?.offsetVector({ x: 0, y: 0, w: 0, h: 0 });
    // this.getPlugin<HitboxesType>("hitboxes")?.setVisibleAll(true);
  }
  setup() {
    super.setup();
    this.player = gameObjects.find((e) => e.tags.includes("gameObject_player"));
    // console.log("🚀 ~ file: chest.ts:43 ~ Chest ~ setup ~ player:", this.player);
  }
  update() {
    // this.keyEvents.onKeyPressed("space", () => console.log(this));
    // console.log(this.relatedTo);
    this.relatedTo?.add([0.2, 0]);
    super.update();
  }
  // test() {
  //   if (
  //     this.hitboxes.get("self") &&
  //     this.player?.hitboxes.get("self") &&
  //     this.hitboxes.willBeColliding(
  //       this.hitboxes.get("self")!,
  //       this.player!.hitboxes.get("self")!,
  //       [30, 30, 0, 0]
  //     )
  //   ) {
  //     console.log("koliduje");
  //   }
  // }
}
