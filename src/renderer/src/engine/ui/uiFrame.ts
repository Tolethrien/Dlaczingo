import { uiObjects } from "../main/engine";
import Vec2D from "../main/vec2D";
import DynamicGrid from "./dynamicGrid";

type UIType = "static" | "dynamic";

export default class UIFrame {
  type: UIType;
  constructor({ type }: { type: UIType }) {
    this.type = type;
    this.type === "static" && uiObjects.push(this);
  }
  displayDynamicFrame(value: boolean) {
    if (this.type === "dynamic" && !value) {
      const index = uiObjects.findLastIndex((element) => element === this);
      uiObjects.splice(index, 1);
    } else uiObjects.push(this);
  }
  static createSimpleGrid<T>(cl: new (...args: any) => T, options: StaticGridConfiguration): T[] {
    const grid: T[] = [];
    let col = 0;
    let row = 0;
    Array(options.numberOfCols * options.numberOfRows)
      .fill(null)
      .forEach((_, i) => {
        row !== 0 && i % options.numberOfRows === 0 && ((row = 0), col++);
        grid.push(
          new cl({
            pos: {
              x:
                options.startPoint.x +
                options.sizeOfElement.width * row +
                (row !== 0 ? options.gap.x * row : 0),
              y: options.startPoint.y + options.sizeOfElement.height * col + options.gap.y * col
            },
            relatedTo: options.startPoint.relatedTo ?? new Vec2D(0, 0),
            size: { height: options.sizeOfElement.height, width: options.sizeOfElement.width },
            tags: ["srsrsr"],
            layer: "uiObjects"
          })
        );
        row++;
      });
    return grid;
  }
  static createDynamicGrid<T extends FragmentType>(
    component: new (...args: any) => T,
    config: DynamicGridConfiguration
  ) {
    return new DynamicGrid<T>(component, config);
  }
}
