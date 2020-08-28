import { Injectable } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/database';
import { of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { IPatientRecord } from './interfaces';

@Injectable({
    providedIn: 'root',
})
export class PatientRecordService {
    constructor(private afd: AngularFireDatabase) {}

    addNewPatientRecord(patientRecord: Partial<IPatientRecord>, uid: string) {
        console.log('Service Called');
        const updatedPatientRecord = this._setAuditField(
            patientRecord,
            uid,
            true
        );
        console.log(updatedPatientRecord);
        return this.afd.list('patients').push(updatedPatientRecord);
    }

    getAllPatientRecordsForUser(userId: string) {
        return this.afd
            .list('patients', (ref) =>
                ref.orderByChild('createdBy').equalTo(userId)
            )
            .snapshotChanges()
            .pipe(
                map((val: SnapshotAction<IPatientRecord>[]) => {
                    return val.map((action: SnapshotAction<IPatientRecord>) => {
                        const $key = action.payload.key;
                        return { $key, ...action.payload.val() };
                    });
                }),
                catchError((err) => {
                    console.log(err);
                    return of([]);
                }),
                shareReplay()
            );
    }

    updatePatientRecord(
        patientId: string,
        patientRecord: Partial<IPatientRecord>,
        uid: string
    ) {}

    deletePatientRecord(patientId: string, uid: string) {
        // Special handling needed
    }

    getPatientById(patientId: string, userId: string) {}

    _setAuditField(
        patientRecord: Partial<IPatientRecord>,
        uid: string,
        create: boolean = false
    ) {
        if (create) {
            patientRecord.ts = new Date().getTime();
            patientRecord.createdBy = uid;
        }
        patientRecord.updatedTs = new Date().getTime();
        patientRecord.updatedBy = uid;
        return patientRecord;
    }
}
