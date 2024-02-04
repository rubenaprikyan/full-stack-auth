# File Upload Middleware for Express

This middleware is the custom implementation of file uploads handling in Express applications.
It utilizes the `busboy` library for parsing multipart/form-data requests using runtime memory and provides error handling for common scenarios.

## Usage

```ts
const express = require('express');
const fileUploadMiddleware = require('modules/file-upload');

const app = express();

// Use the file upload middleware
app.post('/upload', fileUploadMiddleware(), (req, res) => {
  console.log(req.files);
  res.status(200).json({});
});

```

## Options

You can customize the behavior of the middleware by passing options when initializing it. The available options are:

- `maxFilesCount`: Maximum number of files allowed (default: 1)
- `maxFileSize`: Maximum file size allowed in bytes (default: 1MB)
- `allowedMediaTypes`: Array of allowed media types (default: ['images/jpeg', 'images/jpg', 'images/png'])

Example:

```ts
const options = {
  maxFilesCount: 5,
  maxFileSize: 1024 * 1024 * 5, // 5MB
  allowedMediaTypes: ['images/jpeg', 'images/png', 'application/pdf'],
};

app.post('/upload', fileUploadMiddleware(options), (req, res) => {
  /* the middleware adds, the middleware infeers req type
   *    as Express.Request to RequestWithFiles which is exported from library
   */
  console.log(req.files) // which is an array of File
});
```

## Error Handling

The middleware simplifies error handling by passing `FileUploadException` through next function, in case of errors.
The general error handling middleware can then be used to translate these exceptions into appropriate HTTP responses.

For example, in your general error handler you can do checks

```ts
import { ERROR_DETAILS, FileUploadException } from './errors';
// General error handling
app.use((err, req, res, next) => {
  if (err instanceof FileUploadException) {
    // Handle file upload exceptions
    if (
      [ERROR_DETAILS.FILES_COUNT_LIMIT_ERROR.debug, ERROR_DETAILS.FILE_SIZE_LIMIT_EXCEEDED_ERROR.debug, ERROR_DETAILS.STREAM_READ_ERROR.debug].includes(err.debug)
    ) {
      return res.status(400).json({
        message: err.message,
        originalErrorDetails: err.details,
      });
    }

    // Handle unsupported media type error
    if (err.debug === ERROR_DETAILS.UNSUPPORTED_MEDIA_TYPE_ERROR.debug) {
      return res.status(415).json({
        message: err.message,
        originalErrorDetails: err.details,
      });
    }
  }

  // Handle other errors
  res.status(500).json({
    message: 'Internal Server Error',
  });
});
```
