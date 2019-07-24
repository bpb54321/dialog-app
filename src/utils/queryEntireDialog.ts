import fetchData from "./fetch-data";
import Role from "../types/Role";
import LineData from "../types/LineData";
import {GlobalContextObject} from "../contexts/GlobalContext";

export default async function queryEntireDialog(globalContext: GlobalContextObject, dialogId: string,) {

  const {data} = globalContext;

  const query =
    `
      query {
        dialog(id: "${dialogId}") {
          id
          name
          roles {
            id
            name
          }
          lines {
            id
            text
            number
            role {
              id
              name
            }
          }
        }
      }
    `;


  const response = await fetch(data.apiEndpoint, {
    method: "POST",
    body: JSON.stringify({
      query: query,
    }),
    headers: {
      "Authorization": data.token ? `Bearer ${data.token}` : "",
      "Content-Type": "application/json",
    },
    mode: "cors",
  });

  const body = await response.json();
  return body.data.dialog;
}
