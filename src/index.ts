import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import 'dotenv/config';
import customerRoutes from './routes/customers.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('./public'));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
    })
);

app.get('/', async (req, res) => {
    res.send(`<a href="/api/customers">Go to Customers API</a>`);
});

app.use('/api/customers', customerRoutes);

(async () => {
    const { PORT, MONGODB_URL } = process.env;
    try {
        await mongoose.connect(MONGODB_URL!);
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
