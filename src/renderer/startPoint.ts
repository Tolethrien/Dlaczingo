import Engine, { cameraObjects, ctx, gameObjects, uiObjects } from "./src/engine/main/engine";
import Tester from "./src/engine/components/tester";
import Chest from "./src/engine/components/chest";
import Player from "./src/engine/components/player";
import Camera from "./src/engine/components/camera";
import UIElement from "./src/engine/ui/uiElement";
function preload() {}
function setup() {
  // new Chest({
  //   layer: "gameObjects",
  //   tag: "my_animal_component",
  //   pos: { x: -10, y: 150 },
  //   size: { width: 80, height: 80 }
  // });
  // Array(1000)
  //   .fill(null)
  //   .forEach(
  //     (e) =>
  //       new Tester({
  //         layer: "gameObjects",
  //         tag: "front",
  //         targetDistanceMessuring: "gameObject_player",
  //         pos: { x: 30, y: 60 },
  //         size: { width: 80, height: 80 }
  //       })
  //   );
  new Chest({
    layer: "gameObjects",
    tag: "front",
    targetDistanceMessuring: "gameObject_player",
    pos: { x: 130, y: 63 },
    size: { width: 80, height: 80 }
  });
  // new Chest({
  //   layer: "gameObjects",
  //   tag: "front",
  //   targetDistanceMessuring: "gameObject_player",
  //   pos: { x: -40, y: 63 },
  //   size: { width: 80, height: 80 }
  // });
  new UIElement({
    layer: "uiObjects",
    tag: "ui",
    pos: { x: 40, y: 40 },
    size: { width: 80, height: 80 }
  });

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
      tag: "camera",
      followTag: "gameObject_player"
    })
  );
  new Player({
    layer: "gameObjects",
    tag: "gameObject_player",
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
