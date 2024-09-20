const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/api/login",
    "/api/administrator",
    "/api/roles",
    "/api/permission",
    "/api/banner",
    "/api/menu",
    "/api/news",
    "/api/message", 
    "/api/store",
    "/api/activity",
    "/api/webactivity",
    "/api/activityOffsite",
    "/api/dynamiclink",
    "/api/offertips",
    "/api/redeemcoupon",
    "/api/payment",
    "/api/contactus",
    "/api/greeting",
    "/api/appsetting",
    "/api/updatenotice",
    "/api/coupontransferrecord",
    "/api/statistical",
    "/api/categories",
    "/api/seckill",
    "/api/file",
    "/api/tags",
    "/api/momentsetting",
    "/api/momentmanager",
    "/api/instantoffer",
    "/api/member", 
    "/api/deliverypush", 
    "/api/vouchersetting",
    "/api/appblock",
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://localhost:7175',
        secure: false
    });

    app.use(appProxy);
};
