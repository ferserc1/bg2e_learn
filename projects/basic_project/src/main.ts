import Canvas from "bg2e-js/ts/app/Canvas.ts";
import MainLoop, { FrameUpdate } from "bg2e-js/ts/app/MainLoop.ts";
import SceneAppController from "bg2e-js/ts/render/SceneAppController.ts";
import WebGLRenderer from "bg2e-js/ts/render/webgl/Renderer.js";
import Loader, { registerLoaderPlugin  } from "bg2e-js/ts/db/Loader.ts";
import VitscnjLoaderPlugin from "bg2e-js/ts/db/VitscnjLoaderPlugin.ts";
import Camera, { OpticalProjectionStrategy } from "bg2e-js/ts/scene/Camera.ts";
import OrbitCameraController from "bg2e-js/ts/scene/OrbitCameraController.ts";
import SmoothOrbitCameraController from "bg2e-js/ts/scene/SmoothOrbitCameraController.ts";

class MyAppController extends SceneAppController {
  async loadScene() {

    registerLoaderPlugin(new VitscnjLoaderPlugin({
      bg2ioPath: 'bg2e/'
    }));

    const loader = new Loader();
    const sceneRoot = await loader.loadNode("/test-scene/test-scene.vitscnj");

    const mainCamera = Camera.GetMain(sceneRoot);
    if (mainCamera) {
      const strategy = new OpticalProjectionStrategy();
      strategy.focalLength = 55;
      strategy.frameSize = 35;
      mainCamera.projectionStrategy = strategy;

      const cameraNode = mainCamera.node!;
      const orbitController = cameraNode.component("OrbitCameraController") as OrbitCameraController;
      const smoothController = new SmoothOrbitCameraController();
      if (orbitController) {
        cameraNode.removeComponent("OrbitCameraController");
        smoothController.assign(orbitController as SmoothOrbitCameraController);
      }
      else {
        smoothController.distance = 15;
        smoothController.rotation.x = 20;
        smoothController.rotation.y = 45;
      }
      cameraNode.addComponent(smoothController);

      this.mainLoop.postRedisplay();
    }

    this.updateOnInputEvents = true;
    this.updateInputEventsFrameCount = 120;
    return sceneRoot;
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
