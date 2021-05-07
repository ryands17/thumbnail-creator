FROM jrottenberg/ffmpeg:4.4-ubuntu

RUN apt-get update && \
  apt-get install -y curl unzip && \
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

RUN unzip awscliv2.zip && \ 
  ./aws/install && \
  aws --version

WORKDIR /files

COPY ./copy_thumbs.sh /files

ENTRYPOINT ./copy_thumbs.sh
