import { json5Schema } from "codemirror-json-schema/json5";

export const gqlVariables = () => {
  return [
    // start with an empty schema
    json5Schema({
      type: 'object',
      properties: {},
    })
  ];
};
