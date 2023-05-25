import KeyEvents from "./plugins/keyEvents";
import MouseEvents from "./plugins/mouseEvents";
import MovementRestriction from "./plugins/movementRestriction";
import Renderer from "./plugins/renderer";
import Hitboxes from "./plugins/hitboxes";
import Animator from "./plugins/animator";
import DirectionalMovement from "./plugins/directionalMovement";
const pluginList = {
  Renderer,
  MouseEvents,
  KeyEvents,
  MovementRestriction,
  Hitboxes,
  Animator,
  DirectionalMovement
};
export default pluginList;
