import { CameraType } from "../components/camera";

export interface mousePropagationType extends MouseEventsType {}

export let mousePressed = false;
const mousePosition: [number, number, number, number] = [0, 0, 0, 0];
export const mouseProxymityList = new Set<mousePropagationType>();

export const getMousePosition = (state: "fixed" | "translated") => {
  return state === "translated"
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
export function mouseHandlers(canvas: HTMLCanvasElement, camera?: CameraType) {
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

  if (!camera) {
    canvas.addEventListener("mousemove", (event) => {
      mousePosition[0] = Math.round(event.clientX - canvas.parentElement!.offsetLeft);
      mousePosition[1] = Math.round(event.clientY - canvas.parentElement!.offsetTop);
      mousePosition[2] = Math.round(event.clientX - canvas.parentElement!.offsetLeft);
      mousePosition[3] = Math.round(event.clientY - canvas.parentElement!.offsetTop);
    });
  } else {
    canvas.addEventListener("mousemove", (event) => {
      mousePosition[0] =
        Math.round(event.clientX - canvas.parentElement!.offsetLeft + camera.position.get().x) /
        camera.zoom;
      mousePosition[1] =
        Math.round(event.clientY - canvas.parentElement!.offsetTop + camera.position.get().y) /
        camera.zoom;
      mousePosition[2] = Math.round(event.clientX - canvas.parentElement!.offsetLeft);
      mousePosition[3] = Math.round(event.clientY - canvas.parentElement!.offsetTop);
    });
  }
}
//====================================================

export type keyTypes = "d" | "a" | "h" | "w" | "s" | "space";
export const keyPressed: Set<string> = new Set();

export const keysHandles = () => {
  window.onkeydown = (event: KeyboardEvent) => {
    const pressedKey = event.key === " " ? "space" : event.key;
    !event.repeat && keyPressed.add(pressedKey);
  };
  window.onkeyup = (event: KeyboardEvent) => {
    const pressedKey = event.key === " " ? "space" : event.key;
    keyPressed.has(pressedKey) && keyPressed.delete(pressedKey);
  };
};
