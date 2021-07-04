import { makeAutoObservable } from "mobx";

class PlayerControls {
    playing = true

    constructor() {
        makeAutoObservable(this)
    }

    setPlaying(playing) {
        this.playing = playing
    }

    setFullscreen(fullscreen) {
        this.fullscreen = fullscreen
    }

    setPlayed(played) {
        this.played = played
    }

    setCurrentTime(currentTime) {
        this.currentTime = currentTime
    }

    setCurrentDuration(currentDuration) {
        this.currentDuration = currentDuration
    }

    setVolume(volume) {
        this.volume = volume
    }

    setMute(mute) {
        this.mute = mute
    }

    setSettings(settings) {
        this.settings = settings
    }
}

export default new PlayerControls()