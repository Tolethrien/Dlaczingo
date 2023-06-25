import { ctx } from "../../main/engine";
import { getMousePosition, mouseDelta } from "../../main/inputHandlers";
import { ClipShape, renderRect } from "../../main/shapes";
import Vec2D from "../../main/vec2D";
import Plugin from "./plugin";
type AlignX = "left" | "center" | "right";
type AlignY = "top" | "middle" | "bottom";
type WrappedLines = { text: string; offsetY: number }[];
interface TextConfig {
  fontSize: number;
  text: string | number;
  font: string;
  fontWeight: number;
  align: { Xaxis: AlignX; Yaxis: AlignY };
  color: [number, number, number];
  offset: { x: number; y: number };
  padding: { left: number; right: number; top: number; bottom: number };
  box: { width: number; height: number };
  overflow?: "visible" | "hidden" | "scroll-visible" | "scroll-hidden";
}
export default class TextRendering extends Plugin {
  private textConfig!: TextConfig;
  private wrappedLinesData: WrappedLines;
  debug: boolean;
  private visible: boolean;
  private clip: ClipShapeType;
  private scrollYoffset: number;
  private mousePositionType: "fixed" | "translated";
  private scrollSpeed: number;
  private debugColors: {
    xAxis: { color: [number, number, number]; alpha: number };
    yAxis: { color: [number, number, number]; alpha: number };
    border: [number, number, number];
  };
  private alignment!: {
    x: {
      textAlign: { left: "start"; center: "center"; right: "end" };
      widthAlign: { left: number; center: number; right: number };
    };
    y: {
      line: { top: number; middle: number; bottom: number };
      wrap: { top: number; middle: number; bottom: number };
    };
  };
  verticalSpacing: number;
  constructor(pluginProps: PluginProps) {
    super(pluginProps);
    this.wrappedLinesData = [];
    this.verticalSpacing = 2;
    this.debug = false;
    this.visible = true;
    this.mousePositionType = this.layer !== "uiObjects" ? "translated" : "fixed";
    this.scrollSpeed = 8;
    this.debugColors = {
      xAxis: { color: [250, 150, 0], alpha: 0.5 },
      yAxis: { color: [250, 0, 100], alpha: 0.5 },
      border: [0, 250, 0]
    };
    this.clip = new ClipShape();
    this.scrollYoffset = 0;
  }
  setup() {
    if (this.textConfig === undefined) throw new Error("Text renderer no display");
  }
  render() {
    if (this.visible) {
      this.debug && this.renderTextBorder();
      ctx.fillStyle = `rgba(${this.textConfig.color},1)`;
      ctx.font = `${this.textConfig.fontWeight} ${this.textConfig.fontSize}px ${this.textConfig.font}`;
      ctx.textAlign = this.alignment.x.textAlign[this.textConfig.align.Xaxis];
      ctx.textBaseline = this.textConfig.align.Yaxis;
      if (
        this.textConfig.overflow &&
        (this.textConfig.overflow === "hidden" ||
          this.textConfig.overflow === "scroll-hidden" ||
          this.textConfig.overflow === "scroll-visible")
      ) {
        this.clip.start();
        this.wrappedLinesData.forEach((line) =>
          ctx.fillText(
            line.text,
            (this.relatedTo ? this.relatedTo.getRound().x : 0) +
              this.position.getRound().x +
              (this.textConfig.offset.x ? this.textConfig.offset.x : 0) +
              this.alignment.x.widthAlign[this.textConfig.align.Xaxis],
            (this.relatedTo ? this.relatedTo.getRound().y : 0) +
              this.position.getRound().y +
              (this.textConfig.offset ? this.textConfig.offset.y : 0) +
              this.alignment.y.line[this.textConfig.align.Yaxis] +
              line.offsetY -
              this.alignment.y.wrap[this.textConfig.align.Yaxis] +
              this.scrollYoffset
          )
        );
        this.clip.end();
      } else {
        this.wrappedLinesData.forEach((line) =>
          ctx.fillText(
            line.text,
            (this.relatedTo ? this.relatedTo.getRound().x : 0) +
              this.position.getRound().x +
              (this.textConfig.offset.x ? this.textConfig.offset.x : 0) +
              this.alignment.x.widthAlign[this.textConfig.align.Xaxis],
            (this.relatedTo ? this.relatedTo.getRound().y : 0) +
              this.position.getRound().y +
              (this.textConfig.offset ? this.textConfig.offset.y : 0) +
              this.alignment.y.line[this.textConfig.align.Yaxis] +
              line.offsetY -
              this.alignment.y.wrap[this.textConfig.align.Yaxis] +
              this.scrollYoffset
          )
        );
      }
    }
  }
  setVisible(val: boolean) {
    this.visible = val;
  }
  settings(props: TextConfig) {
    this.textConfig = props;
    this.wrapText();
    this.setAlignment();
    this.clip.newPath("rect", {
      x: this.position.get().x,
      y: this.position.get().y + this.textConfig.padding.top,
      w: this.textConfig.box.width,
      h: this.textConfig.box.height - this.textConfig.padding.top - this.textConfig.padding.bottom
    });
  }
  setVerticalLineSpacing(value: number) {
    this.verticalSpacing = value;
    this.wrapText();
    this.setAlignment();
  }

