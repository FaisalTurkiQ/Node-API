const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const isAdmin = require('../middlewares/isAdmin');
const auth = require('../middlewares/auth');

router.post('/',isAdmin,blogController.createBlog);
router.get('/', blogController.listBlogs);
router.get('/:id', blogController.getBlog);
router.put('/:id',isAdmin,blogController.updateBlog);
router.delete('/:id',isAdmin,blogController.deleteBlog);

module.exports = router;
