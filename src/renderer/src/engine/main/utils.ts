export function loadFile(
  fileType: "img" | "audio",
  file: string
): HTMLAudioElement | HTMLImageElement;
export function loadFile<T extends HTMLAudioElement | HTMLImageElement>(
  fileType: "img" | "audio",
  file: string
): T;

export function loadFile(fileType: "img" | "audio", file: string) {
  switch (fileType) {
    case "img": {
      const image = new Image();
      image.src = file;
      return image;
    }
    case "audio": {
      const audio = new Audio();
      audio.src = file;
      return audio;
    }
  }
}
export default loadFile;
