import Component from "bg2e-js/ts/scene/Component.ts";
import Bg2KeyboardEvent, { SpecialKey } from "bg2e-js/ts/app/Bg2KeyboardEvent.ts";

export default class RotateComponent extends Component {
    private _animation: boolean = false;

    constructor() {
        super("RotateComponent");
    }

    willUpdate(delta: number) : void {
        if (this.transform && this._animation) {
            this.transform.matrix.rotate(delta * 0.002, 0, 1, 0);
            const numFrames = 10;
            this.node!.postRedisplayFrames = this.node!.postRedisplayFrames < numFrames ? this.node!.postRedisplayFrames + 1 : numFrames;
        }
    }

    keyUp(event: Bg2KeyboardEvent) : void {
        if (event.key === SpecialKey.SPACE) {
            this._animation = !this._animation;
        }
    }
}
