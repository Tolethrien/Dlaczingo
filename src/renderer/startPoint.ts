import type { EngineConfig } from "./src/engine/main/engine.d";
import Engine, { ctx, gameObjects } from "./src/engine/main/engine";
import Tester from "./src/engine/components/tester";
import Camera from "./src/engine/components/camera";
import UITest from "./src/engine/components/ui";
let cam;
function preload() {}
function setup() {
  new Tester({
    layer: "gameObjects",
    tag: "ssd",
    pos: { x: 10, y: 10 },
    size: { width: 80, height: 80 }
  });
  new Tester({
    layer: "uiObjects",
    tag: "ssd",
    pos: { x: 40, y: 10 },
    size: { width: 80, height: 80 }
  });
  new Tester({
    layer: "uiObjects",
    tag: "gameObject_player",
    pos: { x: 40, y: 40 },
    size: { width: 80, height: 80 }
  });
  // new UITest({
  //   layer: "uiObjects",
  //   tag: "gameObject_player",
  //   pos: { x: 50, y: 60 },
  //   size: { width: 80, height: 80 }
  // });
  cam = new Camera({
    type: "follow",
    isBounded: false,
    boundaries: {},
    tag: "camera",
    followTag: "gameObject_player"
  });
  cam.zoom(1);

  gameObjects.forEach((e) => e.setup());
}
function update() {
  // cam.update();

  gameObjects.forEach((e) => e.update());
}
function render() {
  cam.start();

  gameObjects.forEach((e) => e.render());

  // ctx.fillRect(10, 10, 100, 100);
}

const config: EngineConfig = {
  update,
  render,
  setup,
  preload,
  fps: true
};

new Engine(config);
