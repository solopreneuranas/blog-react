var express = require('express');
var router = express.Router();

var upload = require('./multer')
var Posts = require('./postsModel')
var Category = require('./categoryModel')
var Admin = require('./adminModel')
var Author = require('./authorModel')
var Subscribers = require('./subscribersModel')
var Pages = require('./pagesModel')

const { ObjectId } = require('mongodb')

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch')

function checkAdmin() {
    try {
        var adminData = JSON.parse(localStorage.getItem('Admin'))
        if (adminData == null) {
            return false
        }
        else {
            return adminData
        }
    }
    catch (e) {
        return false
    }
}


router.post('/create-post', upload.single('poster'), function (req, res, next) {
    try {
        var body = { ...req.body, 'poster': req.file.filename }
        var post = new Posts(body)

        post.save().then((saveData) => {
            if (post == saveData) {
                res.json({ status: true, message: 'Post added successfully!' });
            }
            else {
                res.json({ status: false, message: 'Database Error!' });
            }
        })
    }
    catch (e) {
        console.log("ERROR", e)
        res.json({ status: false, message: 'Server Error!' })
    }
})

router.post('/duplicate-post', function (req, res, next) {
    try {

        var post = new Posts(req.body)

        post.save().then((saveData) => {
            if (post == saveData) {
                res.json({ status: true, message: 'Post duplicated successfully!' });
            }
            else {
                res.json({ status: false, message: 'Database Error!' });
            }
        })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
        console.log("ERROR", e)
    }
})

router.post('/create-category', upload.single('poster'), function (req, res, next) {
    var body = { ...req.body, 'poster': req.file.filename }
    var category = new Category(body)
    category.save().then((saveData) => {
        if (category == saveData) {
            res.json({ status: true, message: 'Category added successfully!' });
        }
        else {
            res.json({ status: false, message: 'Database Error!' });
            console.log(error)
        }
    })
})

router.get('/fetch-category', async function (req, res, next) {
    await Category.find({}).then((result) => {
        res.json({ categoryData: result, status: true })
    }).catch((e) => {
        res.json({ msg: "Server Error" })
    })
})

router.get('/display-category-list', async function (req, res, next) {
    await Category.find({}).then((result) => {
        res.json({ categoryData: result, status: true })
    }).catch((e) => {
        res.json({ status: false })
    })
})

router.post('/update-category-data', async function (req, res, next) {
    var { _id, ...categoryData } = req.body
    await Category.updateOne({ _id: req.body._id }, categoryData).then((result) => {
        res.json({ status: true })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
        console.log(e)
    })
})

router.post('/update-category-poster', upload.single('poster'), async function (req, res, next) {
    var body = { ...req.body, 'poster': req.file.filename }
    await Category.updateOne({ _id: req.body._id }, body).then((result) => {
        res.json({ status: true })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
        console.log(e)
    })
})

router.post('/delete-category', async function (req, res, next) {
    await Category.deleteOne({ _id: req.body._id }).then((result) => {
        res.json({ status: true })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
        console.log(e)
    })
})

router.get('/display-post-list', async function (req, res, next) {
    await Posts.aggregate([
        {
            $lookup: {
                from: "authors",
                localField: "author",
                foreignField: "_id",
                as: "authorData"
            }
        }
    ],
        { $unwind: "$authorData" }
    ).then((result) => {
        res.json({ status: true, postListData: result })
    }).catch((e) => {
        res.json({ msg: "Error" })
    })
})


router.post('/update-post-poster', upload.single('poster'), async function (req, res, next) {
    var body = { ...req.body, 'poster': req.file.filename }
    await Posts.updateOne({ _id: req.body._id }, body).then((result) => {
        res.json({ status: true })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
        console.log(e)
    })
})

router.post('/update-post-data', async function (req, res, next) {
    var { _id, ...postListData } = req.body
    await Posts.updateOne({ _id: req.body._id }, postListData).then((result) => {
        res.json({ status: true })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
        console.log(e)
    })
})

router.post('/delete-post', async function (req, res, next) {
    await Posts.deleteOne({ _id: req.body._id }).then((result) => {
        res.json({ status: true })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
        console.log(e)
    })
})

router.get('/display-search-list', async function (req, res, next) {
    await Posts.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "categoryData"
            }
        },
        {
            $match: {
                title: { $regex: req.body.search, $options: "i" }
            }
        }
    ],
        { $unwind: "$categoryData" }
    ).then((result) => {
        //console.log(result[0].categoryData);
        //console.log(result);
        res.json({ status: true, searchListData: result })
    }).catch((e) => {
        res.json({ msg: "Error" })
    })
})

