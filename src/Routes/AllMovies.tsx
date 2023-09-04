import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { getMovies } from '../api';
import { makeImagePath } from '../utils';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 10%;
  padding-bottom: 10%;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 60px;
  margin-bottom: 100px;
`;

const MovieList = styled.div`
  width: 80vw;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 30px;
`;

const MovieItem = styled.div<{bgPhoto: string}>`
  width: 100%;
  height: 250px;
  background-image: url('${(props) => props.bgPhoto}');
  background-size: cover;
  background-position: center;
  position: relative;
  cursor: pointer;
  .movieTitle {
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

const AllMovies = () => {
  const {data, isLoading} = useQuery(["movieData"], getMovies);
  // console.log("data", data);
  const navigate = useNavigate();
  return (
    <Wrapper>
      {isLoading ? (<Loader>Loading...</Loader>) : 
      (<>
        <Title>All Movies</Title>
        <MovieList>
          {data?.results.map((movie: any) => (
            <MovieItem bgPhoto={makeImagePath(movie?.backdrop_path || "")} key={movie.id} onClick={(e) => navigate(`/movies/${movie.id}`)}>
              <div className='movieTitle'>
                {movie.title}
              </div>
            </MovieItem>
          ))}
        </MovieList>
      </>
      )}
    </Wrapper>
  )
}

export default AllMovies;
