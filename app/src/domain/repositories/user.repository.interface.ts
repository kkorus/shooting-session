export interface IUserRepository {
  exists(userId: string): Promise<boolean>;
  deleteAll(): Promise<void>;
}

export const IUserRepository = Symbol('IUserRepository');
