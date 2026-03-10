import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmDto, SessionDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;

  const filmsServiceMock = {
    findAll: jest.fn<Promise<{ total: number; items: FilmDto[] }>, []>(),
    getSchedule: jest.fn<
      Promise<{ total: number; items: SessionDto[] }>,
      [string]
    >(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: filmsServiceMock }],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns films list from service', async () => {
    const response: { total: number; items: FilmDto[] } = {
      total: 1,
      items: [
        {
          id: 'film-1',
          rating: 8.1,
          director: 'Director',
          tags: ['drama'],
          image: '/content/afisha/image.jpg',
          cover: '/content/afisha/cover.jpg',
          title: 'Title',
          about: 'About',
          description: 'Description',
          schedule: [],
        },
      ],
    };
    filmsServiceMock.findAll.mockResolvedValue(response);

    await expect(controller.findAll()).resolves.toEqual(response);
    expect(filmsServiceMock.findAll).toHaveBeenCalledTimes(1);
  });

  it('returns schedule by film id', async () => {
    const response: { total: number; items: SessionDto[] } = {
      total: 1,
      items: [
        {
          id: 'session-1',
          daytime: '2026-03-07T10:00:00.000Z',
          hall: 1,
          rows: 5,
          seats: 10,
          price: 500,
          taken: [],
        },
      ],
    };
    filmsServiceMock.getSchedule.mockResolvedValue(response);

    await expect(controller.getSchedule('film-1')).resolves.toEqual(response);
    expect(filmsServiceMock.getSchedule).toHaveBeenCalledWith('film-1');
  });
});
