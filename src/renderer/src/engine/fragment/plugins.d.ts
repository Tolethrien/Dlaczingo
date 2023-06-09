import Renderer from "./plugins/renderer";
import Hitboxes from "./plugins/hitboxes";
import KeyEvents from "./plugins/keyEvents";
import MouseEvents from "./plugins/mouseEvents";
import MovementRestriction from "./plugins/movementRestriction";
import pluginList from "./pluginList";
import Animator from "./plugins/animator";
import DirectionalMovement from "./plugins/directionalMovement";
import Plugin from "./plugins/plugin";
import MultiRenderer from "./plugins/multiRenderer";
import TextRendering from "./plugins/textRendering";
export declare global {
  interface PluginProps {
    position: Vec2DType;
    size: Vec2DType;
    siblings: Plugin[];
    layer: FragmentLayer;
    referanceName: string;
    relatedTo: Vec2DType;
  }
  type PluginListT = Uncapitalize<keyof typeof pluginList>;
  interface RendererType extends Renderer {}
  interface HitboxesType extends Hitboxes {}
  interface keyEventsType extends KeyEvents {}
  interface MouseEventsType extends MouseEvents {}
  interface MovementRestrictionType extends MovementRestriction {}
  interface AnimatorType extends Animator {}
  interface DirectionalMovementType extends DirectionalMovement {}
  interface MultiRendererType extends MultiRenderer {}
  interface TextRenderingType extends TextRendering {}
}
