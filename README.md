# auth-task

To understand the system design please go through the [Link](./docs/DEISGN.md)

## Project Folders Structure

### docs

Includes documentations, visual representations and [Design Document](./docs/DEISGN.md).

### frontend

Includes the front end project. [project](./frontend/README.md)

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
- [x] Create `/api/users/register` API and registration logic _[PR #6](https://github.com/rubenaprikyan/auth-task/pull/6)_
- [x] Create authentication middleware and AuthService _[PR #7](https://github.com/rubenaprikyan/auth-task/pull/7)_
- [x] Create `/api/users/login` APIs and login logic _[PR #8](https://github.com/rubenaprikyan/auth-task/pull/8)_
- [x] Create `/api/users/me` API _[PR #9](https://github.com/rubenaprikyan/auth-task/pull/9)_
- [ ] Cleanup project and documentation

**Frontend Tasks**

- [x] Setup Frontend project _[PR #10](https://github.com/rubenaprikyan/auth-task/pull/10)_
- [x] Setup component library and general styles _[PR #11](https://github.com/rubenaprikyan/auth-task/pull/11)_
- [x] Create Form related components UI _[PR #12](https://github.com/rubenaprikyan/auth-task/pull/12)_
- [x] Create Registration form page and logic _[PR #13](https://github.com/rubenaprikyan/auth-task/pull/13)_
- [x] Create Login form page and logic _[PR #14](https://github.com/rubenaprikyan/auth-task/pull/14)_
- [x] Create Profile page _[PR #15](https://github.com/rubenaprikyan/auth-task/pull/15)_
- [ ] Add ImagesUploader to Registration form
- [x] Add ImagesSlider to profile page _[PR #16](https://github.com/rubenaprikyan/auth-task/pull/16)_
- [ ] Cleanups if there is a need
