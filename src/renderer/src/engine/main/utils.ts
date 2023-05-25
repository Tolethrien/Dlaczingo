// load File

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
