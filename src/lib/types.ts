import { ObjectId } from 'mongoose';

export interface ICustomer {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    city: string;
    company: string;
    imageFileName: string;
}
