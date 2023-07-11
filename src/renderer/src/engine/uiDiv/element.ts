import Fragment from "../fragment/fragment";
import Plugin from "../fragment/plugins/plugin";
import { ctx } from "../main/engine";
import { getMousePosition, mouseDelta } from "../main/inputHandlers";
import { mapRange } from "../main/utils";
import Vec2D from "../main/vec2D";
import Scrollbar, { ScrollbarType, scrollbarConfig } from "./scrollbar";
interface UIProps {
  pos: { x: number; y: number };
  size: { width: number; height: number };
  tags: string[];
  relatedTo?: Vec2DType;
}
interface Overflow {
  type: "visible" | "hidden" | "scroll-hidden" | "scroll-visible";
  shape: "rect" | "ellipse";
  path: { x: number; y: number; w: number; h: number };
  scroll?: scrollbarConfig;
}
export interface ElementUIType extends ElementUI {}
export default class ElementUI extends Fragment {
  private children: [string, ElementUI][];
  private parent: ElementUI | undefined;
  initialRelatedPosition: Vec2DType;
  private region: Path2D | undefined;
  private scrollSpeed: number;
  private scrollBar?: ScrollbarType;
  private overflowType: "visible" | "hidden" | "scroll-hidden" | "scroll-visible";
  constructor(props: UIProps) {
    super({ layer: "uiObjects", ...props });
    this.children = [];
    this.parent = undefined;
    this.region = undefined;
    this.scrollSpeed = 8;
    this.overflowType = "hidden";
    this.initialRelatedPosition = new Vec2D(this.position.get().x, this.position.get().y);
  }
  setActive(state: boolean) {
    this.visible = state;
    this.updated = state;
  }
  setOverflow({ type, shape, path, scroll }: Overflow) {
    if (type === "scroll-hidden" || type === "scroll-visible" || type === "hidden") {
      this.region = new Path2D();
      this.overflowType = type;
      shape === "rect"
        ? this.region.rect(path.x, path.y, path.w, path.h)
        : this.region.ellipse(path.x, path.y, path.w, path.h, 0, 0, 2 * Math.PI);
      if (type === "scroll-visible") {
        if (!scroll) throw new Error("need scroll settings");
        this.scrollBar = new Scrollbar(this);
        this.scrollBar.setStyle(scroll);
        this.scrollBar.addScrollCallback(() => this.mouseScrollerOnScrollbar());
      }
    } else if (type === "visible") {
      this.region = undefined;
    }
  }
  private mouseScrolleronWheel() {
    if (this.mouseCollide() && mouseDelta.y !== 0) {
      if (
        this.children[0][1].position?.get().y - mouseDelta.y / this.scrollSpeed <
          this.position.get().y &&
        this.children[this.children.length - 1][1].position?.get().y +
          this.children[this.children.length - 1][1].size?.get().y -
          mouseDelta.y / this.scrollSpeed >
          this.position?.get().y + this.size.get().y
      ) {
        this.children.forEach((e) => e[1].position.sub([0, mouseDelta.y / this.scrollSpeed]));
      } else {
        if (mouseDelta.y < 0) {
          this.children.forEach((e) =>
            e[1].position.setAxis("y", 0 + e[1].initialRelatedPosition.get().y)
          );
        } else if (mouseDelta.y > 0) {
          this.children.forEach((e) =>
            e[1].position.setAxis(
              "y",
              0 -
                this.children[this.children.length - 1][1].initialRelatedPosition.get().y +
                this.children[this.children.length - 1][1].size.get().y +
                e[1].initialRelatedPosition.get().y +
                e[1].size.get().y
            )
          );
        }
      }
    }
  }
  private mouseScrollerOnScrollbar() {
    if (
      this.children[0][1].position?.get().y - 5 < this.position.get().y &&
      this.children[this.children.length - 1][1].position?.get().y +
        this.children[this.children.length - 1][1].size?.get().y +
        5 >
        this.position?.get().y + this.size.get().y
    ) {
      this.children.forEach((e) =>
        e[1].position.setAxis(
          "y",
          -mapRange(
            getMousePosition("fixed").y - 50,
            0,
            this.size.get().y,
            0,
            this.children[this.children.length - 1][1].initialRelatedPosition.get().y +
              this.children[this.children.length - 1][1].size.get().y -
              this.size.get().y
          ) + e[1].initialRelatedPosition.get().y
        )
      );
    } else {
      if (getMousePosition("fixed").y < 100) {
        console.log(`segz`, this.size.get().y / 2);
        this.children.forEach((e) =>
          e[1].position.setAxis("y", 0 + e[1].initialRelatedPosition.get().y)
        );
      } else if (getMousePosition("fixed").y > 100) {
        console.log(`duba`, this.size.get().y / 2);

        this.children.forEach((e) =>
          e[1].position.setAxis(
            "y",
            0 -
              this.children[this.children.length - 1][1].initialRelatedPosition.get().y +
              this.children[this.children.length - 1][1].size.get().y +
              e[1].initialRelatedPosition.get().y +
              e[1].size.get().y
          )
        );
      }
    }
  }

