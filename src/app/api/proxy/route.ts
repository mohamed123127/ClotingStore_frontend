export async function GET(request) {
  const url = new URL(request.url);
  const query = url.search.replace("?path=", ""); 
  const targetUrl = process.env.API_URL + query;

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.API_KEY,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    // تسجيل الـ status والبيانات في حالة النجاح
    console.log(`[API SUCCESS] URL: ${targetUrl}, Status: ${response.status}`);

    return Response.json(data, { status: response.status });
  } catch (error) {
    // تسجيل الخطأ والـ status الافتراضي (يمكن تغييره حسب نوع الخطأ)
    console.error(`[API ERROR] URL: ${targetUrl}, Status: 500, Error:`, error);

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
