import {GlobalContextObject} from "../contexts/GlobalContext";

export default async function fetchData(query: string, queryVariables: {[index: string]: any},
                                        topLevelQueryField: string, globalContext: GlobalContextObject) {
  const {data} = globalContext;

  const response = await fetch(data.apiEndpoint, {
    method: "POST",
    body: JSON.stringify({
      query: query,
      variables: queryVariables,
    }),
    headers: {
      "Authorization": data.token ? `Bearer ${data.token}` : "",
      "Content-Type": "application/json",
    },
    mode: "cors",
  });

  const body = await response.json();

  return body.data[topLevelQueryField];
}

