const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

router.get('/', async (req, res) => {
    const userList = await User.find().select('-passwordHash')

    if (!userList) {
        res.status(500).json({ success: failed })
    }

    res.send(userList)
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash')
    if (!user) {
        res.status(500).json({
            success: false,
            message: 'we did not find the user',
        })
    }

    res.status(200).send(user)
})

router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        street: req.body.street,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })

    user = await user.save()

    if (!user) {
        return res.status(400).send('User cannot be created')
    }

    res.send(user)
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    const secret = process.env.secret

    if (!user) {
        return res.status(400).send('cannot find user')
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin,
            },
            secret,
            { expiresIn: '1d' }
        )

        return res.status(200).send({ user: user.email, token: token })
    } else {
        return res.status(400).send('Incorrect password')
    }
})

router.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        street: req.body.street,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })

    user = await user.save()

    if (!user) {
        return res.status(400).send('User cannot be created')
    }

    res.send(user)
})

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndRemove(req.params.id)

        if (deletedUser) {
            return res
                .status(200)
                .json({ success: true, message: 'the user os deleted' })
        } else {
            return res
                .status(400)
                .json({ success: false, message: 'Did not find user' })
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: err })
    }
})

router.get('/get/count', async (req, res) => {
    try {
        const userCount = await User.countDocuments()

        if (!userCount) {
            return res
                .status(500)
                .json({ success: false, message: 'Cannot count users.' })
        }

        res.send({
            userCount: userCount,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving the user count.',
        })
    }
})

module.exports = router
