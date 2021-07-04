import React, { useEffect, useState } from 'react'
import style from '../CSS/Actual.module.sass'
/*import SwiperCore, { Navigation, A11y, Lazy } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/lazy/lazy.scss';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";*/
//SwiperCore.use([Navigation, A11y, Lazy]);

const Actual = () => {

    const [actual, setActual] = useState([]);
    const settings = {
        dots: true,
        infinite: true,
        adaptiveHeight: true,
        draggable: true,
        slidesToShow: 6,
        slidesToScroll: 3
    };
    useEffect(() => {
        const Fetch = async () => {
            const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1`, {
                headers: {
                    "X-API-KEY": "ceff3505-c77c-450a-8abb-aa29f638f5ee"
                }
            });
            const result = await response.json();
            setActual(result?.films);
            console.log(actual)
        }
        Fetch();
    }, [actual])
    return (
        <section className={style.actual_section}>
            <p className={style.actual_title}>Популярно сейчас</p>
            <div className={style.actual}>
                <Slider {...settings}>
                    {actual?.map((res, key) => (
                        <div>
                            <img src={res?.posterUrl} alt={res?.nameRu} className="swiper-lazy" />
                            <p>{res?.nameRu}</p>
                        </div>
                    ))}
                </Slider>

            </div>
        </section>
    )
}

export default Actual
