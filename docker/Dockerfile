FROM jrottenberg/ffmpeg:4.1-ubuntu

RUN apt-get update && \
  apt-get install -y curl unzip && \
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

RUN unzip awscliv2.zip && \ 
  ./aws/install && \
  aws --version

WORKDIR /files

COPY ./copy_thumbs.sh /files

ENTRYPOINT ffmpeg -i ${INPUT_VIDEO_FILE_URL} -ss ${POSITION_TIME_DURATION} -vframes 1 -vcodec png -an -y ${OUTPUT_THUMBS_FILE_NAME} && ./copy_thumbs.sh
