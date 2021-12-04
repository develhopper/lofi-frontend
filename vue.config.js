module.exports = {
    devServer:{
        proxy:{
            '^/api':{
                target:'http://localhost:3000',
                changOrigin:true,
                logLevel:"debug"
            }
        },
        hot: true,
        liveReload: true
    }
}