let justFetch = async (endpoint, postoptions) => {
    if (endpoint == null || endpoint.length < 4) {
        return { error: true, type: "url", message: "Invalid endpoint URL" };
    }
    let options = postoptions || {};
    let req_method = options.method || "GET"; //PUT //POST //DELETE etc.
    let req_hd = {};
    let headers = {};
    let final_endpoint = endpoint;
    if (!location.hostname.includes("hiskenya")) {
        let encurl = window.encodeURIComponent(window.btoa(endpoint));
        // console.log('encurl = '+encurl);
        final_endpoint = "http://localhost:3300/request/" + encurl;
    }
    req_hd.headers = headers;
    req_hd.method = req_method;
    req_hd.Accept = "application/json";

    // console.log(`justFetch: ${final_endpoint} with headers: ${JSON.stringify(req_hd)}`);
    try {
        let result = await window.fetch(final_endpoint, req_hd);
        let result_json = await result.json();
        if (result_json.status === "ERROR") {
            throw result_json;
        }
        return result_json;
    } catch (err) {
        return { error: true, msg: err.message };
    }
};