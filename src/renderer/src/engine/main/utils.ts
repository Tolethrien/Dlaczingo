//=====================================
export function loadFile(fileType: "img" | "audio", file: string): AudioFileType | ImageFileType;
export function loadFile<T extends AudioFileType | ImageFileType>(
  fileType: "img" | "audio",
  file: string
): T;
export function loadFile(fileType: "img" | "audio", file: string) {
  switch (fileType) {
    case "img": {
      const image = new Image();
      image.src = file;
      return image as ImageFileType;
    }
    case "audio": {
      const audio = new Audio();
      audio.src = file;
      return audio as AudioFileType;
    }
  }
}
//=====================================
export const createRandomId = () => "_" + Math.random().toString(36).substring(2, 9);
//=====================================
export const nameToUpper = (name: string) =>
  [name[0].toUpperCase(), name.slice(1)].toString().replace(",", "");
//=====================================
export const loadFont = () => {
  return new FontFace("test", "url(x)");
};
//=====================================
export const mapRange = (
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number
) => {
  return outputMin + ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin);
};
