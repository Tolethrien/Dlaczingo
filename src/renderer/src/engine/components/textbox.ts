import Fragment from "../fragment/fragment";
const text =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";
export default class Textbox extends Fragment {
  textRendering!: TextRenderingType;
  constructor(props: FragmentProps) {
    super(props);
    this.attachPlugin("textRendering");
    this.textRendering.settings({
      text: text,
      font: "Arial",
      fontSize: 18,
      fontWeight: 900,
      align: { Xaxis: "left", Yaxis: "top" },
      color: [50, 50, 50],
      offset: { x: 0, y: 0 },
      padding: { left: 10, right: 10, top: 0, bottom: 0 },
      box: { width: this.size.get().x, height: this.size.get().y },
      overflow: "scroll-visible"
    });
    // this.textRendering.debug = true;
  }
  update() {
    // this.textRendering.position.add([0, -1]);
    super.update();
  }
  render() {
    // ctx.stroke(this.clip.getPath);
    // this.clip.start();
    super.render();
    // this.clip.end();
  }
}
