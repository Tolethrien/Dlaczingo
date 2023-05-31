import UiRenderer from "./plugins/uiRenderer";
import UiMouseEvents from "./plugins/uiMouseEvents";
import uiPluginList from "./uiPluginList";
export declare global {
  type uiPluginListT = Uncapitalize<keyof typeof uiPluginList>;
  interface uiRendererType extends UiRenderer {}
  interface uiMouseEventsType extends UiMouseEvents {}
}
