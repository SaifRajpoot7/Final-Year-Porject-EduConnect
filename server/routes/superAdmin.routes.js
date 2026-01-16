import express from 'express';
const superAdminRouter = express.Router();
import userController from '../controllers/user.controller.js';
import requireAuth from '../middlewares/requireAuth.middleware.js';
import superAdminController from '../controllers/superAdmin/superAdmin.controller.js';
import requireSuperAdmin from '../middlewares/requireSuperAdmin.middleware.js';

// Public routes
superAdminRouter.post('/signin', userController.superAdminLogin);

superAdminRouter.post('/change-user-status', requireAuth, requireSuperAdmin, superAdminController.changeUserStatus);

superAdminRouter.get('/appeals', requireAuth, requireSuperAdmin, superAdminController.getAllAppeals);

superAdminRouter.post('/resolve-appeal', requireAuth, requireSuperAdmin, superAdminController.resolveAppeal);

superAdminRouter.get('/chart-data', requireAuth, requireSuperAdmin, superAdminController.getChartData);

superAdminRouter.get('/overview-cards', requireAuth, requireSuperAdmin, superAdminController.getOverviewCardsData);
superAdminRouter.get('/users', requireAuth, requireSuperAdmin, superAdminController.getAllUsers);


export default superAdminRouter;