import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-pdf-upload',
  standalone: true,
  imports: [CommonModule, FormsModule,ToastComponent],
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.css']
})
export class PdfUploadComponent {
  selectedFile: File | null = null;
  uploadStatus: string = '';
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.uploadStatus = 'Please select a valid PDF file.';
    }
  }

  onUpload() {
    if (!this.selectedFile) {
      this.uploadStatus = 'No file selected.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:8000/upload-pdf', formData).subscribe({
      next: (res) => {
        this.uploadStatus = 'Upload successful!';
        this.toastMessage = `Upload successful! ${(res as any)?.file_id}`;
        this.toastType = 'success';
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000); // Auto-hide after 3s
      },
      error: (err) => {
        this.uploadStatus = 'Upload failed.';
        this.toastMessage = 'Upload file failed!';
        this.toastType = 'error';
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);
        console.error(err);

      }
    });
  }
}
