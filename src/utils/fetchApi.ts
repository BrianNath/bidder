export function Logger(message: any) {
  if (process.env.NODE_ENV == "development") {
    console.log("FROM LOGGER = ", message);
  }
}

interface Payload {
  url: string;
  method: string;
  isMultipart: boolean;
  body: object;
}

export default async function fetchApi(payload: Payload) {
  const { url, method, body = {}, isMultipart = false } = payload;
  const jwtToken = localStorage.getItem("authToken");

  const requestOptions: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    mode: "same-origin",
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  // if (isMultipart) {
  //   const formData = new FormData();
  //   // console.log(Object.entries(body));
  //   Object.entries(body).forEach(([key, value]) => {
  //     if (Array.isArray(value)) {
  //       value.forEach((file) => formData.append(key, file));
  //     } else {
  //       formData.append(key, value);
  //     }
  //     // console.log(`${key}, ${value}`);
  //   });
  //   requestOptions.body = formData;
  //   requestOptions.headers["Content-Type"] = `multipart/form-data`;
  // } else {
    requestOptions.headers["Content-Type"] = "application/json";
    if (method === "GET") {
      delete requestOptions.body;
    } else {
      requestOptions.body = JSON.stringify(body);
    }
  // }

  // console.log("REQUEST OPTION :", requestOptions);

  // console.log("FORM DATA :", requestOptions.body);

  const response = await fetch(url, requestOptions).then((response) => {
    return response.json();
  });

  Logger(response);

  return response;
}
