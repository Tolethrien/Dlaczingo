// import { ctx } from "./engine";

// export function renderSprite({ sprite, position, size, relatedTo, offset }: ShapeSprite) {
//   ctx.drawImage(
//     sprite as HTMLImageElement,
//     (relatedTo ? relatedTo.getRound().x : 0) + position.getRound().x + (offset ? offset.x : 0),
//     (relatedTo ? relatedTo.getRound().y : 0) + position.getRound().y + (offset ? offset.y : 0),
//     size.get().x + (offset ? offset.w : 0),
//     size.get().y + (offset ? offset.h : 0)
//   );
// }

// export function renderSpriteSheet({
//   crop,
//   cropSize,
//   position,
//   size,
//   spritesheet,
//   offset,
//   relatedTo
// }: ShapeSpritesheet) {
//   ctx.drawImage(
//     spritesheet as HTMLImageElement,
//     crop.x,
//     crop.y,
//     cropSize.width,
//     cropSize.height,
//     (relatedTo ? relatedTo.getRound().x : 0) + position.getRound().x + (offset ? offset.x : 0),
//     (relatedTo ? relatedTo.getRound().y : 0) + position.getRound().y + (offset ? offset.y : 0),
//     size.get().x + (offset ? offset.w : 0),
//     size.get().y + (offset ? offset.h : 0)
//   );
// }

// export function renderRect({ fill, position, size, offset, relatedTo, round, stroke }: ShapeRect) {
//   ctx.beginPath();
//   if (fill?.color) {
//     ctx.fillStyle = `rgba(${fill.color}, ${fill.alpha ?? 1})`;
//     ctx.roundRect(
//       (relatedTo ? relatedTo.getRound().x : 0) +
//         position.getRound().x +
//         (offset ? offset.x : 0) +
//         (stroke ? 1 : 0),
//       (relatedTo ? relatedTo.getRound().y : 0) +
//         position.getRound().y +
//         (offset ? offset.y : 0) +
//         (stroke ? 1 : 0),
//       size.get().x + (offset ? offset.w : 0) - (stroke ? 2 : 0),
//       size.get().y + (offset ? offset.h : 0) - (stroke ? 2 : 0),
//       round ?? 0
//     );
//     ctx.fill();
//   }
//   // drawing stroke with this.offset to inside
//   if (stroke?.color) {
//     ctx.lineWidth = stroke.size;
//     ctx.fillStyle = `rgba(${stroke.color})`;
//     ctx.roundRect(
//       (relatedTo ? relatedTo.getRound().x : 0) +
//         position.getRound().x +
//         (offset ? offset.x : 0) +
//         stroke.size / 2,
//       (relatedTo ? relatedTo.getRound().y : 0) +
//         position.getRound().y +
//         (offset ? offset.y : 0) +
//         stroke.size / 2,
//       size.get().x + (offset ? offset.w : 0) - stroke.size,
//       size.get().y + (offset ? offset.h : 0) - stroke.size,
//       round ?? 0
//     );
//     ctx.stroke();
//   }
//   ctx.closePath();
// }
// interface ShapeDebugFrame {
//   position: Vec2DType;
//   size: Vec2DType;
//   text: string;
//   relatedTo?: Vec2DType;
//   offset?: { x: number; y: number; w: number; h: number };
// }
// export function renderDebugerFrame({ position, size, text, offset, relatedTo }: ShapeDebugFrame) {
//   ctx.beginPath();
//   ctx.lineWidth = 2;
//   //stroke
//   ctx.strokeStyle = "rgb(0, 255, 0)";
//   //dot
//   ctx.fillStyle = "rgb(0, 255, 0)";
//   ctx.roundRect(
//     (relatedTo ? relatedTo.getRound().x : 0) + position.getRound().x + (offset ? offset.x : 0),
//     (relatedTo ? relatedTo.getRound().y : 0) + position.getRound().y + (offset ? offset.y : 0),
//     size.get().x + (offset ? offset.w : 0) - 2,
//     size.get().y + (offset ? offset.h : 0) - 2,
//     0
//   );
//   ctx.fillRect(
//     (relatedTo ? relatedTo.getRound().x : 0) +
//       position.getRound().x +
//       (offset ? offset.x : 0) +
//       size.get().x / 2 -
//       1,
//     (relatedTo ? relatedTo.getRound().y : 0) +
//       position.getRound().y +
//       (offset ? offset.y : 0) +
//       size.get().y / 2 -
//       1,
//     2,
//     2
//   );
//   ctx.stroke();
//   ctx.font = `${size.get().x / 2 - size.get().x / 4}px Arial`;
//   ctx.fillText(
//     text,
//     (relatedTo ? relatedTo.getRound().x : 0) + position.getRound().x + (offset ? offset.x : 0) + 4,
//     (relatedTo ? relatedTo.getRound().y : 0) +
//       position.getRound().y +
//       (offset ? offset.y : 0) +
//       size.get().x / 2 -
//       size.get().x / 4,
//     size.get().x - size.get().x / 8
//   );
//   ctx.closePath();
// }
// export function renderHitboxFrame(vector: [number, number, number, number]) {
//   ctx.lineWidth = 2;
//   ctx.strokeStyle = "rgb(255, 255, 0)";
//   ctx.strokeRect(vector[0], vector[1], vector[2], vector[3]);
// }