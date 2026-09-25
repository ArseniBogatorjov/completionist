import { DocumentBuilder } from '@nestjs/swagger';

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Completionist Hub')
    .setDescription('Api documentation for Completionist Hub app')
    .setVersion('1.0')
    .setContact(
      'Arseni Bogatorjov',
      'https://github.com/ArseniBogatorjov/Completionist-Hub',
      'bogatorjov@gmail.com',
    )
    .build();
}
