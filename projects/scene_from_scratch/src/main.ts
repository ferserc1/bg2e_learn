import Canvas from "bg2e-js/ts/app/Canvas.ts";
import MainLoop, { FrameUpdate } from "bg2e-js/ts/app/MainLoop.ts";
import SceneAppController from "bg2e-js/ts/render/SceneAppController.ts";
import WebGLRenderer from "bg2e-js/ts/render/webgl/Renderer.js";
import Loader, { registerLoaderPlugin  } from "bg2e-js/ts/db/Loader.ts";
import VitscnjLoaderPlugin from "bg2e-js/ts/db/VitscnjLoaderPlugin.ts";
import { registerComponents } from "bg2e-js/ts/scene/index.ts";
import Camera, { OpticalProjectionStrategy } from "bg2e-js/ts/scene/Camera.ts";
import OrbitCameraController from "bg2e-js/ts/scene/OrbitCameraController.ts";
import SmoothOrbitCameraController from "bg2e-js/ts/scene/SmoothOrbitCameraController.ts";

class MyAppController extends SceneAppController {
  async loadScene() {

    
    this.updateOnInputEvents = true;
    this.updateInputEventsFrameCount = 120;
    return await super.loadScene();
  }
}

window.onload = async () => {
  const canvasElem = document.getElementById("app") as HTMLCanvasElement;
  if (!canvasElem) {
    console.error("Canvas element not found");
    return;
  }

  const canvas = new Canvas(canvasElem, new WebGLRenderer());
  const appController = new MyAppController();
  const mainLoop = new MainLoop(canvas, appController);
  mainLoop.updateMode = FrameUpdate.MANUAL;
  await mainLoop.run();
}
