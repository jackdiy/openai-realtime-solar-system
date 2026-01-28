// Gemini API 配置
// 使用Gemini 2.0 Flash Exp进行语音交互

const PLANETS = [
  "太阳", "水星", "金星", "地球", "火星", 
  "木星", "土星", "天王星", "海王星", "冥王星"
];

const MOONS = [
  "木卫一", "木卫二", "木卫三", "木卫四",
  "冥卫一", "冥卫二", "冥卫三", "冥卫四", "冥卫五"
];

// Gemini工具定义
const toolsDefinition = [
  {
    name: "focus_planet",
    description: "当用户询问特定星球时，聚焦到该星球",
    parameters: {
      type: "object",
      properties: {
        planet: {
          type: "string",
          enum: PLANETS,
          description: "要聚焦的星球名称",
        },
      },
      required: ["planet"],
    },
  },
  {
    name: "display_data",
    description: "显示图表来总结数据。在回答用户之前调用此工具，只要有数值数据需要展示就立即调用。",
    parameters: {
      type: "object",
      properties: {
        chart: {
          type: "string",
          enum: ["bar", "pie"],
          description: "最合适的图表类型",
        },
        title: {
          type: "string",
          description: "将显示在图表上方的响应标题，要简洁",
        },
        text: {
          type: "string",
          description: "在图表上方显示的可选文本，用于提供更多上下文，如果不需要则为空",
        },
        data: {
          type: "array",
          description: "在组件中显示的数据，如果不适用则为空数组",
          items: {
            type: "object",
            properties: {
              label: {
                type: "string",
                description: "数据项标签",
              },
              value: {
                type: "string",
                description: "数据项值",
              },
            },
            required: ["label", "value"],
          },
        },
      },
    },
  },
  {
    name: "reset_camera",
    description: "当用户说他们完成了，例如'谢谢，我好了'时，缩小星球聚焦并将相机重置到初始位置",
    parameters: {},
  },
  {
    name: "show_orbit",
    description: "当有关于太阳系中行星位置的问题时显示行星轨道",
    parameters: {},
  },
  {
    name: "show_moons",
    description: "显示卫星列表",
    parameters: {
      type: "object",
      properties: {
        moons: {
          type: "array",
          items: {
            type: "string",
            enum: MOONS,
          },
        },
      },
      required: ["moons"],
    },
  },
  {
    name: "get_iss_position",
    description: "获取国际空间站的位置，一旦你得到它，大声说出来",
    parameters: {},
  },
];

export const GEMINI_TOOLS = toolsDefinition.map((tool) => ({
  type: "function",
  ...tool,
}));

export const GEMINI_INSTRUCTIONS = `
你是一个助手，帮助用户导航3D太阳系并了解行星及其轨道。

请务必使用简体中文与用户交流。

一旦用户开始谈论某个特定的星球，使用 focus_planet 工具放大该星球。
当他们停止谈论它并询问其他话题时，就不需要再聚焦它了，所以调用 reset_camera 工具将相机位置重置为查看整个太阳系。

回答他们关于太阳系的任何问题，如果他们有一个你可以用数字回答的具体问题，先回答问题，然后使用 display_data 工具向他们显示一个图表，在屏幕上显示答案的摘要。例如，如果他们询问高度比较，向他们展示一个条形图。如果他们询问元素的分布或分配，向他们展示一个饼图。
调用 display_data 工具来显示响应，然后大声说出你在图表中显示的内容。例如，如果他们提出一个可以用图表回答的问题（元素分布、数字比较），首先调用 display_data 工具显示图表，然后大声说出你在图表中显示的内容。

如果他们询问与太阳系中行星位置相关的内容，使用 show_orbit 工具从上方查看。

如果他们询问卫星，谈论它们，然后调用 show_moons 工具显示卫星列表。

当他们说"谢谢，我好了"或类似意思的话，表示他们已完成问题，不需要继续对话时，调用 reset_camera 工具。
不要在用户没有特别说应该触发相机重置的内容时调用此工具。

每当有意义时，在响应后调用一个工具。

要友好但不要过度兴奋，想象你在课堂上与学生交谈。
在你的回答中要非常简洁，说话要快。不要添加用户没有要求的不必要的细节。

如果用其他语言说话，请使用母语口音。
`;

export const GEMINI_MODEL = "gemini-2.0-flash-exp"; // 使用最新的Gemini 2.0 Flash实验版
export const GEMINI_VOICE = "Puck"; // Gemini语音选项
