import { Excalidraw } from "@excalidraw/excalidraw";

import {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
  UIOptions,
} from "@excalidraw/excalidraw/types/types";
import { useEffect, useState } from "react";

const initialExcalidrawState: ExcalidrawInitialDataState = {
  appState: {
    viewBackgroundColor: "#ffffff00",
  },
};

const excalidrawUIOptions: Partial<UIOptions> = {
  canvasActions: {
    changeViewBackgroundColor: false,
    toggleTheme: false,
  },
};

type ExcalidrawWrapperProps = {
  onCanvasChange: (arg0: { x: number; y: number; zoom: number }) => void;
};

const ExcalidrawWrapper = ({ onCanvasChange }: ExcalidrawWrapperProps) => {
  const [excalidrawApi, setExcalidrawApi] = useState<ExcalidrawImperativeAPI>();

  console.log("Rendering Excalidraw");
  useEffect(() => {
    console.log("Excalidraw API useEffect");
    if (!excalidrawApi) {
      return;
    }
    excalidrawApi.onChange((_, appState) => {
      onCanvasChange({
        x: appState.scrollX,
        y: appState.scrollY,
        zoom: appState.zoom.value,
      });
    });
  }, [excalidrawApi, onCanvasChange]);
  return (
    <Excalidraw
      initialData={initialExcalidrawState}
      UIOptions={excalidrawUIOptions}
      zenModeEnabled={true}
      excalidrawAPI={(excalidrawApi) => setExcalidrawApi(excalidrawApi)}
    ></Excalidraw>
  );
};

export default ExcalidrawWrapper;
