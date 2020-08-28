import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { IPatientRecord } from 'src/app/shared/interfaces';
import { PatientRecordService } from 'src/app/shared/patient-record.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    allPatients: Observable<IPatientRecord[]>;
    constructor(private prs: PatientRecordService, private as: AuthService) {}

    ngOnInit(): void {
        this.allPatients = this.as.currentUser.pipe(
            map((user) => user.uid),
            switchMap((uid) => this.prs.getAllPatientRecordsForUser(uid)),
            tap(console.log)
        );
    }
}
