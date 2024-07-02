var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import customerRoutes from './routes/customers.js';
const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(fileUpload({
//     useTempFiles: true,
//     tempFileDir: '/tmp/',
// }));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(`<a href="/api/customers">Go to Customers API</a>`);
}));
app.use('/api/customers', customerRoutes);
(() => __awaiter(void 0, void 0, void 0, function* () {
    const { PORT, MONGODB_URL } = process.env;
    try {
        yield mongoose.connect(MONGODB_URL);
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}))();
//# sourceMappingURL=index.js.map