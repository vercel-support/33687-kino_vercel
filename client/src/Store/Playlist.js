import { makeAutoObservable } from "mobx";

class Playlist {

    season = null
    episode = 1
    id = 1
    playlist = null
    speed = 1
    urls = null
    translations = null
    translation = 'loading'
    url = null
    last = null

    constructor() {
        makeAutoObservable(this)
    }

    setSeason(season) {
        this.season = season
    }

    setEpisode(episode) {
        this.episode = episode
    }

    setId(id) {
        this.id = id
    }

    autoNext(playlist) {
        this.playlist = playlist;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setUrls(urls) {
        this.urls = urls;
    }

    setTranslation(id, name) {
        this.translation = { id: id, name: name };
    }

    setTranslations(translations) {
        this.translations = translations;
    }

    setUrl(url) {
        this.url = url;
    }

    setLast(last) {
        this.last = last;
    }
}

export default new Playlist()