import { getDefaultLooks } from "../iguana/get-default-looks";

export const RpgProgress = {
    character: {
        status: {
            health: 50,
            invulnverable: 0,
            poison: {
                level: 0,
                value: 0,
            }
        },
        attributes: {
            health: 1,
            intelligence: 0,
        },
        looks: getDefaultLooks(),
        position: {
            sceneName: '',
            checkpointName: '',
        }
    }
}
