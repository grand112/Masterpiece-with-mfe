import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { IUserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth/auth.service';

import { FirestoreService } from './../../../../services/firestore/firestore.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  users$: Observable<IUserData[]>;

  private userId = this.auth.getCurrentUserId();

  constructor(
    private firestore: FirestoreService,
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.users$ = this.getUsersList();
  }

  onGalleryClick(id: string): void {
    this.router.navigate(['dashboard/gallery', { id }]);
  }

  onProfileClick(id: string): void {
    this.router.navigate(['dashboard/profile', { id }]);
  }

  private getUsersList(): Observable<IUserData[]> {
    return this.firestore.getCollection('users').pipe(map(collection => {
      const usersList: IUserData[] = [];
      collection.docs.forEach(doc => {
        usersList.push({
          email: doc.data().email,
          displayName: doc.data().displayName,
          userId: doc.data().userId,
        });
      });
      return usersList;
    }),map(users => users.filter(user => user.userId !== this.userId)));
  }
}
