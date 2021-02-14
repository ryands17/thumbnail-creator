#!/bin/bash

echo "Downloading ${INPUT_VIDEO_FILE_URL}..."
aws s3 cp ${INPUT_VIDEO_FILE_URL} video.mp4
ffmpeg -i video.mp4 -ss ${POSITION_TIME_DURATION} -vframes 1 -vcodec png -an -y ${OUTPUT_THUMBS_FILE_NAME}

echo "Copying ${OUTPUT_THUMBS_FILE_NAME} to S3 at ${OUTPUT_S3_PATH}/${OUTPUT_THUMBS_FILE_NAME}..."
aws s3 cp ./${OUTPUT_THUMBS_FILE_NAME} s3://${OUTPUT_S3_PATH}/${OUTPUT_THUMBS_FILE_NAME} --region ${AWS_REGION}
