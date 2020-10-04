let config = (()=>{
    switch (process.env.NODE_ENV) {
        case 'TEST':
            return {
                PORT: 8080,
                DB: 'mongodb://localhost:27017/TGN_TEST'
            }
        case 'DEV':
            return {
                PORT: 8080,
                DB: 'mongodb://localhost:27017/TGN'
            }
        case 'SERVER_DEV':
            return {
                PORT: 8081,
                DB: 'mongodb://localhost:27017/TGN'
            }
        case 'PROD':
            return {
                PORT: 8080,
                DB: 'mongodb://localhost:27017/TGN_TEST'
            }
    }
})();
module.exports = config;