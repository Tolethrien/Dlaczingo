import Fragment from "../fragment/fragment";
export interface BarType extends Bar {}
export default class Bar extends Fragment {
  multiRenderer!: MultiRendererType;
  textRendering!: TextRenderingType;
  currentValue: number;
  initialValue: number;
  minValue: number;
  maxValue: number;
  constructor(props: FragmentProps) {
    super(props);
    this.currentValue = 0;
    this.initialValue = 0;
    this.minValue = 0;
    this.maxValue = 0;
    this.attachPlugin("multiRenderer");
    this.attachPlugin("textRendering");
    this.textRendering.settings({
      text: `${this.currentValue}/${this.maxValue}`,
      font: "Arial",
      fontSize: 15,
      fontWeight: 800,
      align: { Xaxis: "center", Yaxis: "middle" },
      color: [150, 250, 150],
      offset: { x: 0, y: 1 },
      padding: { left: 0, right: 0, top: 0, bottom: 0 },
      box: { width: this.size.get().x, height: this.size.get().y }
    });
    //stroke
    this.multiRenderer.addShape("shape", {
      offset: { h: 2, w: 2, x: -1, y: -1 },
      debugText: "a",
      round: 0,
      fill: { color: [0, 0, 0], alpha: 0.5 }
    });
    //bar
    this.multiRenderer.addShape("shape", {
      offset: { h: 0, w: -(this.size.get().x - this.mapValue()), x: 0, y: 0 },
      debugText: "a",
      round: 0,
      fill: { color: [255, 0, 0], alpha: 1 }
    });
  }
  setBar({
    initial,
    min,
    max,
    text
  }: {
    initial: number;
    min: number;
    max: number;
    text?: boolean;
  }) {
    if (initial > max) this.currentValue = max;
    else if (initial < min) this.currentValue = min;
    else this.currentValue = initial;
    this.initialValue = initial;
    this.minValue = min;
    this.maxValue = max;
    this.textRendering.setVisible(text ?? false);
    this.applychanges(this.currentValue);
  }
  applychanges(value: number) {
    if (this.currentValue <= this.maxValue && this.currentValue >= this.minValue) {
      this.textRendering.setText(`${this.currentValue}/${this.maxValue}`);
      this.currentValue = value;
      this.multiRenderer.getConfigFromIndex(1).offset.w = -(this.size.get().x - this.mapValue());
    }
  }
  getValue(value: "min" | "max" | "initial" | "current") {
    return this[`${value}Value`];
  }
  private mapValue() {
    return (
      0 +
      ((this.currentValue - this.minValue) / (this.maxValue - this.minValue)) *
        (this.size.get().x - 0)
    );
  }
}
