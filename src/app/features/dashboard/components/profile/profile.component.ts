import { ChangeDetectionStrategy, ChangeDetectorRef,Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, switchMap } from 'rxjs/operators';
import { IGallery } from 'src/app/models/gallery.model';
import { SnackService } from 'src/app/services/snack/snack.service';

import { AuthService } from './../../../../services/auth/auth.service';
import { FirestorageService } from './../../../../services/firestorage/firestorage.service';
import { FirestoreService } from './../../../../services/firestore/firestore.service';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  userId: string;
  currentUserId: string;
  userName: string;
  headerInfo: string;
  about: string;
  galleryLength: number;
  latestImage: IGallery;
  favoriteImage: IGallery;
  isSaveing = false;
  latestImageNotFound = false;
  favoriteImageNotFound = false;
  editTextarea = false;

  @ViewChild('textareaInfo') textarea: ElementRef;

  constructor(
    private firestore: FirestoreService,
    private firestorage: FirestorageService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snack: SnackService,
  ) { }

  ngOnInit(): void {
    this.userId = this.getUserId();
    this.getUserInfoById();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.getGalleryLength();
    this.getLatestImageUrl();
    this.getFavoriteImageUrl();
  }

  onGalleryClick(): void {
    this.router.navigate(['dashboard/gallery', this.userId !== this.currentUserId ? { id: this.userId } : {}]);
  }

  onImgLoaded(image: IGallery): void {
    image.isLoaded = true;
  }

  onEditClick(): void {
    this.editTextarea = true;
    const value = this.textarea.nativeElement.value;
    this.textarea.nativeElement.focus();
    this.textarea.nativeElement.setSelectionRange(value.length, value.length);
  }

  onSaveClick(): void {
    this.isSaveing = true;
    const value = this.textarea.nativeElement.value;
    this.firestore.updateDocument(`users/${this.userId}`, { about: value }).
      pipe(untilDestroyed(this)).subscribe(() => {
        this.isSaveing = false;
        this.editTextarea = false;
        this.snack.open('Pomyślnie zapisano zmiany');
        this.cdr.markForCheck();
      });
  }

  private getLatestImageUrl(): void {
    this.firestore.getOrderedCollection(`users/${this.userId}/gallery`, 'date', 'desc')
      .pipe(map(collection => collection.docs.map(doc => doc.data())[0].fileId),
        switchMap(imgUrl => this.firestorage.getFileUrl(`${this.userId}/${imgUrl}`))).
      pipe(untilDestroyed(this)).subscribe({
        next: (url) => {
          this.latestImage = {
            url,
            isLoaded: false,
          };
          this.cdr.markForCheck();
        },
        error: () => {
          this.latestImageNotFound = true;
          this.cdr.markForCheck();
        },
      });
  }

  private getFavoriteImageUrl(): void {
    this.firestore.getDocument(`users/${this.userId}/favorite/favorite`).
      pipe(switchMap((doc) => this.firestorage.getFileUrl(`${this.userId}/${doc.data().fileId}`))).
      pipe(untilDestroyed(this)).subscribe({
        next: (url) => {
          this.favoriteImage = {
            url,
            isLoaded: false,
          };
          this.cdr.markForCheck();
        },
        error: () => {
          this.favoriteImageNotFound = true;
          this.cdr.markForCheck();
        },
      });
  }

  private getGalleryLength(): void {
    this.firestore.getCollection(`users/${this.userId}/gallery`).
      pipe(map(collection => collection.docs.length)).
      pipe(untilDestroyed(this)).subscribe(docLength => {
        this.galleryLength = docLength;
        this.cdr.markForCheck();
      });
  }

  private getUserId(): string {
    this.currentUserId = this.auth.getCurrentUserId();
    return this.route.snapshot.paramMap.get('id') ?? this.currentUserId;
  }

  private getUserInfoById(): void {
    this.firestore.getDocument(`users/${this.userId}`).
      pipe(untilDestroyed(this)).subscribe(doc => {
        this.userName = doc.data().displayName;
        this.about = doc.data()?.about;
        this.prepareHeaderInfo();
        this.cdr.markForCheck();
      });
  }

  private prepareHeaderInfo(): void {
    this.headerInfo = this.userId !== this.currentUserId ?
      `Witaj na profilu użytkownika ${this.userName}` : `${this.userName} witaj na Twoim profilu`;
  }
}