  autoScroller(side: "up" | "down", speed: number, toDisappear: boolean) {
    if (side === "up") {
      if (
        toDisappear &&
        -this.wrappedLinesData[this.wrappedLinesData.length - 1].offsetY -
          (this.textConfig.fontSize + this.verticalSpacing) <
          this.scrollYoffset
      ) {
        this.scrollYoffset -= speed;
      } else if (
        !toDisappear &&
        -this.wrappedLinesData[this.wrappedLinesData.length - 1].offsetY -
          (this.textConfig.fontSize + this.verticalSpacing) -
          this.textConfig.padding.bottom +
          this.textConfig.box.height <
          this.scrollYoffset
      ) {
        this.scrollYoffset -= speed;
      }
    } else if (side === "down") {
      if (
        toDisappear &&
        this.wrappedLinesData[this.wrappedLinesData.length - 1].offsetY +
          (this.textConfig.fontSize + this.verticalSpacing) >
          this.scrollYoffset
      ) {
        this.scrollYoffset += speed;
      } else if (
        !toDisappear &&
        this.wrappedLinesData[this.wrappedLinesData.length - 1].offsetY +
          (this.textConfig.fontSize + this.verticalSpacing) +
          this.textConfig.padding.bottom >
          this.scrollYoffset
      ) {
        this.scrollYoffset += speed;
      }
    }
  }
  setText(text: string | number) {
    this.textConfig.text = String(text);
    this.wrapText();
    this.setAlignment();
  }
  change(props: Partial<Omit<TextConfig, "text">>) {
    this.textConfig = { ...this.textConfig, ...props };
    this.wrapText();
    this.setAlignment();
  }
  getMetricts() {
    ctx.font = `${this.textConfig.fontWeight} ${this.textConfig.fontSize}px ${this.textConfig.font}`;
    return ctx.measureText(this.textConfig.text as string);
  }
  protected update() {
    if (
      this.textConfig.overflow &&
      (this.textConfig.overflow === "scroll-hidden" ||
        this.textConfig.overflow === "scroll-visible")
    ) {
      this.mouseScroller();
    }
  }

  private mouseScroller() {
    if (this.mouseCollide()) {
      if (mouseDelta.y < 0) {
        if (this.scrollYoffset - mouseDelta.y / this.scrollSpeed > 0) {
          this.scrollYoffset = 0;
        } else {
          this.scrollYoffset += Math.abs(mouseDelta.y / this.scrollSpeed);
        }
      } else if (mouseDelta.y > 0) {
        if (
          this.scrollYoffset <
          -(
            this.wrappedLinesData[this.wrappedLinesData.length - 1].offsetY +
            (this.textConfig.fontSize + this.verticalSpacing) -
            this.textConfig.box.height +
            (this.textConfig.padding.bottom + this.textConfig.padding.top) -
            mouseDelta.y / this.scrollSpeed
          )
        ) {
          this.scrollYoffset = -(
            this.wrappedLinesData[this.wrappedLinesData.length - 1].offsetY +
            (this.textConfig.fontSize + this.verticalSpacing) -
            this.textConfig.box.height +
            (this.textConfig.padding.bottom + this.textConfig.padding.top)
          );
        } else {
          this.scrollYoffset -= Math.abs(mouseDelta.y / this.scrollSpeed);
        }
      }
    }
  }
  private setAlignment() {
    this.alignment = {
      x: {
        textAlign: { left: "start", center: "center", right: "end" },
        widthAlign: {
          left: 0 + this.textConfig.padding.left,
          center: this.textConfig.box.width / 2,
          right: this.textConfig.box.width - this.textConfig.padding.right
        }
      },
      y: {
        line: {
          top: 0 + this.textConfig.padding.top,
          middle: this.textConfig.box.height / 2,
          bottom: this.textConfig.box.height - this.textConfig.padding.bottom
        },
        wrap: {
          top: 0,
          middle:
            ((this.wrappedLinesData.length - 1) / 2) * this.textConfig.fontSize +
            ((this.wrappedLinesData.length - 1) / 2) * this.verticalSpacing,
          bottom:
            (this.wrappedLinesData.length - 1) * this.textConfig.fontSize +
            (this.wrappedLinesData.length - 1) * this.verticalSpacing
        }
      }
    };
  }
  private mouseCollide() {
    return (
      getMousePosition(this.mousePositionType).x >=
        (this.relatedTo ? this.relatedTo.get().x : 0) + this.position.get().x &&
      getMousePosition(this.mousePositionType).x <=
        (this.relatedTo ? this.relatedTo.get().x : 0) + this.position.get().x + this.size.get().x &&
      getMousePosition(this.mousePositionType).y >=
        (this.relatedTo ? this.relatedTo.get().y : 0) + this.position.get().y &&
      getMousePosition(this.mousePositionType).y <=
        (this.relatedTo ? this.relatedTo.get().y : 0) + this.position.get().y + this.size.get().y &&
      true
    );
  }
  private wrapText() {
    const words = (this.textConfig.text as string).split(" ");
    let line = "";
    let testLine = "";
    const lineArray: WrappedLines = [];
    ctx.font = `${this.textConfig.fontWeight} ${this.textConfig.fontSize}px ${this.textConfig.font}`;
    let offsetY = 0;
    words.forEach((word, index) => {
      testLine += `${word} `;
      const { width } = ctx.measureText(testLine);
      if (
        width >
          this.textConfig.box.width -
            (this.textConfig.padding.left + this.textConfig.padding.right) -
            (this.textConfig.overflow && this.textConfig.overflow === "scroll-visible" ? 20 : 0) &&
        index > 0
      ) {
        lineArray.push({ text: line, offsetY: offsetY });
        offsetY += this.textConfig.fontSize + this.verticalSpacing;
        line = `${word} `;
        testLine = `${word} `;
      } else {
        line += `${word} `;
      }
      if (index === words.length - 1) {
        lineArray.push({ text: line, offsetY: offsetY });
      }
    });
    this.wrappedLinesData = lineArray;
  }

