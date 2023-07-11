import { CameraType } from "../components/camera";

export let mousePressed = false;
const mousePosition: [number, number, number, number] = [0, 0, 0, 0];
export let mouseDelta = { x: 0, y: 0 };
export const mouseProxymityList = new Set<MouseEventsType>();

export const getMousePosition = (state: "fixed" | "translated") => {
  return state === "translated"
    ? { x: mousePosition[0], y: mousePosition[1] }
    : { x: mousePosition[2], y: mousePosition[3] };
};
const useProximityFilter = () => {
  let target!: MouseEventsType;
  ["uiObjects", "gameObjects"].every((layer) => {
    const eventList = [...mouseProxymityList].filter((mousePlugin) => mousePlugin.layer === layer);
    return eventList.length !== 0 ? ((target = eventList[eventList.length - 1]), false) : true;
  });
  return !target ? false : target;
};
export function mouseHandlers(canvas: HTMLCanvasElement, camera?: CameraType) {
  // primary button
  canvas.onclick = () => {
    const target = useProximityFilter();
    if (target) {
      target.mouseCollide() ? target.onClickEvent() : target.onDragOut();
      //TODO: add dubble click timeout to prevent clearing
      // setTimeout(() => mouseProxymityList.clear(), 0);
      mouseProxymityList.clear();
    }
  };
  let ClearScroll: NodeJS.Timer | null = null;
  canvas.onwheel = (e) => {
    mouseDelta = { x: e.deltaX, y: e.deltaY };
    if (ClearScroll) {
      clearInterval(ClearScroll);
    }
    ClearScroll = setInterval(() => {
      mouseDelta = { x: 0, y: 0 };
      clearInterval(ClearScroll as NodeJS.Timer);
      ClearScroll = null;
    }, 50);
  };
  // context button
  canvas.oncontextmenu = () => {
    const target = useProximityFilter();
    if (target) {
      target.mouseCollide() && target.onContextEvent();
      mouseProxymityList.clear();
    }
  };
  // all additional buttons on mouse by event.button:number
  canvas.onauxclick = (event: MouseEvent) => {
    if (event.button === 1) {
      const target = useProximityFilter();
      if (target) {
        target.mouseCollide() && target.onClickMiddleEvent();
        mouseProxymityList.clear();
      }
    }
  };
  canvas.onmousedown = (event) => {
    mousePressed = true;
  };
  canvas.onmouseup = () => {
    mousePressed = false;
  };

  if (!camera) {
    canvas.addEventListener("mousemove", (event) => {
      mousePosition[0] = Math.round(event.offsetX);
      mousePosition[1] = Math.round(event.offsetY);
      mousePosition[2] = Math.round(event.offsetX);
      mousePosition[3] = Math.round(event.offsetY);
    });
  } else {
    canvas.addEventListener("mousemove", (event) => {
      mousePosition[0] = Math.round(event.offsetX + camera.position.get().x) / camera.zoom;
      mousePosition[1] = Math.round(event.offsetY + camera.position.get().y) / camera.zoom;
      mousePosition[2] = Math.round(event.offsetX);
      mousePosition[3] = Math.round(event.offsetY);
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
