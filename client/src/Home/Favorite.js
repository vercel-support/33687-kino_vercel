import React, { useEffect, useState } from 'react'
import style from '../CSS/Favorite.module.sass'
import { BrowserRouter as Router, Link } from "react-router-dom";
import { get } from 'idb-keyval';

const Favorite = () => {

    const [favorite, setFavorite] = useState([{ blank: 'Пока здесь пусто :(' }]);

    useEffect(() => {
        const Favorite = async () => {
            const favorite = await get('Избранное');
            if (favorite !== undefined) {
                if (favorite.length > 0) {
                    setFavorite(await get('Избранное'));
                }
            }
        }
        Favorite();
    }, [])

    return (
        <section className={style.favorite_section}>
            <p className={style.favorite_title}>Избранное</p>
            <div className={style.favorite}>
                {favorite?.map((res, key) => (
                    <div className={style.favorite_item} key={key}>
                        <p>{res?.blank}</p>
                        <Link to={`/media/${res?.id}`}><img className={style.favorite_image} alt={res?.name} src={res?.poster}></img>
                            <p>{res?.name}</p></Link>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Favorite