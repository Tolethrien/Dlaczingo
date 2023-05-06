import { canvas } from "./engine";
import { MouseEventsType } from "../fragment/plugins/mouseEvents";
import { camPos, zoom } from "../components/camera";

export interface mousePropagationType extends MouseEventsType {}

export let mousePressed = false;
const mousePosition: [number, number, number, number] = [0, 0, 0, 0];
export const mouseProxymityList = new Set<mousePropagationType>();

export const getMousePosition = (state: "fixed" | "translated") => {
  return state === "fixed"
    ? { x: mousePosition[0], y: mousePosition[1] }
    : { x: mousePosition[2], y: mousePosition[3] };
};
const useProximityFilter = () => {
  let target!: mousePropagationType;
  ["uiObjects", "gameObjects"].every((layer) => {
    const eventList = [...mouseProxymityList].filter((mousePlugin) => mousePlugin.layer === layer);
    return eventList.length !== 0 ? ((target = eventList[eventList.length - 1]), false) : true;
  });
  if (!target) return;
  return target;
};
export function mouseHandlers() {
  // primary button
  canvas.onclick = () => {
    const target = useProximityFilter();
    if (target) {
      target.mouseCollide() ? target.onClickEvent() : target.onDragOut();
      setTimeout(() => mouseProxymityList.clear(), 0);
    }
  };
  // context button
  canvas.oncontextmenu = () => {
    const target = useProximityFilter();
    if (target) {
      target.mouseCollide() && target.onContextEvent();
      setTimeout(() => mouseProxymityList.clear(), 0);
    }
  };
  // all additional buttons on mouse by event.button:number
  canvas.onauxclick = (event: MouseEvent) => {
    if (event.button === 1) {
      const target = useProximityFilter();
      if (target) {
        target.mouseCollide() && target.onClickMiddleEvent();
        setTimeout(() => mouseProxymityList.clear(), 0);
      }
    }
  };
  canvas.onmousedown = () => (mousePressed = true);
  canvas.onmouseup = () => (mousePressed = false);

  canvas.addEventListener("mousemove", (event) => {
    mousePosition[0] = Math.round(event.clientX - canvas.parentElement!.offsetLeft);
    mousePosition[1] = Math.round(event.clientY - canvas.parentElement!.offsetTop);
    mousePosition[2] =
      Math.round(event.clientX - canvas.parentElement!.offsetLeft + camPos.get().x) / zoom;
    mousePosition[3] =
      Math.round(event.clientY - canvas.parentElement!.offsetTop + camPos.get().y) / zoom;
  });
}
//====================================================

export type keyTypes = "d" | "a" | "w" | "s" | "space";
type KeyList = { [key in keyTypes]?: (() => void) | undefined };
export const keyList: KeyList = {};
export const keyPressed: Set<string> = new Set();
export const keyHoldList = new Map<string, () => void | undefined>();
export const keyHoldEventUpdate = () => {
  keyPressed.size !== 0 &&
    keyPressed.forEach((key) => {
      keyHoldList.has(key) && keyHoldList.get(key)?.();
    });
};

export const keysHandles = () => {
  window.onkeydown = (event: KeyboardEvent) => {
    const pressedKey = event.key === " " ? "space" : event.key;
    keyPressed.add(pressedKey);
    !keyHoldList.has(pressedKey) && !event.repeat && keyList[pressedKey]?.();
  };
  window.onkeyup = (event: KeyboardEvent) => {
    const pressedKey = event.key === " " ? "space" : event.key;
    keyPressed.has(pressedKey) && keyPressed.delete(pressedKey);
  };
};
