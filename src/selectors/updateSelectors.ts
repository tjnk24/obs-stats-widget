import {BaseStore} from '__reducers';

export const updateLatestSelector = (state: BaseStore) => state.update.latest;

export const updateBridgeSelector = (state: BaseStore) => state.update.bridge;

export const updateIsObsBusySelector = (state: BaseStore) => state.update.isObsBusy;

export const updateRequestedVersionSelector = (state: BaseStore) => state.update.requestedVersion;
