import React, { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ScrollContainer from 'react-indiana-drag-scroll';
import style from '../CSS/Staff.module.sass';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/swiper.min.css";
import '../CSS/Slider.sass';
import SwiperCore, { Navigation } from "swiper/core";
import { observer } from 'mobx-react-lite';
import Info from '../Store/Info';

const breakpointsSimilar = { 320: { slidesPerView: 3.5 }, 768: { slidesPerView: 9 } };

const navigationSimilar = {
    nextEl: '.swiper-button-next.similar',
    prevEl: '.swiper-button-prev.similar',
}

const Staff = observer(() => {
    const [staff, setStaff] = useState(null);
    const [width, setWidth] = useState(null);

    useEffect(() => {
        const Fetch = async () => {
            if (Info?.info?.kp !== undefined) {
                const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=${Info?.info?.kp}`, {
                    headers: {
                        "X-API-KEY": "ceff3505-c77c-450a-8abb-aa29f638f5ee"
                    }
                });
                const result = await response.json();

                var directors = result?.filter(res => {
                    if (res?.professionKey === 'DIRECTOR') {
                        return res
                    }
                })
                var actors = result?.filter(res => {
                    if (res?.professionKey === 'ACTOR') {
                        return res
                    }
                })
                directors = directors.length > 3 ? directors.slice(0, 3) : directors;
                actors = actors.length > 10 ? actors.slice(0, 10) : actors
                setStaff(directors.concat(actors));
            }
        }
        Fetch();
    }, [Info?.info?.kp])

    return (
        <SkeletonTheme color="#202020" highlightColor="#444">
            <section className={style.staff_container}>
                {staff?.length > 2 && (
                    <Swiper
                        slidesPerView={7}
                        freeMode={true}
                        navigation={navigationSimilar}
                        //key={Playlist?.cdn?.kinopoisk_id}
                        breakpoints={breakpointsSimilar}
                        centeredSlidesBounds={true}
                        centeredSlides={true}
                        className={style.staff_feed}
                    >
                        <div className='swiper-button-prev similar'></div>
                        <div className='swiper-button-next similar'></div>
                        {/*<ScrollContainer className='staff_feed' horizontal='true' vertical='false' hideScrollbars='true'>*/}
                        {staff?.map((res, key) => (
                            <SwiperSlide key={res?.posterUrl} className={style.staff_item}>
                                <LazyLoadImage
                                    src={`https://cdn.statically.io/img/${res?.posterUrl.slice(8, 35)}/f=auto,w=${width},q=100/${res?.posterUrl.slice(36)}`}
                                    className={style.staff_poster}
                                    effect="blur"
                                />
                                {res?.nameRu !== undefined ? <p className={style.staff_name} ref={node => setWidth(node?.offsetWidth)}>{res?.nameRu}</p> : <Skeleton count={1} duration={2} width={'9vw'} height={'2vw'} style={{ margin: '1vw' }} />}
                                {res?.professionText !== undefined ? <p className={style.staff_role}>{res?.professionText}</p> : <Skeleton count={1} duration={2} width={'7vw'} height={'2vw'} style={{ margin: '1vw' }} />}
                            </SwiperSlide>
                        ))}
                    </Swiper>)}
            </section>
        </SkeletonTheme>
    )
}
)

export default React.memo(Staff)
