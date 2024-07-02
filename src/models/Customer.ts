import { Schema, model } from 'mongoose';
import { ICustomer } from '../lib/types.js';

const customerSchema = new Schema<ICustomer>({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    imageFileName: {
        type: String,
        default: '',
    },
});

const Customer = model('Customer', customerSchema);
export default Customer;
