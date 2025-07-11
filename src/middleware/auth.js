// Authentication middleware for role-based access control

const roleMiddleware = {
    // Check if user is authenticated
    requireAuth: (req, res, next) => {
        if (!req.session || !req.session.user) {
            if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
                return res.status(401).json({
                    error: 'Authentication required',
                    redirect: '/auth/login'
                });
            }
            return res.redirect('/auth/login');
        }
        next();
    },

    // Check specific role
    requireRole: (roles) => {
        return (req, res, next) => {
            if (!req.session || !req.session.user) {
                return res.status(401).json({
                    error: 'Authentication required'
                });
            }

            const userRole = req.session.user.role;
            const allowedRoles = Array.isArray(roles) ? roles : [roles];

            if (!allowedRoles.includes(userRole)) {
                if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
                    return res.status(403).json({
                        error: 'Insufficient permissions',
                        required: allowedRoles,
                        current: userRole
                    });
                }
                return res.status(403).render('pages/error', {
                    title: 'Access Denied - Shopoo',
                    user: req.session.user,
                    error: {
                        status: 403,
                        message: 'Bạn không có quyền truy cập trang này'
                    }
                });
            }
            next();
        };
    },

    // Admin only
    requireAdmin: (req, res, next) => {
        return roleMiddleware.requireRole('admin')(req, res, next);
    },

    // Customer only
    requireCustomer: (req, res, next) => {
        return roleMiddleware.requireRole('customer')(req, res, next);
    },

    // Shop only
    requireShop: (req, res, next) => {
        return roleMiddleware.requireRole('shop')(req, res, next);
    },

    // Customer or Shop (not admin)
    requireUserRole: (req, res, next) => {
        return roleMiddleware.requireRole(['customer', 'shop'])(req, res, next);
    },

    // Optional auth - adds user to req if logged in
    optionalAuth: (req, res, next) => {
        req.user = req.session?.user || null;
        next();
    },

    // Check customer tier for special features
    requireTier: (minTier) => {
        const tierHierarchy = ['none', 'silver', 'gold', 'diamond'];

        return (req, res, next) => {
            if (!req.session || !req.session.user) {
                return res.status(401).json({
                    error: 'Authentication required'
                });
            }

            const user = req.session.user;
            if (user.role !== 'customer') {
                return res.status(403).json({
                    error: 'Customer role required'
                });
            }

            const userTierIndex = tierHierarchy.indexOf(user.tier || 'none');
            const requiredTierIndex = tierHierarchy.indexOf(minTier);

            if (userTierIndex < requiredTierIndex) {
                return res.status(403).json({
                    error: 'Insufficient customer tier',
                    required: minTier,
                    current: user.tier || 'none'
                });
            }
            next();
        };
    },

    // Check if shop is verified
    requireVerifiedShop: (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                error: 'Authentication required'
            });
        }

        const user = req.session.user;
        if (user.role !== 'shop') {
            return res.status(403).json({
                error: 'Shop role required'
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                error: 'Shop verification required',
                message: 'Your shop needs to be verified to access this feature'
            });
        }
        next();
    }
};

module.exports = roleMiddleware;
