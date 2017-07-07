class Config {
}
Config.RATIO = 1.77
Config.HEIGHT = 340
Config.CONTAINER_HEIGHT = 480
Config.WIDTH = Config.HEIGHT * Config.RATIO
Config.CONTAINER_WIDTH = Config.CONTAINER_HEIGHT * Config.RATIO
Config.DEBUG = false
Config.ANTIALIAS = false
Config.ASSETS = 'assets/'
Config.LEVEL = 1
Config.SCORE = 0
Config.VIDAS = 3
Config.PROFILE = {
    id: "",
    game: "marioevolution",
    data: {
        password: "",
        score: 0,
        lifes: 0,
        level: 0,
        coordinate: {
            x: 0,
            y: 0
        },
        trophies: [],
        screenshots: []
    }
};