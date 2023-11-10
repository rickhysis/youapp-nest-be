
export class BaseModel<T> {
  //import { Exclude, Transform } from 'class-transformer';
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }

  // @Transform((value) => value.obj._id.toString())
  // _id?: string;

  // @Exclude()
  // __v?: number;
}