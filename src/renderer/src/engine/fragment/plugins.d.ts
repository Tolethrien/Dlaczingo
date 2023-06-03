import Renderer from "./plugins/renderer";
import Hitboxes from "./plugins/hitboxes";
import KeyEvents from "./plugins/keyEvents";
import MouseEvents from "./plugins/mouseEvents";
import MovementRestriction from "./plugins/movementRestriction";
import fragmentPluginList from "./fragmentPluginList";
import Animator from "./plugins/animator";
import DirectionalMovement from "./plugins/directionalMovement";
import Plugin from "./plugins/plugin";
export declare global {
  interface PluginProps {
    position: Vec2DType;
    size: Vec2DType;
    siblings: Plugin[];
    layer: FragmentLayer;
    referanceName: string;
    relatedTo: Vec2DType;
  }
  type fragmentPluginListT = Uncapitalize<keyof typeof fragmentPluginList>;
  interface RendererType extends Renderer {}
  interface HitboxesType extends Hitboxes {}
  interface keyEventsType extends KeyEvents {}
  interface MouseEventsType extends MouseEvents {}
  interface MovementRestrictionType extends MovementRestriction {}
  interface AnimatorType extends Animator {}
  interface DirectionalMovementType extends DirectionalMovement {}
}
