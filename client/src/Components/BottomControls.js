import React, { useState } from 'react';
import Settings from './Settings';
import PlayerControls from '../Store/PlayerControls';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import style from '../CSS/BottomControls.module.sass'
import Icons from '../Images/Icons';

//import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
//import CastIcon from '@material-ui/icons/Cast';

const BottomControls = observer(({ video, handleSeekChange, prevEpisode, nextEpisode, handleVolumeChange }) => {

    const [remaining, setRemaining] = useState(false);
    const [slider, setSlider] = useState(false);
    const [volume, setVolume] = useState(100);

    const format = (data) => {
        if (isNaN(data)) {
            return '00:00';
        }
        const date = new Date(data * 1000);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds() < 10 ? '0' + date.getUTCSeconds() : date.getUTCSeconds();

        if (hours) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds}`;
        }
        return `${minutes}:${seconds}`;

    }

    const currentTime = remaining === false ? format(PlayerControls?.currentTime) : `-${format(PlayerControls?.currentDuration - PlayerControls?.currentTime)}`;
    const duration = format(PlayerControls?.currentDuration);

    const volumeChange = (e, newValue) => {
        setVolume(newValue)
    }

    const ValueLabelComponent = (props) => {

        const { children, open, value } = props;

        return (
            <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
                {children}
            </Tooltip>
        );
    }

    const PrettoSlider = withStyles({
        root: {
            height: 8,
        },
        thumb: {
            height: 16,
            width: 16,
            backgroundColor: "#fff",
            border: "2px solid currentColor",
            marginTop: -4,
            marginLeft: -8,
            "&:focus, &:hover, &$active": {
                boxShadow: "inherit",
            },
        },
        active: {},
        valueLabel: {
            left: "calc(-50% + 4px)",
        },
        track: {
            height: 8,
            borderRadius: 4,
            backgroundColor: "#ff4f12",
        },
        rail: {
            height: 8,
            borderRadius: 4,
        },
    })(Slider);

    //console.log(PlayerControls?.played)

    return (
        <div className={style.bottom_part}>
            <PrettoSlider
                min={0}
                max={100}
                value={PlayerControls?.played * 100}
                ValueLabelComponent={(props) => (
                    <ValueLabelComponent {...props} value={currentTime} />
                )}
                onChange={handleSeekChange}
            />
            <div className={style.bottom_controls}>
                <div className={style.bottom_left}>
                    <Icons icon='SkipPreviousIcon' className={style.bottom_icon} onClick={prevEpisode} />
                    {!PlayerControls?.playing ?
                        <Icons icon='PlayArrowIcon' className={style.bottom_icon} onClick={() => PlayerControls.setPlaying(true)} />
                        :
                        <Icons icon='PauseIcon' className={style.bottom_icon} onClick={() => PlayerControls.setPlaying(false)} />
                    }
                    <Icons icon='SkipNextIcon' className={style.bottom_icon} onClick={nextEpisode} />
                    <p className={style.player_duration} onClick={() => setRemaining(!remaining)}>{currentTime} / {duration}</p>
                </div>
                <div className={style.bottom_right}>
                    <div className='volume_controls'>
                        <span className='volume_icon' onMouseEnter={() => setSlider(true)} onMouseLeave={() => setSlider(false)} >
                            {PlayerControls?.volume !== 0 ?
                                <Icons icon='VolumeUpIcon' className={style.bottom_icon} onClick={() => { PlayerControls.setVolume(0); PlayerControls.setMute(true) }} onMouseEnter={() => setSlider(true)} onMouseLeave={() => setSlider(false)} />
                                :
                                <Icons icon='VolumeOffIcon' className={style.bottom_icon} onClick={() => { PlayerControls.setVolume(1); PlayerControls.setMute(false) }} onMouseEnter={() => setSlider(true)} onMouseLeave={() => setSlider(false)} />
                            }
                        </span>
                        {slider && (<span className='volume_slider' onMouseEnter={() => setSlider(true)} onMouseLeave={() => setSlider(false)} >
                            <Slider
                                min={0}
                                max={100}
                                value={volume}
                                onChange={(e, newValue) => { handleVolumeChange(e, newValue); volumeChange(e, newValue) }}
                                orientation="vertical"
                                aria-labelledby="vertical-slider"
                            />
                        </span>)}
                    </div>
                    <Settings handleVolumeChange={handleVolumeChange} />
                    <span>
                        {!video?.active ?
                            <Icons icon='FullscreenIcon' className={style.bottom_icon} onClick={video.enter} />
                            :
                            <Icons icon='FullscreenExitIcon' className={style.bottom_icon} onClick={video.exit} />
                        }
                    </span>
                </div>
            </div>
        </div >
    )
}
)

export default BottomControls
