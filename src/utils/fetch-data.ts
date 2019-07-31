import {GlobalState} from "../contexts/GlobalStateContext";

export default async function fetchData(query: string, queryVariables: {[index: string]: any},
                                        topLevelQueryField: string, globalContext: GlobalState) {
  const response = await fetch(globalContext.apiEndpoint, {
    method: "POST",
    body: JSON.stringify({
      query: query,
      variables: queryVariables,
    }),
    headers: {
      "Authorization": globalContext.token ? `Bearer ${globalContext.token}` : "",
      "Content-Type": "application/json",
    },
    mode: "cors",
  });

  const body = await response.json();

  if (body.errors && body.errors.length > 0) {
    throw Error(body.errors[0].message);
  }

  return body.data[topLevelQueryField];
}

