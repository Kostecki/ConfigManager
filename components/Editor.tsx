import { useState, useRef } from "react";
import MonacoEditor, { loader, OnMount } from "@monaco-editor/react";

import {
  MonacoEditor as IMonacoEditor,
  Monaco as IMonaco,
} from "monaco-editor";

const Editor = (props: {
  value: string;
  handleEditorDidMount: OnMount;
  isLoading: boolean;
}) => {
  const { value, handleEditorDidMount, isLoading } = props;

  const [firstLoad, setFirstLoad] = useState(true);
  let editorRef = useRef<IMonacoEditor>();

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
                  enabled: {
                    type: "boolean",
                  },
                  projectId: {
                    type: "number",
                  },
                },
                required: ["label", "key", "value", "enabled", "projectId"],
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

  const onMountHandler = (editor: IMonacoEditor, monaco: IMonaco) => {
    editorRef.current = editor;
    handleEditorDidMount(editor, monaco);
  };

  const onChangeHandler = () => {
    if (firstLoad) {
      setFirstLoad(false);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.getAction("editor.action.formatDocument")?.run();
        }
      }, 100);
    }
  };

  return (
    <MonacoEditor
      loading={isLoading}
      height="50vh"
      value={value}
      language="json"
      options={{
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
      }}
      onMount={onMountHandler}
      onChange={onChangeHandler}
    />
  );
};

export default Editor;
