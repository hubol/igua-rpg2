import { Container } from "pixi.js";
import { setEngineConfig } from "../../src/lib/game-engine/engine-config";
import { Instances } from "../../src/lib/game-engine/instances";
import { SceneStack } from "../../src/lib/game-engine/scene-stack";
import { range } from "../../src/lib/range";
import { Assert } from "../lib/assert";

function objTest() {
    return new Container().track(objTest);
}

function objTest2() {
    return objTest().track(objTest2);
}

class TestSceneStack extends SceneStack<{}, {}> {
    protected convert<T>(populateSceneFn: () => T, meta: {}): { populateScene(): T } {
        return {
            populateScene: populateSceneFn,
        };
    }
    protected dispose(scene: {}): void {
    }
    protected onScenesModified(): void {
    }
}

function configureEngine() {
    const sceneStack = new TestSceneStack();
    setEngineConfig({
        renderer: null as any,
        sceneStack,
        showDefaultStage: new Container(),
    });
    sceneStack.push(() => ({}), {});
}

export function trackedInstancesAppearInArrayOnceShown() {
    configureEngine();
    const testObj = objTest();
    Assert(Instances(objTest).length).toStrictlyBe(0);
    testObj.show();
    Assert(Instances(objTest).length).toStrictlyBe(1);
    Assert(Instances(objTest)[0]).toStrictlyBe(testObj);
}

export function trackedInstancesRemovedWhenDestroyed() {
    configureEngine();
    const testObjs = range(10).map(() => objTest().show());
    Assert(Instances(objTest).length).toStrictlyBe(10);
    for (let i = 0; i < testObjs.length; i++) {
        if (i !== 5) {
            testObjs[i].destroy();
        }
    }
    Assert(Instances(objTest).length).toStrictlyBe(1);
    Assert(Instances(objTest)[0]).toStrictlyBe(testObjs[5]);
}

export function trackedInstancesBehaveAsExpectedWithMultipleTrackCalls() {
    configureEngine();
    const test2Obj = objTest2().show();

    Assert(Instances(objTest).length).toStrictlyBe(1);
    Assert(Instances(objTest2).length).toStrictlyBe(1);

    Assert(Instances(objTest)[0]).toStrictlyBe(test2Obj);
    Assert(Instances(objTest2)[0]).toStrictlyBe(test2Obj);

    test2Obj.destroy();

    Assert(Instances(objTest).length).toStrictlyBe(0);
    Assert(Instances(objTest2).length).toStrictlyBe(0);
}
