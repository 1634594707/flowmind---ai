import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

type MockRepo<T extends object> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let repo: MockRepo<User>;

  beforeEach(async () => {
    (bcrypt.hash as unknown as jest.Mock).mockResolvedValue('hashed');
    (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(true);

    repo = {
      create: jest.fn((x) => x),
      save: jest.fn(async (x) => x),
      findOne: jest.fn(),
      find: jest.fn(async () => []),
      remove: jest.fn(async () => undefined),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repo,
        },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  it('create() should hash password and save', async () => {
    const created = await service.create({ email: 'a@b.com', password: 'p' } as any);
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(repo.create).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'p',
      passwordHash: 'hashed',
    });
    expect(repo.save).toHaveBeenCalled();
    expect(created).toEqual({ email: 'a@b.com', password: 'p', passwordHash: 'hashed' });
  });

  it('findOne() should throw NotFoundException when missing', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(null);
    await expect(service.findOne('u1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updateProfile() should reject duplicated email', async () => {
    const user = { id: 'u1', email: 'old@b.com' } as any;
    (repo.findOne as jest.Mock).mockResolvedValueOnce(user);
    (repo.findOne as jest.Mock).mockResolvedValueOnce({ id: 'u2', email: 'new@b.com' } as any);

    await expect(service.updateProfile('u1', { email: 'new@b.com' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('changePassword() should throw when current password invalid', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce({ id: 'u1', passwordHash: 'hashed' } as any);
    (bcrypt.compare as unknown as jest.Mock).mockResolvedValueOnce(false);

    await expect(service.changePassword('u1', 'wrong', 'new')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
