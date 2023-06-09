import Fragment from "../fragment/fragment";
import { cameraObjects, canvas, canvasContainer, gameObjects, uiObjects } from "../main/engine";
import { getMousePosition } from "../main/inputHandlers";
import { renderCircle } from "../main/shapes";
import { loadFile } from "../main/utils";
import Vec2D from "../main/vec2D";
import Inventory from "./inventory";
import mp3 from "/12.mp3";
import frame from "/char.png";
export default class Player extends Fragment {
  renderer!: RendererType;
  mouseEvents!: MouseEventsType;
  keyEvents!: keyEventsType;
  hitboxes!: HitboxesType;
  animator!: AnimatorType;
  directionalMovement!: DirectionalMovementType;
  textRendering!: TextRenderingType;
  audio: AudioFileType;
  speed: number;
  static image: ImageFileType;
  constructor(props: FragmentProps) {
    super(props);
    this.attachPlugin("renderer");
    this.attachPlugin("mouseEvents");
    this.attachPlugin("keyEvents");
    this.attachPlugin("directionalMovement");
    this.attachPlugin("hitboxes");
    this.attachPlugin("animator");
    this.attachPlugin("textRendering");
    this.textRendering.settings({
      text: "Lorem Ipsum",
      font: "Arial",
      fontSize: 18,
      fontWeight: 900,
      align: { Xaxis: "left", Yaxis: "top" },
      color: [50, 250, 50],
      offset: { x: 0, y: 0 },
      padding: { left: 0, right: 0, top: 0, bottom: 0 },
      box: { width: 200, height: 300 }
    });

    this.hitboxes.addHitbox("self", {
      shape: "rect",
      active: true,
      size: { width: 0, height: 0, relatedTo: this.size }
    });
    this.animator.geRenderer(this.renderer);
    this.animator.setAnimationData({
      top: { numberOfFrames: 6, rowInSpritesheet: 4 },
      down: { numberOfFrames: 6, rowInSpritesheet: 1 },
      left: { numberOfFrames: 6, rowInSpritesheet: 2 },
      right: { numberOfFrames: 6, rowInSpritesheet: 3, startAnimation: true }
    });
    // this.renderer.debug = true;
    this.hitboxes.setVisibleAll(true);
    // console.log(this.hitboxes.get("circle"));
    this.audio = loadFile<AudioFileType>("audio", mp3);
    Player.image = loadFile<ImageFileType>("img", frame);
    // this.renderer.display("shape", {
    //   color: [200, 100, 100],
    //   alpha: 0.6,
    //   round: 15,
    //   stroke: {
    //     size: 1,
    //     color: [0, 0, 0]
    //   }
    // });
    this.renderer.display("spritesheet", {
      spritesheet: Player.image,
      crop: { x: 0, y: 0 },
      cropSize: { width: 32, height: 32 },
      debugText: this.id
    });
    this.speed = 5;
    this.directionalMovement.setMovemmentSpeed(this.speed);
    // this.animator.overrideRenderer(this.renderer);
    // this.renderer.display("sprite", { sprite: this.image });
    // this.hitboxes.removeHitbox("se");
    this.mouseEvents.addEvent("left", () => {});
    this.mouseEvents.addEvent("middle", () => console.log("midd"));
    this.mouseEvents.addEvent("right", () => console.log(gameObjects[1]));
    // new Inventory();
  }
  update() {
    // console.log(this.hitboxes.get("self")?.vectors);

    // if (
    //   this.hitboxes.intersectsRR(
    //     this.hitboxes.get("self")!,
    //     gameObjects[0].getPlugin<HitboxesType>("hitboxes")!.get("self")!
    //   )
    // )
    //   console.log("col");
    // if (this.up) {
    //   if (this.position.get().x < 400) this.directionalMovement.seset(400, 100);
    //   if (
    //     this.position.get().x > 399 &&
    //     this.position.get().x < 405 &&
    //     this.position.get().y > 99
    //   ) {
    //     this.directionalMovement.seset(400, 300);
    //   }
    //   if (this.position.get().y > 299) {
    //     this.directionalMovement.seset(600, 200);
    //   }
    //   if (this.position.get().x > 598) {
    //     this.directionalMovement.seset(400, 100);
    //   }
    // }
    this.keyEvents.onKeyPressed("space", () => {
      this.textRendering.change({ color: [0, 0, 0] });
    });
    // this.directionalMovement.moveTo();
    // this.directionalMovement.angleToDirection(10);
    this.handleMove();
    super.update();
  }

