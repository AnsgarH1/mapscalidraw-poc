import { memo, useCallback, useRef, useState } from "react";

import { Map, ViewState } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import ExcalidrawWrapper from "./components/Excalidraw";

type MapView = Pick<ViewState, "latitude" | "longitude" | "zoom">;

const initialMapViewState: MapView = {
  latitude: 50.08,
  longitude: 8.237,
  zoom: 14,
};

const MemoizedExcalidrawWrapper = memo(ExcalidrawWrapper);

type CanvasView = {
  x: number;
  y: number;
  zoom: number;
};

const calculateNewMapView = (
  currentMapView: MapView,
  newCanvasView: CanvasView
): MapView => {
  const COORDS_RATE = 0.00005;
  const ZOOM_RATE = 1;
  return {
    longitude: currentMapView.longitude - newCanvasView.x * COORDS_RATE,
    latitude: currentMapView.latitude + newCanvasView.y * COORDS_RATE,
    zoom: initialMapViewState.zoom * newCanvasView.zoom * ZOOM_RATE,
  };
};

function App() {
  const [mapViewState, setMapViewState] =
    useState<MapView>(initialMapViewState);
  const canvasView = useRef<CanvasView>({ x: 0, y: 0, zoom: 1 });

  const handleCanvasChange = useCallback((newCanvasView: CanvasView) => {
    canvasView.current = newCanvasView;
    const newMapViewState = calculateNewMapView(mapViewState, newCanvasView);

    setMapViewState(newMapViewState);
  }, []);

  return (
    <div className="w-screen h-screen">
      <h1 className="text-2xl bg-red-500 absolute z-60">
        Excalidraw + Maplibre Proof of Concept - Pre Alpha -{" "}
        <a
          className="underline"
          target="_blank"
          href="https://github.com/AnsgarH1/mapscalidraw-poc"
        >
          GitHub
        </a>
      </h1>
      <div className="absolute top-0 left-0 w-full h-full  z-20">
        <MemoizedExcalidrawWrapper onCanvasChange={handleCanvasChange} />
      </div>
      <div className="absolute bottom-0 right-0 bg-gray-50 opacity-70  z-40">
        <p>
          Canvas: x: {canvasView.current.x}, y: {canvasView.current.y}, zoom:{" "}
          {canvasView.current.zoom}
        </p>
        <p>
          Map: lat: {mapViewState.latitude}, lon: {mapViewState.longitude},
          zoom: {mapViewState.zoom}
        </p>
      </div>
      <div className=" w-full h-full bg-blue-950 z-10 custom-styles">
        <Map
          {...mapViewState}
          initialViewState={initialMapViewState}
          onMove={(viewStateEvent) => {
            setMapViewState(viewStateEvent.viewState);
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://tiles.openfreemap.org/styles/positron"
        />
      </div>
    </div>
  );
}

export default App;
