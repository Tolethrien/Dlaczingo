import Vec2D from "../main/vec2D";

interface SetGridProps {
  numberOfCols: number;
  numberOfRows: number;
  startPoint: { x: number; y: number; relatedTo?: Vec2DType };
  sizeOfElement: { width: number; height: number };
  gap: { x: number; y: number };
}
export default class UIFrame {
  constructor() {}

  createGrid<T>(cl: new (...args) => T, options: SetGridProps): T[] {
    const grid: T[] = [];
    let col = 0;
    let row = 0;
    Array(options.numberOfCols * options.numberOfRows)
      .fill(null)
      .forEach((_, i) => {
        row !== 0 && i % options.numberOfRows === 0 && ((row = 0), col++);
        grid.push(
          new cl({
            position: {
              x:
                options.startPoint.x +
                options.sizeOfElement.width * row +
                (row !== 0 ? options.gap.x * row : 0),
              y: options.startPoint.y + options.sizeOfElement.height * col + options.gap.y * col,
              relatedTo: options.startPoint.relatedTo ?? new Vec2D(0, 0)
            },
            size: { height: options.sizeOfElement.height, width: options.sizeOfElement.width },
            tags: ["srsrsr"]
          })
        );
        row++;
      });
    return grid;
  }
  addToGrid() {}
}
/**
 * grid templaty: no wiec grid template bedzie zapisywal sie w arrayu templatow
 * i potem bedziesz mogl go uzywac z arrey w formie use template(klasa, ilosc sztuk)
 * dzieki czemu bedziesz mogl dodawac usuwac itp lepiej bo masz wszystkie info w arrayu
 *
 */
