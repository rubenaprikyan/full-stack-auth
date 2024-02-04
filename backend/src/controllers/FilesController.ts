import S3Service from '../services/S3Service';
import { File } from '../modules/file-upload';

class FilesController {
  private storage: S3Service;

  constructor() {
    this.storage = new S3Service();
  }

  public async upload(files: File[]) {
    const uploadResult = await this.storage.uploadFiles(files, 'tmp');
    const result = files.map((file, index) => ({
      name: file.name,
      key: uploadResult[index].Key,
      mimeType: file.mime,
      size: file.size,
      id: file.id,
      location: uploadResult[index].Location,
    }));

    return result;
  }

  public copyObjects(files: string[]) {
    const objects = files.map(file => ({
      key: `profile-pictures/${file.split('/')[1]}`,
      source: `${file}`,
    }));

    return this.storage.copyObjects(objects);
  }
}

export default FilesController;
