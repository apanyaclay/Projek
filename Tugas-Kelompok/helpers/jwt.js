const jwt = require('jsonwebtoken')

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "60m"}) 
}
let refreshTokens = []
function generateRefreshToken(user) {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "120m"})
    refreshTokens.push(refreshToken)
    return refreshToken
}

module.exports = {generateAccessToken, generateRefreshToken, refreshTokens}