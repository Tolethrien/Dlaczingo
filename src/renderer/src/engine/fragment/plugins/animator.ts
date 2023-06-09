import Plugin from "./plugin";
import { SpritesheetConfiguration } from "./renderer";

interface AnimationData {
  [key: string]: { numberOfFrames: number; rowInSpritesheet: number; startAnimation?: boolean };
}
export default class Animator extends Plugin {
  private rendererConfig!:
    | SpritesheetConfiguration
    | { renderer: RendererType | MultiRendererType; index?: number };
  protected animationData!: AnimationData;
  private frameCounter: number;
  animationSpeed: number;
  private isAnimate: boolean;
  private state: string;
  private stopOnAnimationFinished: boolean;

  constructor(pluginProps: PluginProps) {
    super(pluginProps);
    this.animationData;
    this.frameCounter = 0;
    this.animationSpeed = 8;
    this.isAnimate = true;
    this.state = "";
    this.stopOnAnimationFinished = false;
  }
  setup() {
    if ("renderer" in this.rendererConfig) {
      if (this.rendererConfig.renderer.constructor.name === "Renderer") {
        this.rendererConfig = (
          this.rendererConfig.renderer as RendererType
        ).getConfig() as SpritesheetConfiguration;
      } else {
        this.rendererConfig = (
          this.rendererConfig.renderer as MultiRendererType
        ).getConfigFromIndex(this.rendererConfig.index) as SpritesheetConfiguration;
      }
    }
  }
  /**
   * given renderer to setup config file with crops.
   * @Docs https://engine-docs-git-develop-tolethrien.vercel.app/docs/fragment/fragment#dodawaniePluginow
   */
  geRenderer(renderer: RendererType | MultiRendererType, index?: number) {
    this.rendererConfig = { renderer, index };
  }
  /**
   * give animator object with all animation data like state names, number of frames in state etc.
   */
  setAnimationData(data: AnimationData) {
    this.animationData = data;
    this.state = Object.entries(data).find((e) => e[1].startAnimation)?.[0] ?? Object.keys(data)[0];
  }
  /**animator updater! function controled by Fragment and game loop.
   *  DO NOT invoke */
  update() {
    this.updateAnimation();
  }
  /**main update animation loop */
  private updateAnimation() {
    //should animate?
    if (this.isAnimate && "crop" in this.rendererConfig) {
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
          this.rendererConfig.crop.x += this.rendererConfig.cropSize.width;
          this.rendererConfig.crop.y =
            this.rendererConfig.cropSize.height *
            (this.animationData[this.state].rowInSpritesheet - 1);
        }
        // if frame is last - start all over or stop animating
        else {
          this.stopOnAnimationFinished ? this.stop() : (this.rendererConfig.crop.x = 0);
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
    (this.rendererConfig as SpritesheetConfiguration).crop.x = 0;
  }
  /**changing animation */
  changeState(newState: string) {
    if (this.state === newState) return;
    this.state = newState;
    this.rewind();
  }
}