  private renderTextBorder() {
    if (this.textConfig.overflow && this.textConfig.overflow === "scroll-visible")
      renderRect({
        fill: { color: [0, 0, 0], alpha: this.debugColors.xAxis.alpha },
        position: this.position,
        relatedTo: this.relatedTo,
        size: new Vec2D(20, this.textConfig.box.height),
        offset: {
          x: this.textConfig.box.width - 20,
          y: 0,
          w: 0,
          h: 0
        }
      });
    if (this.textConfig.padding.left > 0)
      renderRect({
        fill: { color: this.debugColors.xAxis.color, alpha: this.debugColors.xAxis.alpha },
        position: this.position,
        relatedTo: this.relatedTo,
        size: new Vec2D(this.textConfig.padding.left, this.textConfig.box.height),
        offset: {
          x: this.textConfig.offset ? this.textConfig.offset.x : 0,
          y: this.textConfig.offset ? this.textConfig.offset.y : 0,
          w: 0,
          h: 0
        }
      });
    if (this.textConfig.padding.right > 0)
      renderRect({
        fill: { color: this.debugColors.xAxis.color, alpha: this.debugColors.xAxis.alpha },
        position: this.position,
        relatedTo: this.relatedTo,
        size: new Vec2D(this.textConfig.padding.right, this.textConfig.box.height),
        offset: {
          x:
            this.size.get().x -
            (this.textConfig.overflow && this.textConfig.overflow === "scroll-visible" ? 20 : 0) -
            this.textConfig.padding.right +
            (this.textConfig.offset ? this.textConfig.offset.x : 0),
          y: this.textConfig.offset ? this.textConfig.offset.y : 0,
          w: 0,
          h: 0
        }
      });
    if (this.textConfig.padding.top > 0)
      renderRect({
        fill: { color: this.debugColors.yAxis.color, alpha: this.debugColors.yAxis.alpha },
        position: this.position,
        relatedTo: this.relatedTo,
        size: new Vec2D(this.textConfig.box.width, this.textConfig.padding.top),
        offset: {
          x: this.textConfig.offset ? this.textConfig.offset.x : 0,
          y: this.textConfig.offset ? this.textConfig.offset.y : 0,
          w: 0,
          h: 0
        }
      });
    if (this.textConfig.padding.bottom > 0)
      renderRect({
        fill: { color: this.debugColors.yAxis.color, alpha: this.debugColors.yAxis.alpha },
        position: this.position,
        relatedTo: this.relatedTo,
        size: new Vec2D(this.textConfig.box.width, this.textConfig.padding.bottom),
        offset: {
          x: this.textConfig.offset ? this.textConfig.offset.x : 0,
          y:
            this.size.get().y -
            this.textConfig.padding.bottom +
            (this.textConfig.offset ? this.textConfig.offset.y : 0),
          w: 0,
          h: 0
        }
      });
    renderRect({
      stroke: { color: this.debugColors.border, size: 2 },
      position: this.position,
      relatedTo: this.relatedTo,
      size: new Vec2D(this.textConfig.box.width, this.textConfig.box.height),
      offset: {
        x: this.textConfig.offset ? this.textConfig.offset.x : 0,
        y: this.textConfig.offset ? this.textConfig.offset.y : 0,
        w: 0,
        h: 0
      }
    });
  }
}
