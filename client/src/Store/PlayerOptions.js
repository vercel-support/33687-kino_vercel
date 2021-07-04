import { makeAutoObservable } from "mobx";

class PlayerOptions {

    buffering = false
    error = false
    parsing = false
    id = null
    translation = null

    constructor() {
        makeAutoObservable(this)
    }

    setWatch(watch) {
        this.watch = watch
    }

    setBuffering(buffering) {
        this.buffering = buffering
    }

    setError(error) {
        this.error = error
    }

    setParsing(parsing) {
        this.parsing = parsing
    }

    setId(id) {
        this.id = id
    }
}

export default new PlayerOptions()