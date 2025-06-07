import type { APIRoute } from 'astro';

// 强制此API路由为服务器端渲染
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  return new Response(JSON.stringify({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    url: request.url
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('POST request received');
    console.log('URL:', request.url);
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
    
    return new Response(JSON.stringify({
      success: true,
      message: 'POST request received successfully!',
      timestamp: new Date().toISOString(),
      headers: Object.fromEntries(request.headers.entries())
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('POST error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
