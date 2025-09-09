import { mxnTrackCountAcrossScenes } from "./mxn-track-count-across-scenes";

export const mxnHudModifiers = {
    mxnHideStatus: mxnTrackCountAcrossScenes.create(Symbol("mxnHideStatus")),
    mxnExperienceIndicatorToLeft: mxnTrackCountAcrossScenes.create(Symbol("mxnExperienceIndicatorToLeft")),
};
