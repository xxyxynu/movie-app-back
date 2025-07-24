const multer = require('multer');
const path = require('path');
const User = require('../models/userModel');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatars');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

const uploadAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/avatars/${req.file.filename}`;

    try {
        const userId = req.user.id; // 登录状态下，从 token 中间件获取
        const user = await User.findByIdAndUpdate(userId, { avatar: imageUrl }, { new: true });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'Avatar uploaded and user updated',
            avatar: user.avatar,
            username: user.username,
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    upload,
    uploadAvatar
};
