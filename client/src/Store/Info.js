import { makeAutoObservable } from "mobx";

class Info {

    details = null
    videocdn = null
    info = null

    constructor() {
        makeAutoObservable(this)
    }

    setDetails(details) {
        this.details = details
    }

    videoCDN(data) {
        this.videocdn = data
    }

    setInfo(data) {
        this.info = data
    }
}

export default new Info()