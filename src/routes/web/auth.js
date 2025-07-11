const express = require('express');
const { User, Customer, Shop, Admin } = require('../../models/User');
const auth = require('../../middleware/auth');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
    if (req.session?.user) {
        return res.redirect('/dashboard');
    }

    res.render('pages/auth/login', {
        title: 'Đăng nhập - Shopoo',
        user: null,
        error: req.query.error || null
    });
});

// Register page
router.get('/register', (req, res) => {
    if (req.session?.user) {
        return res.redirect('/dashboard');
    }

    res.render('pages/auth/register', {
        title: 'Đăng ký - Shopoo',
        user: null,
        error: req.query.error || null
    });
});

// Login POST
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email và mật khẩu là bắt buộc'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                error: 'Email hoặc mật khẩu không đúng'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Email hoặc mật khẩu không đúng'
            });
        }

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(403).json({
                error: 'Tài khoản đã bị khóa hoặc không hoạt động'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Store user in session
        req.session.user = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            ...(user.role === 'customer' && {
                tier: user.tier,
                loyaltyPoints: user.loyaltyPoints
            }),
            ...(user.role === 'shop' && {
                shopName: user.shopName,
                isVerified: user.isVerified
            })
        };

        console.log('Login - Session saved:', req.session.user);
        console.log('Login - Session ID:', req.sessionID);

        // Redirect based on role
        let redirectUrl = '/dashboard';
        if (user.role === 'admin') {
            redirectUrl = '/dashboard/admin';
        } else if (user.role === 'shop') {
            redirectUrl = '/dashboard/shop';
        }

        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            redirect: redirectUrl,
            user: req.session.user
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Lỗi hệ thống, vui lòng thử lại'
        });
    }
});

// Register POST
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role, phone } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                error: 'Email, mật khẩu và tên là bắt buộc'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'Mật khẩu phải có ít nhất 6 ký tự'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                error: 'Email đã được sử dụng'
            });
        }

        // Create user based on role
        let newUser;
        const userData = {
            email: email.toLowerCase(),
            password,
            name,
            phone,
            role: role || 'customer'
        };

        if (userData.role === 'customer') {
            newUser = new Customer(userData);
        } else if (userData.role === 'shop') {
            // For shop registration, require additional info
            const { shopName, businessLicense, address } = req.body;
            if (!shopName) {
                return res.status(400).json({
                    error: 'Tên cửa hàng là bắt buộc'
                });
            }

            newUser = new Shop({
                ...userData,
                shopName,
                businessLicense,
                address: address || {}
            });
        } else if (userData.role === 'admin') {
            // Admin can only be created by existing admin
            return res.status(403).json({
                error: 'Không thể tự đăng ký tài khoản admin'
            });
        } else {
            newUser = new Customer(userData); // Default to customer
        }

        await newUser.save();

        // Auto login after registration
        req.session.user = {
            _id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            avatar: newUser.avatar,
            ...(newUser.role === 'customer' && {
                tier: newUser.tier,
                loyaltyPoints: newUser.loyaltyPoints
            }),
            ...(newUser.role === 'shop' && {
                shopName: newUser.shopName,
                isVerified: newUser.isVerified
            })
        };

        res.json({
            success: true,
            message: 'Đăng ký thành công',
            redirect: '/dashboard',
            user: req.session.user
        });

    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 11000) {
            res.status(400).json({
                error: 'Email đã được sử dụng'
            });
        } else {
            res.status(500).json({
                error: 'Lỗi hệ thống, vui lòng thử lại'
            });
        }
    }
});

// Logout - Support both GET and POST
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.redirect('/?error=logout');
        }

        res.redirect('/?message=logout_success');
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({
                error: 'Lỗi đăng xuất'
            });
        }

        res.json({
            success: true,
            message: 'Đăng xuất thành công',
            redirect: '/'
        });
    });
});

// Check auth status
router.get('/status', (req, res) => {
    if (req.session?.user) {
        res.json({
            authenticated: true,
            user: req.session.user
        });
    } else {
        res.json({
            authenticated: false,
            user: null
        });
    }
});

// Profile page (requires authentication)
router.get('/profile', auth.requireAuth, (req, res) => {
    res.render('pages/auth/profile', {
        title: 'Hồ sơ cá nhân - Shopoo',
        user: req.session.user
    });
});

module.exports = router;
