export const onRequest: PagesFunction = async (context) => {
  const origin = context.request.headers.get("Origin");
  const isOptions = context.request.method === "OPTIONS";

  if (isOptions) {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const response = await context.next();
  const newResponse = new Response(response.body, response);
  newResponse.headers.set("Access-Control-Allow-Origin", origin || "*");
  newResponse.headers.set("Access-Control-Allow-Credentials", "true");
  newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-user-id");

  return newResponse;
};
