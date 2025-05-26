import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      return await this.userRepository.create({
        ...data,
        password: hashedPassword,
      });
    } catch (error) {
      if (error.message.includes('Email already exists')) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<User> {
    return this.userRepository.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
