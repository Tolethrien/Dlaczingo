import Fragment from "../fragment/fragment";
import { gameObjects } from "../main/engine";

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
      size: { relatedTo: this.size, height: 0, width: 0 }
    });
    this.getPlugin<HitboxesType>("hitboxes")?.addHitbox("selfC", {
      shape: "elipse",
      active: true,
      size: { radius: 0, relatedTo: this.size }
    });
    this.getPlugin<RendererType>("renderer")?.display("shape", {
      fill: { color: [200, 100, 100], alpha: 1 },
      stroke: { color: [0, 0, 0], size: 2 },
      round: 0,
      debugText: this.id
    });
    // this.getPlugin<HitboxesType>("hitboxes")?.setVisibleAll(true);
  }
  setup() {
    super.setup();
    this.player = gameObjects.find((e) => e.tags.includes("gameObject_player"));
  }
  update() {
    // this.keyEvents.onKeyPressed("space", () => console.log(this));
    super.update();
  }
}
