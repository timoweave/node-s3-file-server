
rm_simpsons:
# copy manually to run at the terminal # problem with bash $ vs make $
# for key in `curl -X GET localhost:8001/uploads/keys`; do curl -X DELETE localhost:8001/uploads/$key; done

add_simpsons:
	curl -X POST \
		-F "uploads=@samples/homer_simpson.png;type=image/png" \
		-F "uploads=@samples/marge_simpson.png;type=image/png" \
		-F 'uploads=@samples/bart_simpson.png;type=image/png' \
		-F 'uploads=@samples/lisa_simpson.png;type=image/png' \
		-F 'uploads=@samples/maggie_simpson.png;type=image/png' \
		localhost:8001/uploads 

list_simpsons:
	curl -X GET localhost:8001/uploads

