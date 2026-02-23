import { useState } from 'react'
import MyAppController from './AppController.ts'
import WebGLRenderer from 'bg2e-js/ts/render/webgl/Renderer.ts'
import './App.css'
import useBg2e from "bg2e-js/ts/react/useBg2e.ts";
import type Canvas from 'bg2e-js/ts/app/Canvas.ts'
import type MainLoop from 'bg2e-js/ts/app/MainLoop.ts'
import { FrameUpdate } from 'bg2e-js/ts/app/MainLoop.ts'
import { type SelectionChangedData } from 'bg2e-js/ts/manipulation/SelectionManager.ts';
import SelectionMode from 'bg2e-js/ts/manipulation/SelectionMode.ts';

export default function App() {
  const [selection, setSelection] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(SelectionMode.POLY_LIST);
  const [selectionEnabled, setSelectionEnabled] = useState<boolean>(true);
  const [multiSelect, setMultiSelect] = useState<boolean>(false);

  const { mainLoop } = useBg2e(
    "#bg2eCanvas",
    WebGLRenderer,
    MyAppController,
    (_: Canvas, mainLoop: MainLoop) => {
      mainLoop.updateMode = FrameUpdate.MANUAL;
      const appCtrl = mainLoop.appController as MyAppController;
      appCtrl.selectionManager?.onSelectionChanged("reactSelectionCallback", (selectedItems: SelectionChangedData[]) => {
        setSelection(() => selectedItems.map(item => item.drawable.node.name));
      });
    }
  );

  const handleClearSelection = () => {
    const appController = mainLoop?.appController as MyAppController;
    appController.selectionManager?.clearSelection();
  }

  const handleSelectionModeSwitch = () => {
    const appController = mainLoop?.appController as MyAppController;
    const newMode = selectionMode === SelectionMode.POLY_LIST
      ? SelectionMode.OBJECT
      : SelectionMode.POLY_LIST;

    setSelectionMode(newMode);
    appController?.selectionManager?.setSelectionMode(newMode);
  }

  const handleSelectionToggle = () => {
    const appController = mainLoop?.appController as MyAppController;
    setSelectionEnabled(prev => {
      if (prev) {
        appController.selectionManager?.disable();
      }
      else {
        appController.selectionManager?.enable();
      }
      return !prev;
    })
  }

  const handleMultiSelectChange = () => {
    const appController = mainLoop?.appController as MyAppController;
    if (appController && appController.selectionManager) {
      appController.selectionManager.setMultiSelectMode(!multiSelect);
    }
    setMultiSelect(prev => !prev);
  }
 
  return (
    <>
      <div className="ui">
        <h1>Selection:</h1>
        <ul>
          {selection.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <div className="buttons">
          { selection.length > 0 && <button onClick={handleClearSelection}>Clear Selection</button> }
          <button onClick={handleSelectionModeSwitch}>
            Switch Mode: {selectionMode === SelectionMode.POLY_LIST ? "Poly List" : "Object"}
          </button>
          <button onClick={handleSelectionToggle}>{ selectionEnabled ? "Disable" : "Enable" } Selection</button>
          <button onClick={handleMultiSelectChange}>{ multiSelect ? "Multi Select" : "Single Select" }</button>
        </div>
      </div>
    </>
  )
}
