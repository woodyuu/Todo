const config = require('./config')
const jwt = require('jsonwebtoken')

const generateToken = (user) =>{ //토큰생성
    return jwt.sign({
        _id: user._id, // 사용자 정보 (json 문자열)
        name: user.name,
        email: user.email,
        userId: user.userId,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
    },
    config.JWT_SECRET, // jwt 비밀키
    {
        expiresIn: '1d', // 만료기한(하루)
        issuer: 'woody',
    })
}

const isAuth = (req, res, next) => { // 권한을 확인하는 하우트핸들러
    const bearerToken = req.headers.authorization //요청헤더의 Authorization 속성 조회
    if(!bearerToken){
        res.status(401).json({message: 'Token is not supplied'}) // jwt 토큰이 없는경우
    }else{
        const token = bearerToken.slice(7, bearerToken.length) // jwt 토큰
        jwt.verify(token, config.JWT_SECRET, (err, userInfo) => {
            if(err && err.name === 'TokenExpiredError'){ // 토큰만료
                res.status(419).json({ code: 419, message: 'token expired !'})
            }else if(err){ //토큰 복호화하는 중에 에러발생
                res.status(401).json({ code: 401, message: 'Invalid Token !'})
            }else{
                req.user = userInfo // 브라우저에서 전송한 사용자정보(jwt 토큰을 복호화한것)를 req 객체로 저장
            next()
            }            
        })
    }
}

const isAdmin = (req, res, next) => { // 관리자 확인
    if(req.user && req.user.isAdmin){
        next() // 다음 서비스 사용할 수 있도록 허용
    }else{
        res.status(401).json({ code: 401, message: 'You are not valid admin user !'})
    }
}

module.exports ={
    generateToken,
    isAuth,
    isAdmin,
}