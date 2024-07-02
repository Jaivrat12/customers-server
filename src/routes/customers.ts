import fs from 'fs';
import { type Request, Router } from 'express';
import Customer from '../models/Customer.js';
import { UploadedFile } from 'express-fileupload';

const customerRoutes = Router();

type GetCustomersReqQuery = {
    search: string;
    page: string;
    limit: string;
};

customerRoutes.get(
    '/',
    async (req: Request<{}, {}, {}, GetCustomersReqQuery>, res) => {
        // Remove special characters so that they don't interfere with regex while searching
        const escapeRegExp = (string: string) => {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        };

        try {
            const search = (req.query.search ?? '').trim();
            const page = parseInt(req.query.page ?? 0);
            const limit = parseInt(req.query.limit ?? 0);
            if (Number.isNaN(page) || Number.isNaN(limit)) {
                res.status(404).json({
                    success: false,
                    error: '`page` and `limit` should be numeric',
                });
                return;
            }

            const regexQuery = {
                $regex: escapeRegExp(search),
                $options: 'i',
            };

            const query = {
                $or: [
                    { firstName: regexQuery },
                    { lastName: regexQuery },
                    { city: regexQuery },
                ],
            };

            const getAllCustomersQuery = Customer.find(query)
                .skip((page - 1) * limit)
                .limit(limit);

            const getCustomersCountQuery = Customer.aggregate([
                { $match: query },
                { $count: 'total' },
            ]);

            const [customers, customersCount] = await Promise.all([
                getAllCustomersQuery,
                getCustomersCountQuery,
            ]);

            res.status(200).json({
                success: true,
                customers,
                total: customersCount[0]?.total ?? 0,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: 'Something went wrong',
            });
            console.log(err);
        }
    }
);

customerRoutes.get('/cities', async (req, res) => {
    try {
        const cities = await Customer.aggregate().sortByCount('city');
        res.status(200).json({ success: true, cities });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Something went wrong' });
        console.log(err);
    }
});

customerRoutes.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (customer) {
            res.status(200).json({ success: true, customer });
        } else {
            res.status(404).json({
                success: false,
                error: 'Customer not found',
            });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: 'Something went wrong' });
        console.log(err);
    }
});

customerRoutes.post('/', async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(200).json({ success: true, customer });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
});

customerRoutes.put('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (customer) {
            res.status(200).json({ success: true, customer });
        } else {
            res.status(404).json({
                success: false,
                error: 'Customer not found',
            });
        }
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
});

customerRoutes.put('/:id/image', async (req, res) => {
    try {
        const image = req.files?.image as UploadedFile;
        if (!image) {
            throw 'Image is required';
        }

        const fileExt = image.name.split('.').slice(-1)[0];
        const imageFileName = `${req.params.id}.${fileExt}`;
        const customer = await Customer.findByIdAndUpdate(req.params.id, {
            imageFileName,
        });

        if (customer) {
            // Check if the older image of customer exists and then delete it before saving the new image
            const oldImageFilePath = `./public/images/${customer.imageFileName}`;
            if (customer.imageFileName && fs.existsSync(oldImageFilePath)) {
                fs.unlinkSync(oldImageFilePath);
            }

            await image.mv(`./public/images/${imageFileName}`);
            res.status(200).json({ success: true, customer });
        } else {
            res.status(404).json({
                success: false,
                error: 'Customer not found',
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

export default customerRoutes;
