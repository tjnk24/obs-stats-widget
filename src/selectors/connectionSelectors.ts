import {BaseStore} from '__reducers';

export const connectionSelector = (state: BaseStore) => state.connection;

export const connectionStatusSelector = (state: BaseStore) => state.connection.status;
