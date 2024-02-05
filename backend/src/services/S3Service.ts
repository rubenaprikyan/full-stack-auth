import AWS from 'aws-sdk';
import _omit from 'lodash/omit';

import { File } from 'modules/file-upload';

AWS.config.update({
  region: 'eu-west-2',
});

const Bucket = 'uploader-experimental';

export type CopyObject = {
  /**
   * the key of object
   */
  key: string;
  /**
   * the source of object
   */
  source: string;
};

class S3Service {
  private s3: AWS.S3;

  constructor(private bucket: string = Bucket) {
    this.s3 = new AWS.S3();
  }

  /**
   * send files to s3
   * @param files
   * @param folder
   */
  public uploadFiles(files: File[], folder: string) {
    const uploadPromises = files.map(async file => {
      const Metadata: unknown = _omit(file, ['binary', 'id']);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      Metadata.size = Metadata.size.toString();

      const params: AWS.S3.Types.PutObjectRequest = {
        Bucket: this.bucket,
        Key: `${folder}/${file.id}.${file.ext}`,
        Body: file.binary,
        ContentType: file.mime,
        ACL: 'public-read',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        Metadata,
      };

      return this.s3.upload(params).promise();
    });

    return Promise.all(uploadPromises);
  }

  /**
   * bulk operation to copy objects between s3 destinations
   * @param {CopyObject[]} objects - objects to copy
   */
  public copyObjects(objects: CopyObject[]) {
    const copyPromises = objects.map(object => {
      const requestParams: AWS.S3.CopyObjectRequest = {
        Bucket: this.bucket,
        Key: object.key,
        CopySource: `${this.bucket}/${object.source}`,
        ACL: 'public-read',
      };

      return this.s3.copyObject(requestParams).promise();
    });

    return Promise.all(copyPromises);
  }

  /**
   * builds object url
   * @param key
   */
  public getObjectUrl(key): string {
    return `https://s3.amazonaws.com/${this.bucket}/${key}`;
  }
}

export default S3Service;