  isCollide(
    // dir: "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW",
    target: FragmentType,
    direction: [number, number, number, number]
  ) {
    // return false;
    if (
      this.hitboxes.get("self") &&
      target.getPlugin<HitboxesType>("hitboxes")?.get("self") &&
      this.hitboxes.willBeColliding(
        this.hitboxes.get("self")!,
        target.getPlugin<HitboxesType>("hitboxes")!.get("self")!,
        direction
      )
    ) {
      return true;
    }
    return false;
  }
  handleMove() {
    if (this.keyEvents.keyAny()) {
      if (this.keyEvents.isKeyHolded("w") && this.keyEvents.isNotHolded(["s", "d", "a"])) {
        const target = gameObjects.find(
          (fragment) => fragment !== this && this.isCollide(fragment, [this.speed, 0, 0, 0])
        );
        if (target) {
          this.directionalMovement.stopMovement();
          // this.animator.changeState("idle");
          this.position.add([
            0,
            -(this.position.get().y - (target.position.get().y + target.size.get().y))
          ]);
        } else {
          this.animator.changeState("top");
          this.directionalMovement.ContinuousMove("N");
        }
      } else if (this.keyEvents.isKeyHolded("a") && this.keyEvents.isNotHolded(["d", "s", "w"])) {
        const target = gameObjects.find(
          (fragment) => fragment !== this && this.isCollide(fragment, [0, 0, 0, this.speed])
        );
        if (target) {
          this.directionalMovement.stopMovement();
          // this.animator.changeState("idle");
          this.position.add([
            -(this.position.get().x - (target.position.get().x + target.size.get().x)),
            0
          ]);
        } else {
          this.animator.changeState("left");
          this.directionalMovement.ContinuousMove("W");
        }
      } else if (this.keyEvents.isKeyHolded("s") && this.keyEvents.isNotHolded(["d", "a", "w"])) {
        const target = gameObjects.find(
          (e) => e !== this && this.isCollide(e, [0, 0, this.speed, 0])
        );
        if (target) {
          this.directionalMovement.stopMovement();
          // this.animator.changeState("idle");
          this.position.add([
            0,
            target.position.get().y - (this.position.get().y + this.size.get().y)
          ]);
        } else {
          this.animator.changeState("down");
          this.directionalMovement.ContinuousMove("S");
        }
      } else if (this.keyEvents.isKeyHolded("d") && this.keyEvents.isNotHolded(["a", "s", "w"])) {
        const target = gameObjects.find(
          (fragment) => fragment !== this && this.isCollide(fragment, [0, this.speed, 0, 0])
        );
        if (target) {
          this.directionalMovement.stopMovement();
          // this.animator.changeState("idle");
          this.position.add([
            target.position.get().x - (this.position.get().x + this.size.get().x),
            0
          ]);
        } else {
          this.animator.changeState("right");
          this.directionalMovement.ContinuousMove("E");
        }
      } else if (this.keyEvents.isKeyHolded("w") && this.keyEvents.isKeyHolded("a")) {
        const target = gameObjects.find(
          (fragment) =>
            fragment !== this && this.isCollide(fragment, [this.speed, 0, 0, this.speed])
        );
        if (target) {
          this.directionalMovement.stopMovement();
          if (target.position.get().x + target.size.get().x > this.position.get().x) {
            this.position.add([
              0,
              -(this.position.get().y - (target.position.get().y + target.size.get().y))
            ]);
          } else if (this.position.get().y < this.position.get().y + target.size.get().x) {
            this.position.add([
              -(this.position.get().x - (target.position.get().x + target.size.get().x)),
              0
            ]);
          }
        } else {
          this.directionalMovement.ContinuousMove("NW");
        }
      } else if (this.keyEvents.isKeyHolded("w") && this.keyEvents.isKeyHolded("d")) {
        const target = gameObjects.find(
          (fragment) =>
            fragment !== this && this.isCollide(fragment, [this.speed, this.speed, 0, 0])
        );
        if (target) {
          this.directionalMovement.stopMovement();
          if (this.position.get().x + this.size.get().x > target.position.get().x) {
            this.position.add([
              0,
              -(this.position.get().y - (target.position.get().y + target.size.get().y))
            ]);
          } else if (this.position.get().y < this.position.get().y + target.size.get().x) {
            this.position.add([
              target.position.get().x - (this.position.get().x + this.size.get().x),
              0
            ]);
          }
        } else {
          this.directionalMovement.ContinuousMove("NE");
        }
      } else if (this.keyEvents.isKeyHolded("s") && this.keyEvents.isKeyHolded("a")) {
        const target = gameObjects.find(
          (fragment) =>
            fragment !== this && this.isCollide(fragment, [0, 0, this.speed, this.speed])
        );
        if (target) {
          this.directionalMovement.stopMovement();
          if (this.position.get().y + this.size.get().y > target.position.get().y) {
            console.log("bok");
            this.position.add([
              -(this.position.get().x - (target.position.get().x + target.size.get().x)),
              0
            ]);
          } else if (this.position.get().x < target.position.get().x + target.size.get().x) {
            console.log("dol");
            this.position.add([
              0,
              target.position.get().y - (this.position.get().y + this.size.get().y)
            ]);
          }
        } else {
          this.directionalMovement.ContinuousMove("SW");
        }
      } else if (this.keyEvents.isKeyHolded("s") && this.keyEvents.isKeyHolded("d")) {
        const target = gameObjects.find(
          (fragment) =>
            fragment !== this && this.isCollide(fragment, [0, this.speed, this.speed, 0])
        );
        if (target) {
          this.directionalMovement.stopMovement();
          if (this.position.get().y + this.size.get().y > target.position.get().y) {
            console.log("bok");
            this.position.add([
              target.position.get().x - (this.position.get().x + this.size.get().x),
              0
            ]);
          } else if (this.position.get().x < target.position.get().x + target.size.get().x) {
            console.log("dol");
            this.position.add([
              0,
              target.position.get().y - (this.position.get().y + this.size.get().y)
            ]);
          }
        } else {
          this.directionalMovement.ContinuousMove("SE");
        }
      }
    } else !this.directionalMovement.isOnTravel() && this.directionalMovement.stopMovement();
  }
}
