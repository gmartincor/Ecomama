import { withAuthor, buildWhereClause } from '@/lib/utils/prisma-helpers';

type WhereInput = Record<string, unknown>;

type FindOptions = {
  includeAuthor?: boolean;
  include?: Record<string, boolean | object>;
  select?: Record<string, boolean>;
  where?: WhereInput;
};

type FindManyOptions = FindOptions & {
  orderBy?: Record<string, string> | Array<Record<string, string>>;
  skip?: number;
  take?: number;
};

type PaginationParams = {
  page?: number;
  limit?: number;
};

type PaginatedResult<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export abstract class BaseRepository<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract model: any;

  protected buildInclude(options: FindOptions): Record<string, boolean | object> | undefined {
    if (options.includeAuthor) {
      return withAuthor();
    }
    return options.include;
  }

  protected buildFindOptions(options: FindOptions = {}): Record<string, unknown> {
    const queryOptions: Record<string, unknown> = {};
    
    const includeConfig = this.buildInclude(options);
    
    if (includeConfig) {
      queryOptions.include = includeConfig;
    }
    
    if (options.select) {
      queryOptions.select = options.select;
    }

    return queryOptions;
  }

  async findById(id: string, options: FindOptions = {}): Promise<T | null> {
    return await this.model.findUnique({
      where: { id },
      ...this.buildFindOptions(options),
    });
  }

  async findMany(where: WhereInput = {}, options: FindManyOptions = {}): Promise<T[]> {
    const queryOptions = this.buildFindOptions(options);

    if (options.orderBy) {
      queryOptions.orderBy = options.orderBy;
    }
    
    if (options.skip !== undefined) {
      queryOptions.skip = options.skip;
    }
    
    if (options.take !== undefined) {
      queryOptions.take = options.take;
    }

    return await this.model.findMany({
      where,
      ...queryOptions,
    });
  }

  async findManyPaginated(
    where: WhereInput = {},
    pagination: PaginationParams = {},
    options: FindManyOptions = {}
  ): Promise<PaginatedResult<T>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.findMany(where, { ...options, skip, take: limit }),
      this.count(where),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findFirst(where: WhereInput, options: FindOptions = {}): Promise<T | null> {
    return await this.model.findFirst({
      where,
      ...this.buildFindOptions(options),
    });
  }

  async create(data: Partial<T>, options: FindOptions = {}): Promise<T> {
    return await this.model.create({
      data,
      ...this.buildFindOptions(options),
    });
  }

  async createMany(data: Partial<T>[]): Promise<number> {
    const result = await this.model.createMany({ data });
    return result.count;
  }

  async update(id: string, data: Partial<T>, options: FindOptions = {}): Promise<T> {
    return await this.model.update({
      where: { id },
      data,
      ...this.buildFindOptions(options),
    });
  }

  async updateMany(where: WhereInput, data: Partial<T>): Promise<number> {
    const result = await this.model.updateMany({ where, data });
    return result.count;
  }

  async upsert(
    where: { id: string },
    create: Partial<T>,
    update: Partial<T>,
    options: FindOptions = {}
  ): Promise<T> {
    return await this.model.upsert({
      where,
      create,
      update,
      ...this.buildFindOptions(options),
    });
  }

  async delete(id: string): Promise<void> {
    await this.model.delete({ where: { id } });
  }

  async deleteMany(where: WhereInput): Promise<number> {
    const result = await this.model.deleteMany({ where });
    return result.count;
  }

  async exists(where: WhereInput): Promise<boolean> {
    const count = await this.model.count({ where, take: 1 });
    return count > 0;
  }

  async count(where: WhereInput = {}): Promise<number> {
    return await this.model.count({ where });
  }

  protected buildSafeUpdateData<D extends Record<string, unknown>>(data: Partial<D>): Partial<D> {
    return buildWhereClause(data);
  }
}
