export async function GET(request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path"); // مثلا: /products
  url.searchParams.delete("path"); // نشيلها
  const params = url.searchParams.toString();
  // بناء الـ URL النهائي
  const targetUrl = `${process.env.API_URL}${path}${params ? `?${params}` : ""}`;
  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.API_KEY,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return Response.json(data, { status: response.status });
    } else {
      const text = await response.text();
      console.error(`[API ERROR] Expected JSON but got HTML`, text);
      return Response.json(
        { message: "Expected JSON but got HTML", status: response.status },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error(`[Proxy Error] URL: ${targetUrl}`, error);
    return Response.json(
      { message: "Something went wrong", error: error.message || error },
      { status: 500 }
    );
  }
}



export async function POST(request) {
  const url = new URL(request.url);
  const query = url.search.replace("?path=",""); 
  const targetUrl = process.env.API_URL + query;
  const body = await request.json();

  try {

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "X-API-KEY": `${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy Error:", error);
    return Response.json({ message: "Something went wrong" , error:error}, { status: 500 });
  }
}
