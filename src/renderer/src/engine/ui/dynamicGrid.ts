import Vec2D from "../main/vec2D";

export default class DynamicGrid<T extends FragmentType> {
  private grid: T[];
  config: DynamicGridConfiguration;
  component: new (...args: any) => T;
  constructor(component: new (...args: any) => T, config: DynamicGridConfiguration) {
    this.grid = [];
    this.config = config;
    this.component = component;
    this.create();
  }
  private create() {
    let col = 0;
    let row = 0;
    Array(this.config.numberOfItems)
      .fill(null)
      .forEach((_, i) => {
        row !== 0 && i % this.config.maxRows === 0 && ((row = 0), col++);
        this.grid.push(
          new this.component({
            pos: {
              x:
                this.config.startPoint.x +
                this.config.sizeOfElement.width * row +
                (row !== 0 ? this.config.gap.x * row : 0),
              y:
                this.config.startPoint.y +
                this.config.sizeOfElement.height * col +
                this.config.gap.y * col
            },
            relatedTo: this.config.startPoint.relatedTo ?? new Vec2D(0, 0),
            size: {
              height: this.config.sizeOfElement.height,
              width: this.config.sizeOfElement.width
            },
            tags: ["srsrsr"],
            layer: "uiObjects"
          })
        );
        row++;
      });
  }
  get getGrid() {
    return this.grid;
  }
  addToGrid() {
    if (this.config.maxItems && this.config.maxItems <= this.config.numberOfItems) return;
    this.grid.push(
      new this.component({
        pos: {
          x:
            (this.config.numberOfItems % this.config.maxRows) * this.config.sizeOfElement.width +
            (this.config.numberOfItems % this.config.maxRows) * this.config.gap.x,
          y:
            Math.floor(this.config.numberOfItems / this.config.maxRows) *
              this.config.sizeOfElement.height +
            Math.floor(this.config.numberOfItems / this.config.maxRows) * this.config.gap.y
        },
        relatedTo: this.config.startPoint.relatedTo ?? new Vec2D(0, 0),

        size: {
          height: this.config.sizeOfElement.height,
          width: this.config.sizeOfElement.width
        },
        tags: ["srsrsr"],
        layer: "uiObjects"
      })
    );
    this.config.numberOfItems++;
  }
  removeFromGrid(elementInGrid: FragmentType) {
    const indexToremove = this.grid.findIndex((element) => element === elementInGrid);
    if (indexToremove < 0) return;
    this.grid.splice(indexToremove, 1);
    for (let i = indexToremove; i < this.grid.length; i++) {
      if (this.grid[i].position.get().x > this.config.startPoint.x)
        this.grid[i].position.sub([this.config.sizeOfElement.width + this.config.gap.x, 0]);
      else {
        this.grid[i].position.sub([0, this.config.sizeOfElement.height + this.config.gap.y]);
        this.grid[i].position.setAxis(
          "x",
          this.config.maxRows * this.config.sizeOfElement.width -
            this.config.sizeOfElement.width +
            this.config.gap.x * (this.config.maxRows - 1)
        );
      }
    }
    this.config.numberOfItems--;
  }
}
