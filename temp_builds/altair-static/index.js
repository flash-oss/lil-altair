"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default,
  getAltairHtml: () => getAltairHtml,
  getDistDirectory: () => getDistDirectory,
  isSandboxFrame: () => isSandboxFrame,
  renderAltair: () => renderAltair,
  renderInitSnippet: () => renderInitSnippet,
  renderInitialOptions: () => renderInitialOptions
});
module.exports = __toCommonJS(src_exports);

// src/get-altair-html.ts
var import_fs = require("fs");
var import_path2 = require("path");

// src/get-dist.ts
var import_path = require("path");
var getDistDirectory = () => (0, import_path.resolve)(__dirname, "./dist");

// src/get-altair-html.ts
function getAltairHtml() {
  return (0, import_fs.readFileSync)((0, import_path2.resolve)(getDistDirectory(), "index.html"), "utf8");
}

// src/index.ts
var optionsProperties = {
  endpointURL: void 0,
  subscriptionsEndpoint: void 0,
  subscriptionsProtocol: void 0,
  initialQuery: void 0,
  initialVariables: void 0,
  initialPreRequestScript: void 0,
  initialPostRequestScript: void 0,
  initialHeaders: void 0,
  initialEnvironments: void 0,
  instanceStorageNamespace: void 0,
  initialSettings: void 0,
  initialSubscriptionRequestHandlerId: void 0,
  initialSubscriptionsPayload: void 0,
  initialRequestHandlerId: void 0,
  initialRequestHandlerAdditionalParams: void 0,
  preserveState: void 0,
  initialHttpMethod: void 0,
  initialWindows: void 0,
  disableAccount: void 0,
  persistedSettings: void 0,
  initialName: void 0,
  initialAuthorization: void 0,
  cspNonce: void 0
};
var allowedProperties = Object.keys(
  optionsProperties
);
var getObjectPropertyForOption = (option, propertyName) => {
  if (typeof option !== "undefined") {
    switch (typeof option) {
      case "object":
        return `${propertyName}: ${JSON.stringify(option)},`;
      case "boolean":
        return `${propertyName}: ${option},`;
    }
    return `${propertyName}: \`${option}\`,`;
  }
  return "";
};
var renderInitialOptions = (options = {}) => {
  return renderInitSnippet(options);
};
var renderInitSnippet = (options = {}) => {
  return `
        AltairGraphQL.init(${getRenderedAltairOpts(options)});
    `;
};
var renderAltair = (options = {}) => {
  var _a, _b;
  const altairHtml = getAltairHtml();
  const initialOptions = renderInitSnippet(options);
  const baseURL = options.baseURL || "./";
  if (options.serveInitialOptionsInSeperateRequest) {
    if (!options.cspNonce) {
      const scriptName = typeof options.serveInitialOptionsInSeperateRequest === "string" ? options.serveInitialOptionsInSeperateRequest : "initial_options.js";
      return altairHtml.replace(/<base.*>/, `<base href="${baseURL}">`).replace("<style>", `<style nonce="${(_a = options.cspNonce) != null ? _a : ""}">`).replace(
        "</body>",
        () => {
          var _a2;
          return `<script type="module" nonce="${(_a2 = options.cspNonce) != null ? _a2 : ""}" src="${scriptName.replace(/["'<>=]/g, "")}"><\/script></body>`;
        }
      );
    }
  }
  return altairHtml.replace(/<base.*>/, `<base href="${baseURL}">`).replace("<style>", `<style nonce="${(_b = options.cspNonce) != null ? _b : ""}">`).replace(
    "</body>",
    () => {
      var _a2;
      return `<script type="module" nonce="${(_a2 = options.cspNonce) != null ? _a2 : ""}">${initialOptions}<\/script></body>`;
    }
  );
};
var getRenderedAltairOpts = (renderOptions) => {
  const optProps = Object.keys(renderOptions).filter(
    (key) => allowedProperties.includes(key)
  ).map((key) => getObjectPropertyForOption(renderOptions[key], key));
  return ["{", ...optProps, "}"].join("\n");
};
var isSandboxFrame = (path) => {
  return path.split("/").includes("iframe-sandbox");
};
var src_default = renderAltair;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAltairHtml,
  getDistDirectory,
  isSandboxFrame,
  renderAltair,
  renderInitSnippet,
  renderInitialOptions
});
