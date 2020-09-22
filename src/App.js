import React, {useEffect, useState } from 'react'
import './App.css'
import Tmdb from './Tmdb'
import MovieRow from './components/MovieRow'
import FeaturedMovie from './components/FeaturedMovie'
import Header from './components/Header'


export default () => {

  const [movieList, setMovieList] = useState([])
  const [featuredData, setFeaturedData] = useState(null)
  const [blackHeader, setBlackHeader] = useState(false)

  useEffect( ()=>  {
      const loadAll = async () => {
        //Pegando a lista TOTAL
        let list = await Tmdb.getHomeList()
        setMovieList(list)

        //Pegando o Featured
        let originals = list.filter(i=> i.slug === 'originals')
        let randonChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1))
        let chosen = originals[0].items.results[randonChosen]
        let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')
        setFeaturedData(chosenInfo)
      }
      loadAll()
  },[])

  useEffect(()=>{
    const scrollListener = () => {
      if(window.scrollY > 10) 
        setBlackHeader(true)
      else
        setBlackHeader(false)
      
    }

    window.addEventListener('scroll', scrollListener)

    return() => {
      window.removeEventListener('scroll', scrollListener)
    }
  },[])

  return (
    <div className = "page">

      <Header black={blackHeader}/>

      {featuredData && 
        <FeaturedMovie item = {featuredData}/>
      }

      <section className="lists">
        {movieList.map((item, key)=>(
          <MovieRow key={key} title = {item.title} items = {item.items} />
        ))}
      </section>
      <footer>
        Feito com <span role="img" aria-label="coração">❤️</span> por Lucas Brum<br/>
        Direitos reservados para Netflix<br/>
        Dados do site TheMoviedb.org
      </footer>
      {movieList.length<=0 &&
      <div className="loanding">
          <img src="https://cdn.lowgif.com/small/ce629026a12a85a7-the-tech-behind-netflix-s-worldwide-expansion-is-a-big-deal-for-the.gif"></img>
      </div>
      }
    </div>
  )
}
