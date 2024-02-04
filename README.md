# auth-task

To understand the system design please go through the [Link](./docs/DEISGN.md)

## Project Folders Structure

### docs

Includes documentations, visual representations and [Design Document](./docs/DEISGN.md).

### frontend

Includes the front end project.

### backend

Includes the backend [project](./backend/README.md).

## Roadmap

- [x] Design the system
- [x] Broke the project into smaller tasks based on [design](./docs/DEISGN.md).

**Backend Tasks**

- [x] Setup Backend project
- [x] Create `file-upload` custom module ([documentation](./backend/src/modules/file-upload/README.md))
- [x] Create `/api/files/upload` API and S3 files management [PR #3](https://github.com/rubenaprikyan/auth-task/pull/4)
- [ ] Create initial Database models
- [ ] Create `/api/users/register` API and registration logic
- [ ] Create authentication middleware and AuthService
- [ ] Create `/api/users/login` API and login logic
- [ ] Create `/api/users/me` API
- [ ] Cleanup project and documentation

**Frontend Tasks**

- [ ] Setup Frontend project
- [ ] Setup component library and general styles
- [ ] Create Form related components UI
- [ ] Create Registration form page and logic
- [ ] Create Login form page and logic
- [ ] Create Profile page
- [ ] Add ImagesUploader to Registration form
- [ ] Add ImagesSlider to profile page
- [ ] Cleanups if there is a need
