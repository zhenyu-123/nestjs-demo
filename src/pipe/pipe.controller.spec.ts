import { Test, TestingModule } from '@nestjs/testing';
import { PipeController } from './pipe.controller';
import { PipeService } from './pipe.service';

describe('PipeController', () => {
  let controller: PipeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PipeController],
      providers: [PipeService],
    }).compile();

    controller = module.get<PipeController>(PipeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
