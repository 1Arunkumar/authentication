const express = require('express');
const router = express.Router();
const passport = require('passport');
// const passport = require('passport');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const usercontroller = require('../controllers/user_controller');
// const { use } = require('./users');



router.post('/sign-in',passport.authenticate(
    'local',
    {failureRedirect:'/'},
),usercontroller.createsession);
router.get('/reset',passport.checkAuthentication,usercontroller.reset);
router.post('/update',usercontroller.update);
router.get('/sign-up',usercontroller.up);
router.post('/create',usercontroller.create);
router.get('/sign-out',usercontroller.destroySession);

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{ failureRedirect:'/users/sign-in'}), usercontroller.createsession);

module.exports = router;
