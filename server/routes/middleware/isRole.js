module.exports = roles => {
  /**
   * @param {(string|string[])} roles - Example role1&role2 or array
   */
  if (typeof roles === 'string') roles = roles.split(',')
  return async (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next()
    } else {
      return res.status(403).json({
        ok: false,
        message: 'Access denied'
      })
    }
  }
}
