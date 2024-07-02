import { Router } from 'express';
const customerRoutes = Router();
customerRoutes.get('/', (req, res) => {
    res.status(200).json({
        customers: [
            {
                id: 1,
                first_name: 'Aman',
                last_name: 'Gupta',
                city: 'Ahmedabad',
                company: 'SublimeDataSystems',
            },
        ],
    });
});
export default customerRoutes;
//# sourceMappingURL=customers.js.map