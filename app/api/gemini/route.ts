// Gemini API 会话路由
// 注意：Gemini Multimodal Live API 使用WebSocket进行实时音频交互

import { GEMINI_MODEL } from "@/lib/gemini-config";

// 创建Gemini会话配置
export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 返回配置信息给客户端
    // 客户端将使用此配置建立WebSocket连接
    return new Response(
      JSON.stringify({
        model: GEMINI_MODEL,
        apiKey: apiKey, // 注意：生产环境应使用代理模式，不要直接暴露API密钥
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
