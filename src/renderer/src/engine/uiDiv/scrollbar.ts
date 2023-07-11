import Fragment from "../fragment/fragment";
import { displayConfig } from "../fragment/plugins/renderer";
import { mousePressed } from "../main/inputHandlers";
import { mapRange } from "../main/utils";
import { ElementUIType } from "./element";
export interface scrollbarConfig {
  thumbHeight: number;
  thumbWidth: number;
  thumbOffset: number;
  scrollWidth: number;
  scrollbarDisplayStyle: displayConfig;
  scrollThumbDisplayStyle: displayConfig;
}
export interface ScrollbarType extends Scrollbar {}
export default class Scrollbar extends Fragment {
  scrollSlider!: FragmentType;
  scrollThumb!: FragmentType;
  parent: ElementUIType;
  thumbHeight: number | undefined;
  movementCallback: (() => void) | undefined;
  constructor(parent: ElementUIType) {
    super({
      layer: "uiObjects",
      relatedTo: parent.relatedPosition,
      pos: { x: 0, y: 0 },
      size: { height: parent.size.get().y, width: 20 },
      tags: []
    });
    this.parent = parent;
    this.thumbHeight = undefined;
    this.movementCallback = undefined;
  }
  render() {
    super.render();
    this.scrollSlider.render();
    this.scrollThumb.render();
  }
  setStyle({
    scrollThumbDisplayStyle,
    scrollWidth,
    scrollbarDisplayStyle,
    thumbHeight,
    thumbOffset,
    thumbWidth
  }: scrollbarConfig) {
    this.scrollSlider = new Fragment({
      layer: "uiObjects",
      relatedTo: this.relatedPosition,
      pos: { x: 0, y: 0 },
      size: { height: this.parent.size.get().y, width: scrollWidth },
      tags: []
    });
    this.scrollThumb = new Fragment({
      layer: "uiObjects",
      relatedTo: this.relatedPosition,
      pos: { x: thumbOffset, y: 0 },
      size: { height: thumbHeight, width: thumbWidth },
      tags: []
    });
    this.thumbHeight = thumbHeight;
    this.position.setAxis("x", this.parent.size.get().x - scrollWidth);
    this.scrollSlider.attachPlugin("renderer");
    this.scrollSlider.attachPlugin("mouseEvents");
    this.scrollThumb.attachPlugin("renderer");
    this.scrollThumb.attachPlugin("mouseEvents");
    // this.scrollThumb.getPlugin<MouseEventsType>("mouseEvents")?.addEvent("left", () => {});
    if ("spritesheet" in scrollThumbDisplayStyle) {
      this.scrollThumb
        .getPlugin<RendererType>("renderer")
        ?.display("spritesheet", scrollThumbDisplayStyle);
    } else if ("sprite" in scrollThumbDisplayStyle) {
      this.scrollThumb
        .getPlugin<RendererType>("renderer")
        ?.display("sprite", scrollThumbDisplayStyle);
    } else if ("round" in scrollThumbDisplayStyle) {
      this.scrollThumb
        .getPlugin<RendererType>("renderer")
        ?.display("shape", scrollThumbDisplayStyle);
    }
    if ("spritesheet" in scrollbarDisplayStyle) {
      this.scrollSlider
        .getPlugin<RendererType>("renderer")
        ?.display("spritesheet", scrollbarDisplayStyle);
    } else if ("sprite" in scrollbarDisplayStyle) {
      this.scrollSlider
        .getPlugin<RendererType>("renderer")
        ?.display("sprite", scrollbarDisplayStyle);
    } else if ("round" in scrollbarDisplayStyle) {
      this.scrollSlider
        .getPlugin<RendererType>("renderer")
        ?.display("shape", scrollbarDisplayStyle);
    }
  }
  update(): void {
    super.update();
    this.moveThumb();
    this.movementCallback?.();
    this.scrollSlider.update();
    this.scrollThumb.update();
  }

  addScrollCallback(func: () => void) {
    this.movementCallback = () => {
      mousePressed &&
        this.parent.mouseCollide() &&
        this.scrollSlider.getPlugin<MouseEventsType>("mouseEvents")?.mouseCollide() &&
        func();
    };
  }
  moveThumb() {
    this.scrollThumb.position.setAxis(
      "y",
      mapRange(
        Math.abs(this.parent.getAllChildren()[0][1].position.getRound().y),
        0,
        this.parent
          .getAllChildren()
          [this.parent.getAllChildren().length - 1][1].initialRelatedPosition.get().y +
          this.parent.getAllChildren()[this.parent.getAllChildren().length - 1][1].size.get().y -
          this.parent.size.get().y,
        this.thumbHeight!,
        this.parent.size.get().y
      ) - this.thumbHeight!
    );
  }
}
