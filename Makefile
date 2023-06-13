build_docker_image_and_push:
	docker build -t smlsoft/vfgl .
	docker push smlsoft/vfgl

build_docker_image:
	yarn build
	docker buildx build --platform linux/amd64 --push -t smlsoft/vfgl .

push_web_docker:
	docker push smlsoft/vfgl

run_web_docker:
	docker run --rm -p 8001:80 smlsoft/vfgl
build_m1_docker_releases:
	yarn build	
	docker buildx build --platform linux/amd64 --push -t smlsoft/vfgl .
build_m1_docker_dev:
	yarn build	
	docker buildx build --platform linux/amd64 --push -t smlsoft/vfgl:dev .	
run:
	yarn dev

build_loser_app:
	yarn build:loser
	docker buildx build --platform linux/amd64 --push -t smlsoft/vfgl:loserapp .