import Fragment from "../fragment/fragment";
import { gameObjects } from "../main/engine";
import { loadFile } from "../main/utils";
import mp3 from "/12.mp3";
import frame from "/char.png";
export default class Player extends Fragment {
  renderer!: RendererType;
  mouseEvents!: MouseEventsType;
  keyEvents!: keyEventsType;
  hitboxes!: HitboxesType;
  animator!: AnimatorType;
  directionalMovement!: DirectionalMovementType;
  audio: AudioFileType;
  speed: number;
  static image: ImageFileType;
  constructor({ pos, size, layer, tag, targetDistanceMessuring }: FragmentProps) {
    super({ pos, size, layer, tag, targetDistanceMessuring });
    this.attachPlugin("renderer");
    this.attachPlugin("mouseEvents");
    this.attachPlugin("keyEvents");
    this.attachPlugin("directionalMovement");
    this.attachPlugin("hitboxes");
    this.attachPlugin("animator");
    this.hitboxes.addHitbox("self", {
      active: true,
      offset: {
        x: 0,
        y: 0,
        w: 0,
        h: 0
      }
    });
    this.animator.setAnimationData({
      top: { numberOfFrames: 6, rowInSpritesheet: 4, startAnimation: true },
      down: { numberOfFrames: 6, rowInSpritesheet: 1 },
      left: { numberOfFrames: 6, rowInSpritesheet: 2 },
      right: { numberOfFrames: 6, rowInSpritesheet: 3 }
    });
    // this.renderer.debug = true;
    this.hitboxes.setVisibleAll(true);
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
      cropSize: { width: 32, height: 32 }
    });
    this.speed = 5;
    this.directionalMovement.setMovemmentSpeed(this.speed);
    // this.animator.overrideRenderer(this.renderer);
    // this.renderer.display("sprite", { sprite: this.image });
    // this.hitboxes.removeHitbox("se");
    this.mouseEvents.addEvent("left", () => this.animator.changeState("top"));
    this.mouseEvents.addEvent("middle", () => this.renderer.change({ color: [0, 0, 0] }));
    this.mouseEvents.addEvent("right", () => console.log(gameObjects[1]));
  }
  update() {
    this.handleMove();
    this.keyEvents.onKeyPressed("space", () => {
      // this.animator.stopOnFinished();
    });
    super.update();
  }

  isCollide(
    // dir: "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW",
    target: FragmentType,
    direction: [number, number, number, number]
  ) {
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
    } else this.directionalMovement.stopMovement();
  }
}
