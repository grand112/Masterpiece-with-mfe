import { ChangeDetectionStrategy, ChangeDetectorRef,Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ListResult } from 'firebase/storage';
import { forkJoin, Observable,of,switchMap } from 'rxjs';
import { IGallery } from 'src/app/models/gallery.model';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

import { AuthService } from './../../../../services/auth/auth.service';
import { FirestorageService } from './../../../../services/firestorage/firestorage.service';
import { SnackService } from './../../../../services/snack/snack.service';

@UntilDestroy()
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent implements OnInit {
  gallery: IGallery[] = [];
  selectedImage: IGallery;
  isLoading = false;
  isDeleting = false;
  isFavoriteLoading = false;
  isModalImgLoading = false;
  userId: string;
  currentUserId: string;
  userName: string;
  headerInfo: string;
  dialogRef: MatDialogRef<any>;

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

  constructor(
    private firestorage: FirestorageService,
    private firestore: FirestoreService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private snack: SnackService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.userId = this.getUserId();
    this.getGalleryUrls();
    this.getUserNameById();
  }

  onProfileClick(): void {
    this.router.navigate(['dashboard/profile', { id: this.userId }]);
  }

  openDialog(selectedImage: IGallery): void {
    this.isModalImgLoading = true;
    this.selectedImage = selectedImage;
    this.checkIfFavorite(selectedImage);
  }

  onModalImgLoaded(): void {
    this.isModalImgLoading = false;
  }

  onImgLoaded(image: IGallery): void {
    image.isLoaded = true;
  }

  onDeleteClick(imageName: string): void {
    this.isDeleting = true;
    forkJoin([ this.firestorage.deleteFile(`${this.userId}/${imageName}`),
      this.firestore.deleteDocument(`users/${this.userId}/gallery/${imageName}`)])
      .pipe(untilDestroyed(this)).subscribe(() => {
        this.gallery = this.gallery.filter(image => image.name !== imageName);
        this.snack.open('Pomyślnie usunięto obraz');
        this.isDeleting = false;
        this.dialogRef.close();
        this.cdr.markForCheck();
      });
  }

  onEditClick(imageName: string): void {
    this.router.navigate(['dashboard/editor', { id: imageName }]);
    this.dialogRef.close();
  }

  onFavoriteClick(image: IGallery): void {
    this.isFavoriteLoading = true;
    if (image.isFavorite) {
      this.firestore.deleteDocument(`users/${this.userId}/favorite/favorite`).
        pipe(untilDestroyed(this)).subscribe(() => {
          image.isFavorite = false;
          this.snack.open('Obraz nie jest już oznaczony jako ulubiony');
          this.isFavoriteLoading = false;
          this.cdr.markForCheck();
        });
    } else {
      this.firestore.setDocumentInCollection(`users/${this.userId}/favorite`, 'favorite', { fileId: image.name }).
        pipe(untilDestroyed(this)).subscribe(() => {
          image.isFavorite = true;
          this.snack.open('Obraz został oznaczony jako ulubiony');
          this.isFavoriteLoading = false;
          this.cdr.markForCheck();
        });
    }
  }

  private checkIfFavorite(image: IGallery): void {
    this.firestore.getDocument(`users/${this.userId}/favorite/favorite`).
      pipe(untilDestroyed(this)).subscribe(doc => {
        if (doc.data()?.fileId === image.name) {
          image.isFavorite = true;
        }
        this.dialogRef = this.dialog.open(this.dialogContent);
        this.cdr.markForCheck();
      });
  }

  private prepeareHeaderInfo(): void {
    this.headerInfo =  this.userId !== this.currentUserId ?
      (this.gallery.length ? `Arcydzieła użytkownika ${this.userName}` : `Użytkownik ${this.userName} nie ma jeszcze żadnego obrazu`) :
      (this.gallery.length ? 'Twoje arcydzieła' : 'Twoja galeria jest pusta');
  }

  private getUserNameById(): void {
    this.firestore.getDocument(`users/${this.userId}`).
      pipe(untilDestroyed(this)).subscribe(doc => this.userName = doc.data().displayName);
  }

  private getUserId(): string {
    this.currentUserId = this.auth.getCurrentUserId();
    return this.route.snapshot.paramMap.get('id') ?? this.currentUserId;
  }

  private getGalleryUrls(): void {
    this.isLoading = true;
    this.firestorage.getStorageFolder(this.userId).
      pipe(switchMap((listResult: ListResult) => {
        if (listResult.items.length) {
          const itemsDownloadUrls: Observable<string>[] = [];
          listResult.items.forEach(item => itemsDownloadUrls.push(this.firestorage.getFileUrl(item.fullPath)));
          return forkJoin(itemsDownloadUrls);
        }
        return of([]);
      })).pipe(untilDestroyed(this)).subscribe({
        next: (galleryUrls: string[]) => {
          galleryUrls.forEach(url => {
            const name = url.split('%2F')[1].split('?alt')[0];
            this.gallery.push({
              url,
              isLoaded: false,
              isFavorite: false,
              name,
            });
          });
          this.isLoading = false;
          this.prepeareHeaderInfo();
          this.cdr.markForCheck();
        },
        error: () => {
          const message = 'Nie udało się załadować galerii, spróbuj ponownie';
          this.snack.open(message);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }
}
