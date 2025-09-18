import express from "express"

const router = express.Router();
import userRoute from "./api/userRoutes.js"
import authRoute from "./authRoutes.js"
import memberRoute from "./api/memberRoutes.js"
import staffRoute from "./api/staffRoutes.js"
import minstryRoute from "./api/ministryRoutes.js"
import teamRoute from "./api/ministryTeamRoutes.js"
import teamRoleRoute from './api/teamroleRoutes.js'
import eventsRoute from './api/eventRoutes.js'


router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/members', memberRoute)
router.use('/staff', staffRoute)
router.use('/ministry', minstryRoute)
router.use('/teams', teamRoute)
router.use('/teamrole', teamRoleRoute)
router.use('/events', eventsRoute)



export default router