  mouseCollide() {
    return (
      getMousePosition("fixed").x >=
        (this.relatedTo ? this.relatedTo.get().x : 0) + this.position.get().x &&
      getMousePosition("fixed").x <=
        (this.relatedTo ? this.relatedTo.get().x : 0) + this.position.get().x + this.size.get().x &&
      getMousePosition("fixed").y >=
        (this.relatedTo ? this.relatedTo.get().y : 0) + this.position.get().y &&
      getMousePosition("fixed").y <=
        (this.relatedTo ? this.relatedTo.get().y : 0) + this.position.get().y + this.size.get().y &&
      true
    );
  }
  render() {
    if (this.region) {
      ctx.save();
      ctx.clip(this.region, "evenodd");
      super.render();
      this.visible &&
        this.children.forEach((e) => {
          if (
            e[1].position.get().y >= -(e[1].size.get().y + 5) &&
            e[1].position.get().y < this.size.get().y + 5
          )
            e[1].render();
        });
      ctx.restore();
      if (this.overflowType === "scroll-visible") {
        this.scrollBar?.render();
      }
    } else {
      super.render();
      this.visible && this.children.forEach((e) => e[1].render());
    }
  }
  update() {
    if (this.region) {
      this.mouseScrolleronWheel();
      super.update();
      this.scrollBar?.update();
      this.updated &&
        this.children.forEach((e) => {
          if (
            e[1].position.get().y >= -(e[1].size.get().y + 5) &&
            e[1].position.get().y < this.size.get().y + 5
          ) {
            e[1].update();
          }
        });
    } else {
      if (this.parent?.region) {
        let mouseEvents: Plugin | undefined;
        if (this.relatedTo) {
          this.relatedPosition?.set(
            this.relatedTo.getRound().x + this.position.getRound().x,
            this.relatedTo.getRound().y + this.position.getRound().y
          );
        }
        if (this.updated) {
          this.attachedPlugins.forEach((e) =>
            e.constructor.name === "MouseEvents" ? (mouseEvents = e) : e["update"]?.()
          );
          if (this.parent.mouseCollide()) mouseEvents?.["update"]?.();
        }
      } else {
        super.update();
        this.updated && this.children.forEach((e) => e[1].update());
      }
    }
  }

  appendChild(name: string, child: ElementUIType) {
    if (this.children.find((e) => e[0] === name)) return;
    this.children.push([name, child]);
    this.children[this.children.length - 1][1].parent = this;
  }
  removeChild(name: string) {
    const index = this.children.findIndex((e) => e[0] === name);
    index >= 0 && this.children.splice(index, 1);
  }
  getChild<T = ElementUIType>(name: string) {
    return this.children.find((e) => e[0] === name)?.[1] as T | undefined;
  }
  getAllChildren() {
    return this.children;
  }
}
