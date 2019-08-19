import {GlobalState} from "../contexts/GlobalStateContext";
import axios from "axios";

export default async function fetchData(query: string, queryVariables: {[index: string]: any},
                                        topLevelQueryField: string, globalContext: GlobalState) {

  const response = await axios(globalContext.apiEndpoint, {
    method: "POST",
    data: JSON.stringify({
      query: query,
      variables: queryVariables,
    }),
    headers: {
      "Authorization": globalContext.token ? `Bearer ${globalContext.token}` : "",
      "Content-Type": "application/json",
    },

  });

  const body = response.data;

  if (body.errors && body.errors.length > 0) {
    throw Error(body.errors[0].message);
  }

  return body.data[topLevelQueryField];
}

