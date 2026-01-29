// Gemini API 会话路由（安全代理）
// 重要：不在客户端暴露API密钥，通过服务器代理所有Gemini请求

import { GEMINI_MODEL } from "@/lib/gemini-config";

// 获取会话配置（不暴露API密钥）
export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 只返回模型信息，不返回API密钥
    // 客户端将通过POST路由发送请求
    return new Response(
      JSON.stringify({
        model: GEMINI_MODEL,
        sessionId: crypto.randomUUID(), // 生成会话ID
        status: "ready",
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

// 代理Gemini API请求（保持API密钥在服务器端）
export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 从请求体中获取要发送给Gemini的数据
    const requestBody = await request.json();
    
    // TODO: 实现实际的Gemini API调用
    // 注意：由于Gemini使用WebSocket，这个POST路由可能需要更复杂的实现
    // 当前版本仅作为安全占位符
    console.log('Received request:', requestBody);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "This is a proxy endpoint. WebSocket connection should be handled separately.",
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
