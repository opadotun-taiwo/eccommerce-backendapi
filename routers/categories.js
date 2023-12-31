const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const category = require('../models/category')
//const category = require('../models/category')

router.get('/', async (req, res) => {
    const categoryList = await Category.find()

    if (!categoryList) {
        res.status(500).json({ success: failed })
    }

    res.status(200).send(categoryList)
})

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id)
    if (!category) {
        res.status(500).json({
            success: false,
            message: 'we did not find the category',
        })
    }

    res.status(200).send(category)
})

router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    })

    category = await category.save()

    if (!category) {
        return res.status(404).send('Category cannot be created')
    }

    res.send(category)
})

router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
        { new: true }
    )

    if (!category) {
        return res.status(404).send('Category cannot be created')
    }

    res.send(category)
})

router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then((category) => {
            if (category) {
                return res.status(200).json({
                    success: true,
                    message: 'the category has been deleted',
                })
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: 'Did not find category' })
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err })
        })
})

module.exports = router
