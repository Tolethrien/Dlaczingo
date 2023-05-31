import Engine, { cameraObjects, ctx, gameObjects, uiObjects } from "./src/engine/main/engine";
import Tester from "./src/engine/components/tester";
import Chest from "./src/engine/components/chest";
import Player from "./src/engine/components/player";
import Camera from "./src/engine/components/camera";
import UIElement from "./src/engine/ui/uiElement";
import UIFrame from "./src/engine/components/uiBackground";
function preload() {}
function setup() {
  // new Chest({
  //   layer: "gameObjects",
  //   tag: "my_animal_component",
  //   pos: { x: -10, y: 150 },
  //   size: { width: 80, height: 80 }
  // });
  // Array(2000)
  //   .fill(null)
  //   .forEach((e, i) => {
  //     if (i % 55 === 0) {
  //       yy++;
  //       xx = 0;
  //       console.log(yy);
  //     }
  //     xx++;
  //     new Tester({
  //       layer: "gameObjects",
  //       tag: "front",
  //       targetDistanceMessuring: "gameObject_player",
  //       pos: { x: xx * 11, y: yy * 11 },
  //       size: { width: 10, height: 10 }
  //     });
  //   });
  new Chest({
    layer: "gameObjects",
    tags: ["front"],
    targetDistanceMessuring: "gameObject_player",
    pos: { x: 300, y: 500 },
    size: { width: 80, height: 80 }
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
    pos: { x: 120, y: 160 },
    size: { width: 80, height: 80 }
  });
  cameraObjects.get("main")?.setZoom(1);
  cameraObjects.forEach((e) => e.setup());
  gameObjects.forEach((e) => e.setup());
  uiObjects.forEach((e) => e.setup());
}
function update() {
  gameObjects.forEach((e) => e.update());
  uiObjects.forEach((e) => e.update());
  // console.log(gameObjects[2].position.get());
}
function render() {
  cameraObjects.get("main")?.start();
  gameObjects.forEach((e) => e.render());
  cameraObjects.get("main")?.off();
  uiObjects.forEach((e) => e.render());
  cameraObjects.get("main")?.on();
}

const config: EngineConfig = {
  preload,
  setup,
  update,
  render,
  fps: true
};

new Engine(config);
