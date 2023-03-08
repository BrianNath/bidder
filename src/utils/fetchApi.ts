export function Logger(message: any) {
  if (process.env.NODE_ENV == "development") {
    console.log("FROM LOGGER = ", message);
  }
}

interface Payload {
  url: string;
  method: string;
  body: object;
}

export default async function fetchApi(payload: Payload) {
  const { url, method, body = {} } = payload;

  // Logger(payload);
  const jwtToken = localStorage.getItem("authToken");
  // Logger(jwtToken);

  const requestOptions: RequestInit = {
    method,
    mode: "same-origin",
    cache: "no-cache" as RequestCache,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  if (method === "GET") {
    delete requestOptions.body;
  } else {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, requestOptions).then((response) => {
    return response.json();
  });

  Logger(response);
  return response;
}
