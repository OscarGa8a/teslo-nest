import { BadRequestException } from '@nestjs/common';

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  console.log({ file });

  if (!file) return callback(new Error('File is empty'), false);

  // if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
  //   return callback(new Error('File is not an image'), false);
  // }

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  if (!validExtensions.includes(fileExtension)) {
    // return callback(new Error('File extension not allowed'), false);
    return callback(
      new BadRequestException('File extension not allowed'),
      false,
    );
  }

  callback(null, true);
};
