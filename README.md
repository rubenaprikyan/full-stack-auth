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

- [x] Design the system _[PR #1](https://github.com/rubenaprikyan/auth-task/pull/1)_
- [x] Broke the project into smaller tasks based on [design](./docs/DEISGN.md). _[Commit](https://github.com/rubenaprikyan/auth-task/commit/64014de75f23765052037df486e7c734dd73afda)_

**Backend Tasks**

- [x] Setup Backend project _[PR #2](https://github.com/rubenaprikyan/auth-task/pull/2)_
- [x] Create `file-upload` custom module ([documentation](./backend/src/modules/file-upload/README.md)) _[PR #3](https://github.com/rubenaprikyan/auth-task/pull/3)_
- [x] Create `/api/files/upload` API and S3 files management _[PR #4](https://github.com/rubenaprikyan/auth-task/pull/4)_
- [x] Create initial Database models _[PR #5](https://github.com/rubenaprikyan/auth-task/pull/5)_
- [ ] Create `/api/users/register` API and registration logic _[PR #6](https://github.com/rubenaprikyan/auth-task/pull/6)_
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
