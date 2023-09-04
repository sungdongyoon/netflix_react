import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getGenres, getMovies, IGetMovieResult, IGetMovieGenres } from '../api';
import { useNavigate, useMatch, PathMatch } from 'react-router-dom';
import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { motion, AnimatePresence, useScroll } from 'framer-motion';

const Wrapper = styled.div`
  background: #000;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{bgPhoto: string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url('${(props) => props.bgPhoto}');
  background-size: cover;
  cursor: pointer;
`;

const Slider = styled.div`
  width: 100%;
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
`;

const Box = styled(motion.div)<{bgPhoto: string}>`
  height: 200px;
  background-color: #fff;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  font-size: 30px;
  position: relative;
  cursor: pointer;
  &:first-child {
    transform-origin: left;
  }
  &:last-child {
    transform-origin: right;
  }
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  width: 50%;
  font-size: 30px;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  width: 40vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.darker};
  .cover_title {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px;
  }
`;

const BigCover = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 30px;
`;

const BigDate = styled.span`
  color: ${(props) => props.theme.white.lighter};
  background-color: tomato;
  border-radius: 5px;
  padding: 3px 5px;
`;

const BigVote = styled.span`
  color: ${(props) => props.theme.white.lighter};
  background-color: green;
  border-radius: 5px;
  padding: 3px 5px;
`;

const BigGenre = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  span {
    border: 1px solid ${(props) => props.theme.white.darker};
    padding: 3px;
    border-radius: 5px;
  }
`;

const BigOverView = styled.p`
  color: ${(props) => props.theme.white.darker};
  padding: 20px;
`;

const Button = styled.div`
  padding: 20px;
`;

const PlayBtn = styled.button`
  border: none;
  padding: 5px 15px;
  font-size: 14px;
  cursor: pointer;
`;

// 애니메이션 변수

const rowVariants = {
  hidden: {
    opacity: 0,
    x: window.innerWidth + 5,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -window.innerWidth - 5,
  },
}

const boxVarants = {
  normal: {
    scale: 1
  },
  hover: {
    zIndex: 99, 
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      type: "tween",
      duration: 0.3
    },
  },
}

const infoVarants = {
  start: {
    opacity: 0
  },
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      type: "tween",
      duration: 0.3
    }
  }
}


// 한 번에 보여주고 싶은 영화의 수
const offset = 6;

const Home = () => {
  const { data: movieData, isLoading: movieLoading } = useQuery<IGetMovieResult>(["movies", "nowPlaying"], getMovies);
  const { data: movieGenre, isLoading: genreLoading } = useQuery<IGetMovieGenres>(["genres"], getGenres);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if(movieData) {
      if(leaving) return;
      toggleLeaving();
      const totlaMovies = movieData?.results.length - 1;
      const maxIndex = Math.floor(totlaMovies / offset) - 1;
      setIndex(index === maxIndex ? 0 : (index + 1));
    }
  };
  const toggleLeaving = () => {
    setLeaving(!leaving);
  }

  const history = useNavigate();
  const bigMovieMatch: PathMatch<string> | null = useMatch('/movies/:movieId');
  const {scrollY} = useScroll();
  const onBoxClient = (movieId: number) => {
    history(`/movies/${movieId}`);
  }
  const onOverlayClick = () => {
    history('/');
  };
  
  const clickedMovie: any = bigMovieMatch?.params.movieId && movieData?.results.find((it) => String(it.id) === bigMovieMatch?.params.movieId);
  // console.log("data", movieData);
  // console.log("genre", movieGenre?.genres.map((it) => it.name));
  return (
    <Wrapper>
      {movieLoading || genreLoading ? (<Loader>Loading...</Loader>) : 
      (<>
        <Banner onClick={increaseIndex} bgPhoto={makeImagePath(movieData?.results[0].backdrop_path || "")}>
          <Title>{movieData?.results[0].title}</Title>
          <Overview>{movieData?.results[0].overview}</Overview>
        </Banner>
        <Slider>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <Row
            key={index}
            variants={rowVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            transition={{type: "tween", duration: 1}}>
              {movieData?.results.slice(1).slice(offset * index, offset * index + offset).map((it) => (
                <Box
                key={it.id}
                layoutId={it.id + ""}
                onClick={() => onBoxClient(it.id)}
                variants={boxVarants}
                whileHover="hover"
                initial="normal"
                transition={{type: "tween"}}
                bgPhoto={makeImagePath(it.backdrop_path, 'w500')}>
                  <Info variants={infoVarants}>
                    <h4>{it.title}</h4>
                  </Info>
                </Box>
              ))}
            </Row>
          </AnimatePresence>
        </Slider>
        <AnimatePresence>
          {bigMovieMatch &&
            <>
              <Overlay onClick={onOverlayClick} animate={{opacity: 1}} exit={{opacity: 0}}/>
              <BigMovie layoutId={bigMovieMatch.params.movieId} style={{
                top: scrollY.get() + 100,
              }}>
                {bigMovieMatch && (
                  <>
                  <BigCover style={{backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(clickedMovie.backdrop_path)})`}}/>
                  <div className='cover_title'>
                    <BigTitle>{clickedMovie.title}</BigTitle>
                    <BigDate>📆 {clickedMovie.release_date}</BigDate>
                    <BigVote>⭐ {clickedMovie.vote_average} ({clickedMovie.vote_count})</BigVote>
                  </div>
                  <BigGenre>
                    {clickedMovie.genre_ids.map((it: any) => (
                      <span key={it}>
                        {movieGenre?.genres.find((genre) => genre.id === it)?.name}
                      </span>
                    ))}
                  </BigGenre>
                  <BigOverView>{clickedMovie.overview}</BigOverView>
                  <Button>
                    <PlayBtn>▶️ PLAY</PlayBtn>
                  </Button>
                  </>
                )}
              </BigMovie>
            </>
          }
        </AnimatePresence>
      </>)}
    </Wrapper>
  )
}

export default Home;
