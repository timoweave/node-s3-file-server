Introduction
============
File upload/download server

Routes
======
Here is a list of endpoint and the corresponding description

|method| endpoint| desciption|
|---|---|---|
| `POST` | `/uploads`  | upload a file to s3, be sure to supply the mimetype |
| `GET` | `/uploads` | list of all uploaded s3 files's key ids and original-name along few infos. |
| `GET` | `/uploads/keys` | list of all uploaded s3 file key ids |
| `GET` | `/uploads/:id` | list meta-data info of a given s3 file |
| `GET` | `/uploads/:id/content` | download the content of given s3 file, using browser to directly download into original-name |
| `DELETE` | `/uploads/:id` | delete s3 file |

Example
=======

Besides, using postman app or html web app, one can use command line tool `curl` to interact with the server.

1. `curl -X POST -F "uploads=@samples/homer_simpson.png;type=image/png" localhost:8001/uploads`
1. `curl -X GET localhost:8001/uploads`
1. `curl -X GET localhost:8001/uploads/:id`
1. `curl -X GET localhost:8001/uploads/:id/content -o file.png`


Design
======
There are few design decision about this api.

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


