import {
    describe,
    expect,
    it,
} from 'vitest';

import {ConnectionStatusEnum} from '__types/connection/ConnectionStatusEnum';
import {JournalLevelEnum} from '__types/journal';
import {HealthLevelEnum} from '__types/stats/views';
import {UpdateStageEnum} from '__types/update/bridgeUpdate';

import {describeJournalChanges} from '../describeJournalChanges';

import {OUTPUT, SNAPSHOT} from './consts';

const {Info, Warn, Error: ErrorLevel} = JournalLevelEnum;

describe('describeJournalChanges', () => {
    it('writes nothing when nothing changed', () => {
        expect(describeJournalChanges(SNAPSHOT, {...SNAPSHOT})).toEqual([]);
    });

    it('writes a lost connection with its close code', () => {
        expect(describeJournalChanges(SNAPSHOT, {...SNAPSHOT, status: ConnectionStatusEnum.Closed, lastCloseCode: 1006})).toEqual([{
            level: Warn,
            source: 'obs',
            message: `connection ${ConnectionStatusEnum.Identified} -> ${ConnectionStatusEnum.Closed} code=1006`,
        }]);
    });

    it('writes when the bridge goes missing, but not when it comes back to missing state unchanged', () => {
        const missing = {...SNAPSHOT, isBridgeMissing: true, bridgeVersion: null};

        expect(describeJournalChanges(SNAPSHOT, missing).map(({level}) => level)).toEqual([Warn]);
        expect(describeJournalChanges(missing, missing)).toEqual([]);
    });

    it('writes a failed update as an error', () => {
        const [entry] = describeJournalChanges(SNAPSHOT, {
            ...SNAPSHOT,
            updateStage: UpdateStageEnum.Failed,
            updateVersion: '2.0.0',
            updateError: 'signature',
        });

        expect(entry).toEqual({level: ErrorLevel, source: 'panel', message: 'update stage=failed version=2.0.0 error=signature'});
    });

    it('writes a rollback as a warning', () => {
        expect(describeJournalChanges(SNAPSHOT, {...SNAPSHOT, rolledBackVersion: '2.0.0'})).toEqual([{
            level: Warn,
            source: 'panel',
            message: 'rolled back version=2.0.0',
        }]);
    });

    it('writes the health of an output with the dropped frames', () => {
        const unstable = {...OUTPUT, level: HealthLevelEnum.Warn, recentDropped: 40};

        expect(describeJournalChanges(SNAPSHOT, {...SNAPSHOT, outputs: [unstable]})).toEqual([{
            level: Warn,
            source: 'Twitch',
            message: 'status ok -> warn dropped_1m=40',
        }]);

        expect(describeJournalChanges({...SNAPSHOT, outputs: [unstable]}, SNAPSHOT).map(({level}) => level)).toEqual([Info]);
    });

    it('writes reconnecting and the end of a stream', () => {
        expect(describeJournalChanges(SNAPSHOT, {...SNAPSHOT, outputs: [{...OUTPUT, isReconnecting: true}]})[0].message).toBe('reconnecting');
        expect(describeJournalChanges(SNAPSHOT, {...SNAPSHOT, outputs: [{...OUTPUT, isActive: false, level: HealthLevelEnum.Off}]})[0].message).toBe('stream stopped');
    });

    it('writes the settings the user changed', () => {
        expect(describeJournalChanges(SNAPSHOT, {...SNAPSHOT, isAutoUpdateEnabled: false})).toEqual([{
            level: Info,
            source: 'user',
            message: 'changed auto_update=false',
        }]);
    });
});