router.post('/login', async function (req, res) {
    await Admin.find({ $and: [{ email: req.body.email }, { password: req.body.password }] }).then((result) => {
        if (result.length == 1) {
            res.json({ status: true, data: result })
        }
        else {
            res.json({ status: false })
        }
    })
})

router.post('/create-author', upload.single('picture'), function (req, res, next) {
    var body = { ...req.body, 'picture': req.file.filename }
    var author = new Author(body)
    author.save().then((saveData) => {
        if (author == saveData) {
            res.json({ status: true, message: 'Author added successfully!' })
        }
        else {
            res.json({ status: false, message: 'Database Error!' })
        }
    })
})

router.get('/fetch-author', async function (req, res, next) {
    await Author.aggregate([
        {
            $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "author",
                as: "authorData"
            }
        }
    ],
        { $unwind: "$authorData" }
    ).then((result) => {
        res.json({ status: true, data: result })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error!' })
    })
})

router.post('/update-author-data', async function (req, res, next) {
    var { _id, ...data } = req.body
    await Author.updateOne({ _id: req.body._id }, data).then((result) => {
        res.json({ status: true, message: 'Author updated successfully!' })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error!' })
    })
})

router.post('/delete-author', async function (req, res, next) {
    await Author.deleteOne({ _id: req.body._id }).then((result) => {
        res.json({ status: true, message: 'Author deleted successfully!' })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error!' })
    })
})

router.post('/update-author-picture', upload.single('picture'), async function (req, res, next) {
    var body = { ...req.body, 'picture': req.file.filename }
    await Author.updateOne({ _id: req.body._id }, body).then((result) => {
        res.json({ status: true })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
    })
})

router.get('/fetch-admin', async function (req, res, next) {
    await Admin.find({}).then((result) => {
        res.json({ status: true, data: result })
    }).catch((e) => {
        res.json({ status: false })
    })
})

router.post('/update-admin-data', async function (req, res, next) {
    var { _id, ...data } = req.body
    await Admin.updateOne({ _id: req.body._id }, data).then((result) => {
        res.json({ status: true, message: 'Admin updated successfully!' })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error!' })
    })
})

router.post('/update-admin-picture', upload.single('picture'), async function (req, res, next) {
    var body = { ...req.body, 'picture': req.file.filename }
    await Admin.updateOne({ _id: req.body._id }, body).then((result) => {
        res.json({ status: true })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
    })
})

router.post('/filter-category', async function (req, res, next) {
    await Posts.find({ category: req.body.category }).then((result) => {
        res.json({ status: true, data: result })
    }).catch((e) => {
        res.json({ status: false })
    })
})

router.post('/add-subscribers', function (req, res, next) {
    var subscribers = new Subscribers(req.body)
    subscribers.save().then((saveData) => {
        if (subscribers == saveData) {
            res.json({ status: true, message: "Subscribers added successfully!" })
        }
        else {
            res.json({ status: false, message: 'Database Error' })
        }
    })
})

router.post('/create-page', function (req, res, next) {
    try {
        var pages = new Pages(req.body)
        pages.save().then((saveData) => {
            if (pages == saveData) {
                res.json({ status: true, message: 'Page published successfully!' });
            }
            else {
                res.json({ status: false, message: 'Database Error!' });
            }
        })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
    }
})

router.get('/display-pages-list', async function (req, res, next) {
    await Pages.find({}).then((result) => {
        res.json({ status: true, data: result })
    }).catch((e) => {
        res.json({ status: false, message: 'Server Error!' })
    })
})

router.post('/update-page', async function (req, res, next) {
    var { _id, ...data } = req.body
    await Pages.updateOne({ _id: req.body._id }, data).then((result) => {
        res.json({ status: true, message: 'Page updated successfully!' })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error!' })
    })
})

router.post('/delete-page', async function (req, res, next) {
    await Pages.deleteOne({ _id: req.body._id }).then((result) => {
        res.json({ status: true, message: 'Page deleted successfully!' })
    }).catch((e) => {
        res.json({ status: false, message: 'Server Error!' })
    })
})

router.get('/display-post-list-by-category', async function (req, res, next) {
    await Posts.aggregate([
        {
            $lookup: {
                from: "authors",
                localField: "author",
                foreignField: "_id",
                as: "authorData"
            }
        },
        {
            $match: {
                category: req.query.category
            }
        }
    ],
        { $unwind: "$authorData" }
    ).then((result) => {
        res.json({ status: true, data: result })
    }).catch((e) => {
        res.json({ msg: "Error" })
    })
})

module.exports = router;
