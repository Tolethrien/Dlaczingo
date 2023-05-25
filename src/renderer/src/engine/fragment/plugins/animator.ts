import Plugin from "./plugin";
import { SpriteSheetI } from "./renderer";

interface AnimationDataI {
  [key: string]: { numberOfFrames: number; rowInSpritesheet: number; startAnimation?: boolean };
}
export default class Animator extends Plugin {
  private renderer!: SpriteSheetI;
  protected animationData!: AnimationDataI;
  private frameCounter: number;
  animationSpeed: number;
  private isAnimate: boolean;
  private state: string;
  private stopOnAnimationFinished: boolean;
  constructor({ position, size, layer, siblings, referanceName }) {
    super(position, size, siblings, layer, referanceName);
    this.animationData;
    this.frameCounter = 0;
    this.animationSpeed = 8;
    this.isAnimate = true;
    this.state = "";
    this.stopOnAnimationFinished = false;
  }
  setup() {
    if (this.renderer) return;
    this.renderer = (this.siblings.find((e) => e.constructor.name === "Renderer") as RendererType)
      ?.style as SpriteSheetI;
    if (!this.renderer) throw new Error("animator cant find renderer");
    if (!("spritesheet" in this.renderer))
      throw new Error("renderer dosnt have a valid spritesheet");
  }
  /**
   * ovverride's renderer in case of multiple instance's of it in Fragment.
   * @Docs https://engine-docs-git-develop-tolethrien.vercel.app/docs/fragment/fragment#dodawaniePluginow
   */
  overrideRenderer(newRend: RendererType) {
    if (!newRend.style) throw new Error("animator cant find renderer");
    if (!("spritesheet" in newRend.style))
      throw new Error("renderer dosnt have a valid spritesheet");
    this.renderer = newRend.style as SpriteSheetI;
  }
  /**
   * give animator object with all animation data like state names, number of frames in state etc.
   */
  setAnimationData(data: AnimationDataI) {
    this.animationData = data;
    const startAnim = Object.entries(data).find((e) => e[1].startAnimation) ?? "e";
    this.state = startAnim[0] ?? Object.keys(data)[0];
  }
  /**animator updater! function controled by Fragment and game loop.
   *  DO NOT invoke */
  update() {
    this.updateAnimation();
  }
  /**main update animation loop */
  private updateAnimation() {
    //should animate?
    if (this.isAnimate) {
      //reset framecounter after some number to avoid big numbers
      if (
        this.frameCounter >=
        this.animationSpeed * this.animationData[this.state].numberOfFrames
      ) {
        this.frameCounter = 0;
      }
      //add frame counter
      this.frameCounter++;
      // check if frame counter is modulo by animation speed and only then animate next frame
      if (this.frameCounter % this.animationSpeed === 0) {
        // if frame is not last one set next frame to display
        if (
          this.frameCounter <
          this.animationSpeed * this.animationData[this.state].numberOfFrames
        ) {
          this.renderer.crop.x += this.renderer.cropSize.width;
          this.renderer.crop.y =
            this.renderer.cropSize.height * (this.animationData[this.state].rowInSpritesheet - 1);
        }
        // if frame is last - start all over or stop animating
        else {
          this.stopOnAnimationFinished ? this.stop() : (this.renderer.crop.x = 0);
        }
      }
    }
  }
  /**start's animation */
  play() {
    this.isAnimate = true;
    this.stopOnAnimationFinished = false;
  }
  /**stops's animation */
  stop() {
    this.isAnimate = false;
  }
  /**stops's animation on last frame of animation */
  stopOnFinished() {
    this.stopOnAnimationFinished = true;
  }
  /**rewind animation to begining */
  rewind() {
    this.frameCounter = 0;
    this.renderer.crop.x = 0;
  }
  /**changing animation */
  changeState(newState: string) {
    if (this.state === newState) return;
    this.state = newState;
    this.rewind();
  }
}
