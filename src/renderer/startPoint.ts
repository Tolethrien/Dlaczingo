import type { EngineConfig } from "./engine";
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
  // Array(1500)
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
    pos: { x: 130, y: 60 },
    size: { width: 80, height: 80 }
  });
  new Player({
    layer: "gameObjects",
    tag: "gameObject_player",
    pos: { x: 140, y: 40 },
    size: { width: 80, height: 80 }
  });
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
  cameraObjects.get("main")?.setZoom(1);

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
  update,
  render,
  setup,
  preload,
  fps: true
};

new Engine(config);
