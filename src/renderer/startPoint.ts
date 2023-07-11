import Engine, { cameraObjects, ctx, gameObjects, uiObjects } from "./src/engine/main/engine";
import Tester from "./src/engine/components/tester";
import Chest from "./src/engine/components/chest";
import Player from "./src/engine/components/player";
import Camera from "./src/engine/components/camera";
import Gridd from "./src/engine/uiDiv/gridd";
import Invent from "./src/engine/uiDiv/invent";
function preload() {}
const eleme = new Invent();
function setup() {
  // let xx = 0;
  // let yy = 0;
  // Array(2500)
  //   .fill(null)
  //   .forEach((e, i) => {
  //     if (i % 55 === 0) {
  //       yy++;
  //       xx = 0;
  //       console.log(yy);
  //     }
  //     xx++;

  //     new Chest({
  //       layer: "gameObjects",
  //       tags: ["front"],
  //       targetDistanceMessuring: "gameObject_player",
  //       pos: { x: xx * 11, y: yy * 8 },
  //       size: { width: 15, height: 15 }
  //       // relatedTo: new Vec2D(0, 0)
  //     });
  //   });
  new Chest({
    layer: "gameObjects",
    tags: ["front"],
    targetDistanceMessuring: "gameObject_player",
    pos: { x: 300, y: 500 },
    size: { width: 80, height: 80 }
    // relatedTo: new Vec2D(0, 0)
  });
  // new Chest({
  //   layer: "gameObjects",
  //   tag: "front",
  //   targetDistanceMessuring: "gameObject_player",
  //   pos: { x: 100, y: 100 },
  //   size: { width: 15, height: 15 }
  // });
  // new Chest({
  //   layer: "gameObjects",
  //   tag: "front",
  //   targetDistanceMessuring: "gameObject_player",
  //   pos: { x: 50, y: 50 },
  //   size: { width: 5, height: 5 }
  // });
  // new Chest({
  //   layer: "gameObjects",
  //   tag: "front",
  //   targetDistanceMessuring: "gameObject_player",
  //   pos: { x: 640, y: 240 },
  //   size: { width: 5, height: 5 }
  // });
  // new UIFrame({
  //   layer: "uiObjects",
  //   tag: "ui",
  //   pos: { x: 40, y: 40 },
  //   size: { width: 80, height: 80 }
  // });

  // new UITest({
  //   layer: "uiObjects",
  //   tag: "gameObject_player",
  //   pos: { x: 50, y: 60 },
  //   size: { width: 80, height: 80 }
  // });

  cameraObjects.set(
    "main",
    new Camera({
      type: "follow",
      isBounded: false,
      boundaries: {},
      tags: ["camera"],
      followTag: "gameObject_player"
    })
  );
  new Player({
    layer: "gameObjects",
    tags: ["gameObject_player"],
    pos: { x: 120, y: 500 },
    size: { width: 80, height: 80 }
  });
  // new Inventory();
  cameraObjects.get("main")?.setZoom(1.2452);
  cameraObjects.forEach((e) => e.setup());
  gameObjects.forEach((e) => e.setup());
  uiObjects.forEach((e) => e.setup());
  eleme.setup();
}
function update() {
  gameObjects.sort((a, b) => a.position.get().y - b.position.get().y);
  gameObjects.forEach((e) => e.update());
  uiObjects.forEach((e) => e.update());
  eleme.update();
}
function render() {
  cameraObjects.get("main")?.start();

  gameObjects.forEach((e) => e.render());
  cameraObjects.get("main")?.off();
  uiObjects.forEach((e) => e.render());
  eleme.render();
  cameraObjects.get("main")?.on();
  // console.log(uiObjects);
}

const config: EngineConfig = {
  preload,
  setup,
  update,
  render,
  fps: true
};

new Engine(config);
