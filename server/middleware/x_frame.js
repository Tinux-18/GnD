exports.xFrameHeader = (req, res, next) => {
    res.setHeader("x-frame-options", "deny");
    next();
};
