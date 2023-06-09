import Fragment from "../fragment/fragment";
import { loadFile } from "../main/utils";
import frame from "/frame.png";
import frame2 from "/potion.png";
export interface SlotType extends Slot {}
export default class Slot extends Fragment {
  mouseEvents!: MouseEventsType;
  multiRenderer!: MultiRendererType;
  animator!: AnimatorType;
  textRendering!: TextRenderingType;
  item: string;
  amount: number;
  static image: ImageFileType;
  static image2: ImageFileType;

  constructor(props: FragmentProps) {
    super(props);
    this.attachPlugin("mouseEvents");
    this.attachPlugin("multiRenderer");
    // this.attachPlugin("animator");
    this.attachPlugin("textRendering");
    this.textRendering.settings({
      text: "Lorem Ipsum",
      font: "Arial",
      fontSize: 15,
      fontWeight: 800,
      align: { Xaxis: "right", Yaxis: "bottom" },
      color: [150, 250, 150],
      offset: { x: 0, y: 0 },
      padding: { left: 0, right: 0, top: 0, bottom: 0 },
      box: { width: this.size.get().x, height: this.size.get().y }
    });
    // this.animator.geRenderer(this.multiRenderer, 2);
    // this.animator.setAnimationData({
    //   top: { numberOfFrames: 6, rowInSpritesheet: 4 },
    //   down: { numberOfFrames: 6, rowInSpritesheet: 1 },
    //   left: { numberOfFrames: 6, rowInSpritesheet: 2 },
    //   right: { numberOfFrames: 6, rowInSpritesheet: 3, startAnimation: true }
    // });
    this.amount = 1;
    this.item = "a";
    this.textRendering.setText(this.amount);
    // this.textRendering.settings({
    //   fontSize: 15,
    //   text: this.amount,
    //   font: "Arial",
    //   align: { Xaxis: "right", Yaxis: "bottom" },
    //   color: [255, 255, 255],
    //   offset: { x: 0, y: 0 },
    //   padding: { left: 0, right: 5, top: 0, bottom: 0 },
    //   box: { width: this.size.get().x, height: this.size.get().y }
    // });
    Slot.image = loadFile<ImageFileType>("img", frame);
    Slot.image2 = loadFile<ImageFileType>("img", frame2);

    this.multiRenderer.addShape("shape", {
      offset: { h: 0, w: 0, x: 0, y: 0 },
      debugText: "a",
      round: 0,
      fill: { color: [0, 0, 0], alpha: 1 }
    });
    this.multiRenderer.addShape("sprite", {
      offset: { h: 0, w: 0, x: 0, y: 0 },
      debugText: "a",
      sprite: Slot.image
    });
    this.multiRenderer.addShape("sprite", {
      offset: { h: -30, w: -30, x: 15, y: 15 },
      debugText: "a",
      sprite: Slot.image2
    });
    this.mouseEvents.addEvent("left", () => {
      // this.animator.changeState("down");
      this.amount++;
      this.textRendering.setText(this.amount);
    });
  }
}
