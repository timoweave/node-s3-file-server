
test_uploads:
	curl -X GET localhost:8001/uploads

test_upload1:
	curl -X POST -F 'uploads=@samples/lisa_simpson.png;type=image/png' localhost:8001/uploads
	@printf "\nlist uploads directory"
	ls ./tmp

test_upload2:
	curl -X POST -F 'uploads=@samples/lisa_simpson.png;type=image/png' -F 'uploads=@samples/lisa_simpson.png;type=image/png' localhost:8001/uploads
	@printf "\nlist upload directory"
	ls ./tmp
test_upload3:
	curl -X POST -F 'uploads=@samples/lisa_simpson.png;type=image/png' -F 'uploads=@samples/lisa_simpson.png;type=image/png' -F 'uploads=@samples/maggie_simpson.png;type=image/png' localhost:8001/uploads
	@printf "\nlist upload directory"
	ls ./tmp

clean_uploads:
	rm -f ./tmp/*
