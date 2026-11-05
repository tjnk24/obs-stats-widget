import {journalService} from '__services/journal/journalService';
import {obsConnectionService} from '__services/obsConnectionService';
import {updateService} from '__services/updateService';

export function onLoad() {
    journalService.start();

    void obsConnectionService.start();

    updateService.start();
}

export function onDispose() {
    obsConnectionService.stop();

    updateService.stop();

    journalService.stop();
}
