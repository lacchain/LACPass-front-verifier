const app = {};

//config
app.config = {
  sessionToken: false,
  count: 0,
};

//Ajax client (for the restful API)
app.client = {};

// Interface for making API calls
app.client.request = (
  headers,
  path,
  method,
  queryStringObject,
  payload,
  callback
) => {
  //set defaults
  headers = typeof headers === "object" && headers !== null ? headers : {};
  path = typeof path === "string" ? path : "/";
  method =
    typeof method === "string" &&
    ["POST", "GET", "PUT", "DELETE"].indexOf(method) > -1
      ? method.toUpperCase()
      : "GET";
  queryStringObject =
    typeof queryStringObject === "object" && queryStringObject !== null
      ? queryStringObject
      : {};
  payload =
    typeof payload === "object" && payload !== null
      ? payload
      : typeof payload === "string" && payload !== null
      ? payload
      : {};
  callback = typeof callback === "function" ? callback : false;

  //for each query String  parameter sent, add it to the path
  let requestUrl =
    "https://lacpass-verifier-api.lacchain.net/api/v1" + path + "?"; // TODO: move to env
  let counter = 0;
  for (let queryKey in queryStringObject) {
    if (queryStringObject.hasOwnProperty(queryKey)) {
      counter++;
      //If  at least one query string parameter has already been added, prepend  new ones with ampersand
      if (counter > 1) {
        requestUrl += "&";
      }
      //Add the key and value
      requestUrl += queryKey + "=" + queryStringObject[queryKey];
    }
  }

  //form the http request as a json type
  let xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  typeof payload === "string" && payload !== null
    ? xhr.setRequestHeader("Content-Type", "text/plain")
    : xhr.setRequestHeader("Content-Type", "application/json");
  //For each header  sent add it to the request ne by one
  for (let headerKey in headers) {
    if (headerKey.hasOwnProperty(headerKey)) {
      xhr.setRequestHeader(headerKey, headers[headerKey]);
    }
  }

  //if there is a current session token set, add that as a header
  if (app.config.sessionToken) {
    xhr.setRequestHeader("token", app.config.sessionToken.id);
  }

  //When the request comes back handle the response
  xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      //means the request is done
      let statusCode = xhr.status;
      let responseReturned = xhr.responseText;

      if (xhr.status !== 200) {
        console.log("Error received from server: ", xhr.responseText);
      }

      //Callback if requested
      if (callback) {
        try {
          const parsedResponse = JSON.parse(responseReturned);
          callback(statusCode, parsedResponse);
        } catch (e) {
          console.log("Error processing response", e);
          callback(statusCode, false);
        }
      }
    }
  };
  //Set the payload as json
  const payloadString =
    typeof payload === "string" && payload !== null
      ? payload
      : JSON.stringify(payload);
  xhr.send(payloadString);
};
