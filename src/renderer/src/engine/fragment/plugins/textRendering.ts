import { ctx } from "../../main/engine";
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
}
export default class TextRendering extends Plugin {
  private textConfig!: TextConfig;
  private wrappedLinesData: WrappedLines;
  debug: boolean;
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
  }
  setup() {
    if (this.textConfig === undefined) throw new Error("Text renderer no display");
  }
  render() {
    this.debug && this.renderTextBorder();
    ctx.fillStyle = `rgba(${this.textConfig.color},1)`;
    ctx.font = `${this.textConfig.fontWeight} ${this.textConfig.fontSize}px ${this.textConfig.font}`;
    ctx.textAlign = this.alignment.x.textAlign[this.textConfig.align.Xaxis];
    ctx.textBaseline = this.textConfig.align.Yaxis;
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
          this.alignment.y.wrap[this.textConfig.align.Yaxis]
      )
    );
  }
  settings(props: TextConfig) {
    this.textConfig = props;
    this.wrapText();
    this.setAlignment();
  }
  setVerticalLineSpacing(value: number) {
    this.verticalSpacing = value;
    this.wrapText();
    this.setAlignment();
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

  private wrapText() {
    const words = (this.textConfig.text as string).split(" ");
    let line = "";
    let testLine = "";
    const lineArray: WrappedLines = [];
    ctx.font = `${this.textConfig.fontSize}px ${this.textConfig.font}`;
    let offsetY = 0;
    words.forEach((word, index) => {
      testLine += `${word} `;
      const { width } = ctx.measureText(testLine);
      if (
        width >
          this.textConfig.box.width -
            (this.textConfig.padding.left + this.textConfig.padding.right) &&
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
    ctx.lineWidth = 1;
    ctx.strokeRect(
      (this.relatedTo ? this.relatedTo.getRound().x : 0) +
        this.position.getRound().x +
        (this.textConfig.offset.x ? this.textConfig.offset.x : 0),
      (this.relatedTo ? this.relatedTo.getRound().y : 0) +
        this.position.getRound().y +
        (this.textConfig.offset ? this.textConfig.offset.y : 0),
      this.textConfig.box.width,
      this.textConfig.box.height
    );
  }
}
