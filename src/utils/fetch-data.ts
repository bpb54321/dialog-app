import GraphqlError from "../types/GraphqlError";

export default function fetchData(
  query: string, token: string = "", apiEndpoint: string, resultCallback: (body: any) => void,
  errorMessageCallback: (errorMessage: string) => void
): void {
  fetch(apiEndpoint, {
    method: "POST",
    body: JSON.stringify({
      query: query,
    }),
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
    mode: "cors",
  }).then((response) => {
    return response.json();
  }).then((body) => {
    if (body.errors) {
      let errorMessage = body.errors.reduce((accumulator: string, error: GraphqlError) => {
        return accumulator + " " + error.message;
      }, "");
      errorMessageCallback(errorMessage);
    } else {
      resultCallback(body);
    }
  }).catch((error) => {
    console.log(error);
  });
}
