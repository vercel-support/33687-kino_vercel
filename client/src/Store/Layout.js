import { makeAutoObservable } from "mobx";

class Layout {
    player = false
    pirate = false
    trailer = true
    poster = false
    container = false

    constructor() {
        makeAutoObservable(this)
    }

    setPlayer(player) {
        this.player = player
    }

    setPirate(pirate) {
        this.pirate = pirate
    }

    setTrailer(trailer) {
        this.trailer = trailer
    }

    setPoster(poster) {
        this.poster = poster
    }
    setContainer(container) {
        this.container = container
    }
}

export default new Layout()