import {obsConnectionService} from '__services/obsConnectionService';
import {updateService} from '__services/updateService';

export function onLoad() {
    void obsConnectionService.start();

    updateService.start();
}

export function onDispose() {
    obsConnectionService.stop();

    updateService.stop();
}
