import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  public constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public getById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  public async deleteAll(): Promise<void> {
    await this.userRepository.clear();
  }
}
