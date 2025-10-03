import { withAuthor } from '@/lib/utils/prisma-helpers';

type FindOptions = {
  includeAuthor?: boolean;
  include?: any;
  select?: any;
};

type FindManyOptions = FindOptions & {
  orderBy?: any;
  skip?: number;
  take?: number;
};

export abstract class BaseRepository<T> {
  protected abstract model: any;

  async findById(id: string, options: FindOptions = {}): Promise<T | null> {
    const { includeAuthor = false, include, select } = options;
    
    const includeConfig = includeAuthor ? withAuthor() : include;
    
    return await this.model.findUnique({
      where: { id },
      ...(includeConfig && { include: includeConfig }),
      ...(select && { select }),
    });
  }

  async findMany(where: any, options: FindManyOptions = {}): Promise<T[]> {
    const { includeAuthor = false, include, select, orderBy, skip, take } = options;
    
    const includeConfig = includeAuthor ? withAuthor() : include;

    return await this.model.findMany({
      where,
      ...(includeConfig && { include: includeConfig }),
      ...(select && { select }),
      ...(orderBy && { orderBy }),
      ...(skip !== undefined && { skip }),
      ...(take !== undefined && { take }),
    });
  }

  async findFirst(where: any, options: FindOptions = {}): Promise<T | null> {
    const { includeAuthor = false, include, select } = options;
    
    const includeConfig = includeAuthor ? withAuthor() : include;

    return await this.model.findFirst({
      where,
      ...(includeConfig && { include: includeConfig }),
      ...(select && { select }),
    });
  }

  async create(data: any, options: FindOptions = {}): Promise<T> {
    const { includeAuthor = false, include, select } = options;
    
    const includeConfig = includeAuthor ? withAuthor() : include;

    return await this.model.create({
      data,
      ...(includeConfig && { include: includeConfig }),
      ...(select && { select }),
    });
  }

  async createMany(data: any[]): Promise<number> {
    const result = await this.model.createMany({ data });
    return result.count;
  }

  async update(id: string, data: any, options: FindOptions = {}): Promise<T> {
    const { includeAuthor = false, include, select } = options;
    
    const includeConfig = includeAuthor ? withAuthor() : include;

    return await this.model.update({
      where: { id },
      data,
      ...(includeConfig && { include: includeConfig }),
      ...(select && { select }),
    });
  }

  async updateMany(where: any, data: any): Promise<number> {
    const result = await this.model.updateMany({ where, data });
    return result.count;
  }

  async delete(id: string): Promise<void> {
    await this.model.delete({ where: { id } });
  }

  async deleteMany(where: any): Promise<number> {
    const result = await this.model.deleteMany({ where });
    return result.count;
  }

  async exists(where: any): Promise<boolean> {
    const count = await this.model.count({ where, take: 1 });
    return count > 0;
  }

  async count(where?: any): Promise<number> {
    return await this.model.count({ where });
  }
}
