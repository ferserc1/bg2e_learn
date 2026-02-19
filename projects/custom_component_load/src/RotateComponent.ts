import Component from "bg2e-js/ts/scene/Component.ts";
import Bg2KeyboardEvent, { SpecialKey } from "bg2e-js/ts/app/Bg2KeyboardEvent.ts";
import type Loader from "bg2e-js/ts/db/Loader.js";

export default class RotateComponent extends Component {
    private _animation: boolean = false;
    private _speed: number = 1;

    constructor() {
        super("RotateComponent");
    }

    assign(other: Component): void {
        if (other instanceof RotateComponent) {
            this._animation = other._animation;
            this._speed = other._speed;
        }
    }

    clone(): Component {
        const newComponent = new RotateComponent();
        newComponent.assign(this);
        return newComponent;
    }

    async deserialize(sceneData: any, _: Loader): Promise<void> {
        if (sceneData.animation !== undefined && typeof sceneData.animation === "boolean") {
            this._animation = sceneData.animation;
        }
        if (sceneData.speed !== undefined && typeof sceneData.speed === "number") {
            this._speed = sceneData.speed;
        }
    }

    // Getters y setters para animación y velocidad
    get animation() {
        return this._animation;
    }

    set animation(value: boolean) {
        this._animation = value;
    }

    get speed() {
        return this._speed;
    }

    set speed(value: number) {
        this._speed = value;
    }

    willUpdate(delta: number) : void {
        if (this.transform && this._animation) {
            // Multiplicamos por la velocidad
            this.transform.matrix.rotate(delta * 0.002 * this._speed, 0, 1, 0);
            const numFrames = 10;
            this.node!.postRedisplayFrames = this.node!.postRedisplayFrames < numFrames
                ? numFrames
                : this.node!.postRedisplayFrames;
        }
    }

    keyUp(event: Bg2KeyboardEvent) : void {
        if (event.key === SpecialKey.SPACE) {
            this._animation = !this._animation;
        }
    }
}
