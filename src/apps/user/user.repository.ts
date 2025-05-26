import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<User> {
    try {
      return await this.prisma.user.create({ data });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new InternalServerErrorException('Email already exists');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to find user by ID');
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to find user by email');
    }
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      const user = await this.findById(id);
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const user = await this.findById(id);
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }
}
