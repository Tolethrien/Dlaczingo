import Fragment from "../fragment/fragment";
import { gameObjects } from "../main/engine";
import { loadFile } from "../main/utils";
import frame from "/char.png";

export default class Chest extends Fragment {
  renderer!: RendererType;
  keyEvents!: keyEventsType;
  player?: FragmentType | undefined;
  constructor(props: FragmentProps) {
    super(props);
    this.attachPlugin("renderer", { bindThis: false });
    this.attachPlugin("keyEvents");
    this.attachPlugin("mouseEvents");
    this.getPlugin<MouseEventsType>("mouseEvents")?.addEvent("left", () => console.log("chest"));
    this.attachPlugin("hitboxes", { bindThis: false });
    this.getPlugin<HitboxesType>("hitboxes")?.addHitbox("self", {
      shape: "rect",
      active: true,
      size: { relatedTo: this.size, height: 0, width: 0 }
    });
    Chest.image = loadFile<ImageFileType>("img", frame);
    this.getPlugin<HitboxesType>("hitboxes")?.addHitbox("selfC", {
      shape: "elipse",
      active: true,
      size: { radius: 0, relatedTo: this.size }
    });
    this.getPlugin<RendererType>("renderer")?.display("spritesheet", {
      spritesheet: Chest.image,
      crop: { x: 0, y: 0 },
      cropSize: { width: 32, height: 32 },
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
