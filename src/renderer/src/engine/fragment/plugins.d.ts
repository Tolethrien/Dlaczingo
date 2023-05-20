import Renderer from "./plugins/renderer";
import Hitboxes from "./plugins/hitboxes";
import KeyEvents from "./plugins/keyEvents";
import MouseEvents from "./plugins/mouseEvents";
import MovementRestriction from "./plugins/movementRestriction";
import pluginList from "./pluginList";

export declare global {
  declare type pluginListT = Uncapitalize<keyof typeof pluginList>;
  declare interface RendererType extends Renderer {}
  declare interface HitboxesType extends Hitboxes {}
  declare interface keyEventsType extends KeyEvents {}
  declare interface MouseEventsType extends MouseEvents {}
  declare interface MovementRestrictionType extends MovementRestriction {}
}
