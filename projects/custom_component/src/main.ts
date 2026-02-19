import Canvas from "bg2e-js/ts/app/Canvas.ts";
import MainLoop, { FrameUpdate } from "bg2e-js/ts/app/MainLoop.ts";
import SceneAppController from "bg2e-js/ts/render/SceneAppController.ts";
import WebGLRenderer from "bg2e-js/ts/render/webgl/Renderer.ts";
import Camera, { OpticalProjectionStrategy } from "bg2e-js/ts/scene/Camera.ts";
import SmoothOrbitCameraController from "bg2e-js/ts/scene/SmoothOrbitCameraController.ts";
import Node from "bg2e-js/ts/scene/Node.ts";
import Transform from "bg2e-js/ts/scene/Transform.js";
import Drawable from "bg2e-js/ts/scene/Drawable.js";
import Mat4 from "bg2e-js/ts/math/Mat4.ts";
import { createSphere, createPlane } from "bg2e-js/ts/primitives/index.ts";
import Material from "bg2e-js/ts/base/Material.ts";
import Color from "bg2e-js/ts/base/Color.js";
import Light from "bg2e-js/ts/base/Light.js";
import LightComponent from "bg2e-js/ts/scene/LightComponent.js";
import Texture from "bg2e-js/ts/base/Texture.js";
import Vec from "bg2e-js/ts/math/Vec.js";
import EnvironmentComponent from "bg2e-js/ts/scene/EnvironmentComponent.js";
import type PolyList from "bg2e-js/ts/base/PolyList.js";
import FindNodeVisitor from "bg2e-js/ts/scene/FindNodeVisitor.js";
import RotateComponent from "./RotateComponent";

class MyAppController extends SceneAppController {
  private _spherePlist: PolyList | null = null;

  private async createSphereNode({
    name,
    roughness,
    metalness,
    albedo = new Color([0.85, 0, 0, 1]),
    albedoTexture,
    normalTexture,
    position = [0, 0, 0]
  } : {
    name: string,
    roughness: number,
    metalness: number,
    albedo?: Color,
    albedoTexture?: string,
    normalTexture?: string,
    position: number[]
  }) : Promise<Node> {
    // Nuevo nodo para posicionar la esfera en la escena
    const spherePosition = new Node(name + "_Position");
    // La traslación la colocamos en este nodo
    spherePosition.addComponent(new Transform(Mat4.MakeTranslation(position[0], position[1], position[2])));

    const sphereNode = new Node(name);
    this._spherePlist = this._spherePlist || createSphere(0.2);
    sphereNode.addComponent(new Drawable())
    sphereNode.drawable?.addPolyList(this._spherePlist, await Material.Deserialize({
      albedo, roughness, metalness, albedoTexture, normalTexture
    }), Mat4.MakeIdentity() );

    // Ahora añadimos la transformación de la esfera limpia, sin la traslación.
    sphereNode.addComponent(new Transform());
    // Añadimos el componente RotationComponent 
    sphereNode.addComponent(new RotateComponent());
    // Añadimos el nodo de la esfera como hijo del nodo de posición
    spherePosition.addChild(sphereNode);
    // Devolvemos el nodo de posición, que es el que realmente se añadirá a la escena
    return spherePosition;
  }

  async loadScene() {
    const sceneRoot = new Node("Scene Root");
    
    const sceneElements = new Node("Scene Elements");
    sceneRoot.addChild(sceneElements);
    
    const sphere = new Node("Sphere");
    sceneElements.addChild(sphere);
    sphere.addComponent(new Transform(Mat4.MakeTranslation(0, 1.0, 0)));

    const spherePlist = createSphere(0.5);
    const sphereDrawable = new Drawable();
    const material = new Material();
    material.albedo = new Color([0.1, 0.9, 0.2, 1]);
    const scale = new Vec(2, 2);
    material.albedoScale = scale;
    material.normalScale = scale;
    material.metalnessScale = scale;
    material.roughnessScale = scale;
    const albedoTexture = new Texture();
    albedoTexture.fileName = "/logo_transparent.png";
    const normalTexture = new Texture();
    normalTexture.fileName = "/logo_nm.png";
    const metalnessRoughnessTexture = new Texture();
    metalnessRoughnessTexture.fileName = "/logo_hm.png";
    await Promise.allSettled([
      albedoTexture.loadImageData(),
      normalTexture.loadImageData(),
      metalnessRoughnessTexture.loadImageData()
    ]);
    material.albedoTexture = albedoTexture;
    material.normalTexture = normalTexture;
    material.metalness = 1;
    material.metalnessTexture = metalnessRoughnessTexture;
    material.roughnessTexture = metalnessRoughnessTexture;

    
    sphereDrawable.addPolyList(spherePlist, material, Mat4.MakeIdentity());
    sphere.addComponent(sphereDrawable);

    const rows = 10;
    const cols = 10;
    const separation = 0.75;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const roughness = i / (rows - 1);
        const metalness = j / (cols - 1);
        sceneElements.addChild(await this.createSphereNode({
          name: `Sphere_${i}_${j}`,
          roughness,
          metalness,
          position: [(j - (cols - 1) / 2) * separation, 0.15, (i - (rows - 1) / 2) * separation],
          albedoTexture: "/vintage-tile1_albedo.jpeg",
          normalTexture: "/vintage-tile1_normal.jpeg"
        }));
      }
    }

    const floorNode = new Node("Floor");
    floorNode.addComponent(new Transform(Mat4.MakeTranslation(0, -0.5, 0)));
    const floorPlist = createPlane(10, 10);
    const floorDrawable = new Drawable();
    floorDrawable.addPolyList(floorPlist, new Material(), Mat4.MakeIdentity());
    floorNode.addComponent(floorDrawable);
    sceneElements.addChild(floorNode);


    const cameraNode = new Node("Camera");
    const camera = new Camera();
    camera.projectionStrategy = new OpticalProjectionStrategy();
    cameraNode.addComponent(camera);
    cameraNode.addComponent(new Transform());
    cameraNode.addComponent(new SmoothOrbitCameraController());
    sceneRoot.addChild(cameraNode);

    const lightNode = new Node("Light");
    const light = new Light();
    light.shadowBias = 0.00005;
    lightNode.addComponent(new LightComponent(light));
    lightNode.addComponent(new Transform(
      Mat4.MakeRotation(0.62, -0.5, 0.5, 0)
    ));
    sceneRoot.addChild(lightNode);

    const env = new EnvironmentComponent();
    env.equirectangularTexture = '/mirrored_hall_4k.png';
    env.showSkybox = true;
    sceneRoot.addComponent(env);

    this.updateOnInputEvents = true;
    this.updateInputEventsFrameCount = 120;

    const findVisitor = new FindNodeVisitor();
    findVisitor.name = /^Sphere_5_?/;
    findVisitor.hasComponents(["Drawable"]);

    sceneRoot.accept(findVisitor);
    findVisitor.result?.forEach(node => {
      const drw = node.component("Drawable")! as Drawable;
      drw.items[0].material.albedo = new Color([0, 1, 0, 1]);
    });

    findVisitor.clear();
    findVisitor.name = "Scene Elements";
    findVisitor.hasComponents([]);
    sceneRoot.accept(findVisitor);
    const positions = findVisitor.result?.map(node => {
      return Transform.GetWorldMatrix(node).translation;
    });
    console.log(positions);

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
