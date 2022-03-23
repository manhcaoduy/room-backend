/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassConstructor, plainToClass } from 'class-transformer';
import { Document, Model } from 'mongoose';

import { QueryOptions } from './base-repository.interfaces';

function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key, value) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return Object.fromEntries(new Map(value.value));
    }
  }
  return value;
}

export class BaseRepository<T extends { id: any }> {
  public _model: Model<any & Document>;

  constructor(
    protected MongooseModel: Model<any & Document>,
    protected entity: ClassConstructor<T>,
  ) {
    this._model = MongooseModel;
  }

  async count(query: any, options?: QueryOptions): Promise<number> {
    return this.MongooseModel.countDocuments(query, options);
  }

  async aggregate(query: any[]): Promise<any> {
    return this.MongooseModel.aggregate(query);
  }

  async findById(id: string, select?: keyof T): Promise<T | null> {
    const data = await this.MongooseModel.findById(id, select);
    if (!data) return null;

    return this.mapEntity(data.toObject());
  }

  async findByObjectId(id: string, select?: keyof T): Promise<T | null> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return null;
    }
    return this.findById(id, select);
  }

  async findOne(
    query: any,
    extras?: {
      select?: keyof T;
      options?: QueryOptions;
    },
  ): Promise<T | null> {
    const data = await this.MongooseModel.findOne(
      query,
      extras?.select,
      extras?.options,
    );
    if (!data) return null;

    return this.mapEntity(data.toObject());
  }

  async findOneAndDelete(
    query: any,
    options?: { sort?: any },
  ): Promise<T | null> {
    const data = await this.MongooseModel.findOneAndDelete(query).sort(
      options?.sort,
    );
    if (!data) return null;

    return this.mapEntity(data.toObject());
  }

  async findOneAndUpdate(filter: any, updateBody: any) {
    const data = await this.MongooseModel.findOneAndUpdate(filter, updateBody, {
      new: true,
    });
    if (!data) return null;
    return this.mapEntity(data.toObject());
  }

  async delete(query: any): Promise<any> {
    return this.MongooseModel.deleteMany(query);
  }

  async find(
    query: any,
    select = '',
    options: { limit?: number; sort?: any; skip?: number } = {},
  ): Promise<T[]> {
    const data = await this.MongooseModel.find(query, select, {
      sort: options.sort || null,
    })
      .skip(options.skip)
      .limit(options.limit)
      .lean()
      .exec();

    return this.mapEntities(data);
  }

  async create(data: Partial<T>): Promise<T> {
    const newEntity = new this.MongooseModel(data);
    const saved = await newEntity.save();

    return this.mapEntity(saved);
  }

  async createWithId(entity: Partial<T>): Promise<T> {
    const updatingEntity = { ...entity, _id: entity.id };
    delete updatingEntity.id;
    const createdEntity = await this.MongooseModel.create(updatingEntity);
    return this.mapEntity(createdEntity);
  }

  async createMany(entities: Partial<T>[]): Promise<T[]> {
    const createdEntities = await this.MongooseModel.insertMany(entities);
    return this.mapEntities(createdEntities);
  }

  async createManyWithId(entities: Partial<T>[]): Promise<T[]> {
    const updatingEntities = entities.map((entity) => {
      const updatingEntity = { ...entity, _id: entity.id };
      delete updatingEntity.id;
      return updatingEntity;
    });
    const createdEntities = await this.MongooseModel.insertMany(
      updatingEntities,
    );
    return this.mapEntities(createdEntities);
  }

  async update(
    query: any,
    updateBody: any,
  ): Promise<{
    matched: number;
    modified: number;
  }> {
    const saved = await this.MongooseModel.updateMany(query, updateBody);

    return {
      matched: saved.matchedCount,
      modified: saved.modifiedCount,
    };
  }

  /*
   * Find a document based on the filter and update it with updateBody.
   * If no document is found, null is returned.
   */
  async updateOneAndReturn(filter: any, updateBody: any): Promise<T | null> {
    const updatedDocument = await this.MongooseModel.findOneAndUpdate(
      filter,
      updateBody,
      { new: true },
    );
    if (updatedDocument) {
      return this.mapEntity(updatedDocument);
    }
    return null;
  }

  protected mapEntity(data: any): T {
    return plainToClass<T, T>(
      this.entity,
      JSON.parse(JSON.stringify(data, replacer), reviver),
    ) as any;
  }

  protected mapEntities(data: any): T[] {
    return plainToClass<T, T[]>(this.entity, JSON.parse(JSON.stringify(data)));
  }
}
