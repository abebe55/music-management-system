import { SongService } from '../../../src/modules/songs/song.service';
import { SongRepository } from '../../../src/modules/songs/song.repository';
import { AppError } from '../../../src/common/errors/app-error';
import { mockSong, mockSongList, validCreateSongPayload } from '../../fixtures/song.fixture';
import { buildPaginatedResult } from '../../../src/common/utils/pagination';

// Mock the repository
jest.mock('../../../src/modules/songs/song.repository');

const MockedSongRepository = SongRepository as jest.MockedClass<typeof SongRepository>;

describe('SongService', () => {
  let service: SongService;
  let repoMock: jest.Mocked<SongRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SongService();
    repoMock = MockedSongRepository.mock.instances[0] as jest.Mocked<SongRepository>;
  });

  describe('createSong', () => {
    it('should create and return a song', async () => {
      const song = mockSong();
      repoMock.create.mockResolvedValue(song);

      const result = await service.createSong(validCreateSongPayload);

      expect(repoMock.create).toHaveBeenCalledWith(validCreateSongPayload);
      expect(result).toEqual(song);
    });
  });

  describe('getSongById', () => {
    it('should return a song when found', async () => {
      const song = mockSong();
      repoMock.findById.mockResolvedValue(song);

      const result = await service.getSongById('song-id-123');

      expect(result).toEqual(song);
    });

    it('should throw AppError when song not found', async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.getSongById('nonexistent')).rejects.toBeInstanceOf(AppError);
    });

    it('should throw 404 when song not found', async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.getSongById('nonexistent')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('updateSong', () => {
    it('should update and return the song', async () => {
      const updated = mockSong({ title: 'Updated Title' });
      repoMock.update.mockResolvedValue(updated);

      const result = await service.updateSong('song-id-123', { title: 'Updated Title' });

      expect(result.title).toBe('Updated Title');
    });

    it('should throw AppError when song not found for update', async () => {
      repoMock.update.mockResolvedValue(null);

      await expect(service.updateSong('bad-id', { title: 'X' })).rejects.toBeInstanceOf(AppError);
    });
  });

  describe('deleteSong', () => {
    it('should delete the song successfully', async () => {
      repoMock.delete.mockResolvedValue(mockSong());

      await expect(service.deleteSong('song-id-123')).resolves.toBeUndefined();
    });

    it('should throw AppError when song not found for deletion', async () => {
      repoMock.delete.mockResolvedValue(null);

      await expect(service.deleteSong('bad-id')).rejects.toBeInstanceOf(AppError);
    });
  });

  describe('getSongs', () => {
    it('should return paginated results', async () => {
      const songs = mockSongList();
      const paginated = buildPaginatedResult(songs, songs.length, 1, 8);
      repoMock.findAll.mockResolvedValue(paginated);

      const result = await service.getSongs({ page: 1, limit: 8 });

      expect(result.data).toHaveLength(songs.length);
      expect(result.total).toBe(songs.length);
    });
  });
});
