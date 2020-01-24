const {Router} = require('express');

const User = require('../models/user');
const Exercise = require('../models/exercise');

const router = Router();

// add new user
router.post('/new-user', async (req, res) => {
    try {
        const {username} = req.body;

        const existing = await User.findOne({username});

        if (existing) {
            // console.log(existing);
            return res.send('username already taken')
        } else {
            const newUser = new User({username});

            await newUser.save();

            res.status(201).json({ newUser });
        }
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
});

// add new exercise
router.post('/add', (req, res) => {
    try {
        let {userId, description, duration, date} = req.body;

        if(userId === ''){
            res.send('unknown _id')
        }
        if(description === ''){
            res.send('Path `description` is required.')
        }
        if(duration === ''){
            res.send('Path `duration` is required.')
        }
        if(isNaN(duration)){
            res.send('Type of `duration` must be a number.')
        }
        if(date !== '' && (new Date(date).toString() === 'Invalid Date')){
            res.send('Invalid date format.')
        } else {
            User.findById(userId, (err, user) => {
                if (err) {
                    res.send('user ID not found')
                } else {
                    if(date){
                        date = new Date(date);
                    } else {
                        date = new Date();
                    }
                    Exercise.create({userId, username: user.username, description, duration, date}, (err, exercise) => {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send(`{"userId": "${userId}", "username": "${user.username}", "description": "${description}", "duration": "${duration}", "date": "${date}"}`);
                        }
                    })
                }
            });
        }
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
});

// get users
router.get('/users', async (req, res) => {
    try {
        const user = await User.find({});

        res.json(user);
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
});

// get log
router.get('/log?:userId/:from?/:to?/:limit?', async (req, res) => {
    try {
        let {userId, from, to, limit } = req.query;

        if(!userId) {
            res.send('unknown userId')
        } else {
            from = from ? new Date(from) : new Date(0);
            to = to ? new Date(to) : new Date();
            limit = limit ? limit*1 : 0;

            const exercise = await Exercise.find({userId, date: {$gt: from, $lt: to}}, null,{limit});

            res.json(exercise);
        }
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
});

module.exports = router;