import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async create(createUserDto: any): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return (await this.usersRepository.save(user)) as unknown as User;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return (await this.usersRepository.save(user)) as unknown as User;
  }

  async updateProfile(userId: string, updateProfileDto: any): Promise<User> {
    const user = await this.findOne(userId);

    if (updateProfileDto.email) {
      const existing = await this.findByEmail(updateProfileDto.email);
      if (existing && existing.id !== userId) {
        throw new BadRequestException('邮箱已被占用');
      }
    }

    Object.assign(user, updateProfileDto);
    return (await this.usersRepository.save(user)) as unknown as User;
  }

  async setTwoFactorEnabled(userId: string, enabled: boolean): Promise<User> {
    const user = await this.findOne(userId);
    user.twoFactorEnabled = enabled;
    return (await this.usersRepository.save(user)) as unknown as User;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.findOne(userId);
    const isPasswordValid = await this.validatePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('当前密码错误');
    }
    user.password = await this.hashPassword(newPassword);
    await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
