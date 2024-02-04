## How to run the project

To work with the back end project please go to the /backend folder in your terminal

```bash
cd backend
```

### Install Dependencies

```bash
npm install
```

### Run database instance

Make sure you have docker installed on your machine

```bash
npm run docker-up
```

To run the backend api, you need to create `.env` folder in the root of project, use `.env.example` as reference and fill actual values.

Last step,

- Create s3 bucket and pass the name to s3 service, by default it uses `uploader-experimental` bucket name.
- Create aws credentials and grant full s3 access
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "<your user arn>"
      },
      "Action": "*",
      "Resource": [
        "arn:aws:s3:::uploader-experimental/*",
        "arn:aws:s3:::uploader-experimental"
      ]
    }
  ]
}
```

That will work with `PutObjectACL`, `ListObjectACL`, `MoveObject`, `PutObject` access points as well if you dont want to give full access.

- [configure aws cli](https://docs.aws.amazon.com/cli/latest/reference/configure/) with your `aws_access_key_id` and `aws_secret_access_key`.



### Run the backend api

```bash
npm run api-dev
```

### Files Structure

`/docker` - includes docker configuration files for database and might have deployment scripts as well

`/config` - includes config files. `index.ts` - config variables object parsed from `.env`

`/database` - includes `entities` and `data-source.ts`

`/modules` - includes high level modules that could be libraries and not related to special project

`/routes` - includes routes separated into different files

`/middlewares` - includes express middlewares

`/controllers` - includes controllers, to handle routes and business logic

`/services` - includes services, related to business logic


`index.ts` - the entry point, creates server, database connection, injects app level middlewares, routes
