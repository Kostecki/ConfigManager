import MonacoEditor, { loader, OnMount } from "@monaco-editor/react";

const Editor = (props: { value: string; handleEditorDidMount: OnMount }) => {
  loader
    .init()
    .then((monaco) => {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: "http://myserver/foo-schema.json", // id of the first schema
            fileMatch: ["*"], // associate with our model
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  label: {
                    type: "string",
                  },
                  key: {
                    type: "string",
                  },
                  value: {
                    type: ["string", "integer"],
                  },
                  category: {
                    type: "integer",
                  },
                  enabled: {
                    type: "boolean",
                  },
                },
                required: ["label", "key", "value", "category", "enabled"],
              },
            },
          },
        ],
      });
    })
    .catch((error) =>
      console.error(
        "An error occurred during initialization of Monaco: ",
        error
      )
    );

  return (
    <MonacoEditor
      height="50vh"
      value={props.value}
      language="json"
      options={{
        minimap: { enabled: false },
      }}
      onMount={props.handleEditorDidMount}
    />
  );
};

export default Editor;
