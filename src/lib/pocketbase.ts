import PocketBase from "pocketbase";

const pb: PocketBase = new PocketBase("http://127.0.0.1:8090");

export function pbErrorMapper({ error }: any) {
  console.log("PB error mapper:", error);
  const errorCode = error.data?.code || 400;
  let errorLabel = error.data?.data || {
    unexpectedError: {
      message: "unexpected Error Appear",
    },
  };

  Object.keys(errorLabel).forEach((keys) => delete errorLabel[keys].code);

  return { errorCode, errorLabel };
}

export default pb;
