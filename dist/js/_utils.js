function trimTrailingSlash(url) {
    return url.replace(/\/+$/, "");
}

function dhis2BaseUrl() {
    if (window.DHIS2_BASE_URL) {
        return trimTrailingSlash(window.DHIS2_BASE_URL);
    }

    let pathname = window.location.pathname || "";
    let appsIndex = pathname.indexOf("/api/apps/");
    let contextPath = appsIndex >= 0 ? pathname.substring(0, appsIndex) : "";
    return trimTrailingSlash(window.location.origin + contextPath);
}

function dhis2Url(path) {
    if (path == null || path === "") {
        return dhis2BaseUrl();
    }

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    let normalizedPath = path.charAt(0) === "/" ? path : "/" + path;
    return dhis2BaseUrl() + normalizedPath;
}

function dhis2ApiUrl(path) {
    if (path == null || path === "") {
        return dhis2Url("/api");
    }

    if (/^https?:\/\//i.test(path)) {
        return dhis2Url(path);
    }

    if (path.indexOf("/api/") === 0 || path === "/api") {
        return dhis2Url(path);
    }

    if (path.indexOf("api/") === 0) {
        return dhis2Url("/" + path);
    }

    return dhis2Url("/api/" + path.replace(/^\/+/, ""));
}

function dhis2HomeUrl() {
    return dhis2Url("/");
}

if (window.jQuery && window.jQuery.ajaxPrefilter) {
    window.jQuery.ajaxPrefilter(function (options) {
        if (options && options.url) {
            options.url = dhis2Url(options.url);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    let backLinks = document.querySelectorAll(".back-to-dhis-link");
    backLinks.forEach(function (link) {
        link.setAttribute("href", dhis2HomeUrl());
    });
});

let justFetch = async (endpoint, postoptions) => {
    if (endpoint == null || endpoint.length < 4) {
        return { error: true, type: "url", message: "Invalid endpoint URL" };
    }
    let options = postoptions || {};
    let req_method = options.method || "GET"; //PUT //POST //DELETE etc.
    let req_hd = {};
    let headers = {};
    let final_endpoint = dhis2Url(endpoint);
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