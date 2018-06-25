Introduction
============
Node File Server to upload to and download from aws s3

Get a list of uploaded files
![](screenshots/Screenshot_2018-06-25_16.25.26.pngScreenshot_2018-06-25_16.25.26.png)

Simple Upload.html
![](screenshots/Screenshot_2018-06-25_16.25.26.pngScreenshot_2018-06-25_16.25.32.png)

Installation
============
There are few ways to use this server; namely 1) build and run
locally, 2) pull the docker image, 3) use deployed aws app.

build and run locally, follow the steps:
1. run `git clone https://github.com/timoweave/node-s3-file-server.git`
1. run `cd node-s3-file-server`
1. run `npm install`
1. run `npm start`
1. run `open localhost:8001/uploads.html` or
1. run `curl localhost:80001/uploads` (see Example section below)

run container locally
1. run `docker pull timoweave/node-s3-file-server`
1. run `docker container -idt -p 8001:8001  timoweave/node-s3-file-server`
1. run `open localhost:8001/uploads.html` or
1. run `curl localhost:80001/uploads` (see Example section below)

open aws ecs
1. run `open http://ec2-54-89-210-48.compute-1.amazonaws.com/uploads.html` or
1. run `curl ec2-54-89-210-48.compute-1.amazonaws.com/uploads` (see Example section below) 

All Design / Architectural / Technical decisions
================================================

There are few design decision about this api.

1. for additional requirement, we pick the `Add an endpoint that
   returns a list of all files in the system, their identifier,
   original filename, and byte size of the file.`
1. we use `express router` allow us to retarget the endpoint, such as `/api/files`.
1. we use `s3` because it offer acl, permission, cloud storage, et., In
   this case we use `metadata` to keep track of the original file and
   mimetype, so that we don't have to create a database to track those
   item. the `s3` keys are all in `config.js`.
1. we use multer-s3 here, but we could also use the multer with memoryStorage and use s3.upload directly,
   see `storage.js` for more info.
1. the api is design to be `CRUD` like, so one can create, retrieve, and delete (except update)
   see `Makefile` for more example
1. the web page `uploads.html` is very simple, it only has input file required validation check.
   if you get the `id`, then point your brower to `localhost:8001/uploads/:id`, then the file you just
   uploaded will be downloaded and saved with the original name.
1. we use `docker`, so that it is easier to do development and deployment, and scaling
   (aws, docker-swarm, or kubernetes)

Routes
======
Here is a list of endpoint and the corresponding description

|method    | endpoint               | desciption |
|----------|------------------------|------------|
| `POST`   | `/uploads`             | upload a file to s3, be sure to supply the mimetype |
| `GET`    | `/uploads`             | list of all uploaded s3 files's key ids and original name, size, etc. |
| `GET`    | `/uploads/keys`        | list of all uploaded s3 file key ids |
| `GET`    | `/uploads/:id`         | list meta-data info of a given s3 file |
| `GET`    | `/uploads/:id/content` | download the given s3 file, (browser can save into the original-name) |
| `DELETE` | `/uploads/:id`         | delete s3 file |

Example
=======

Besides, using postman app or html web app, one can use command line
tool `curl` to interact with the server.

1. `curl -X POST -F "uploads=@samples/homer_simpson.png;type=image/png" localhost:8001/uploads`
1. `curl -X GET localhost:8001/uploads`
1. `curl -X GET localhost:8001/uploads/:id`
1. `curl -X GET localhost:8001/uploads/:id/content -o file.png`

