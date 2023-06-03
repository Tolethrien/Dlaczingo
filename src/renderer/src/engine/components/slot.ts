import Fragment from "../fragment/fragment";
import { loadFile } from "../main/utils";
import frame from "/frame.png";
export interface SlotType extends Slot {}
export default class Slot extends Fragment {
  mouseEvents!: MouseEventsType;
  renderer!: RendererType;
  item: string;
  amount: number;
  constructor(props: FragmentProps) {
    super(props);
    this.attachPlugin("renderer");
    this.attachPlugin("mouseEvents");
    // console.log(this);
    this.amount = 0;
    this.item = "a";
    this.mouseEvents.addEvent("left", () => {
      this.amount += 1;
      this.item = "bu";
      console.log(this);
    });
    this.image = loadFile<ImageFileType>("img", frame);
    // this.uiRenderer.display("shape", {
    //   color: [100, 100, 100],
    //   alpha: 1,
    //   // round: 5
    //   stroke: {
    //     size: 1,
    //     color: [0, 0, 0]
    //   }
    // });
    this.renderer.display("sprite", { sprite: this.image });
  }
}
