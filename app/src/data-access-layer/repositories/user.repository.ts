import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  public constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async exists(userId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user !== null;
  }

  public async deleteAll(): Promise<void> {
    await this.userRepository.clear();
  }
}
