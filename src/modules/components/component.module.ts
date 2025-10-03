import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComponentService } from './component.service';
import { Component, ComponentSchema } from './component.schema';
import { ComponentsController } from './component.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Component.name, schema: ComponentSchema },
    ]),
  ],
  controllers: [ComponentsController],
  providers: [ComponentService],
  exports: [ComponentService],
})
export class ComponentModule {}
