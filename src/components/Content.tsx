// Import necessary modules and components
import axios from "axios";
import { useQuery } from 'react-query';
import './Style.css';
import { useEffect, useState } from 'react';
import StarRating from '../StarRating';
import {  useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';




// Define the Movie interface
interface Movie {
  Poster: string;
  Title: string;
  Year: string;
  imdbID: string;
}

// Define the Content component
const Content = ({val,onVal}:any) => {
  const [search, setSearch] = useState<string>('');
  const [bool, setBool] = useState<boolean>(false);

  const handleBoolean = (value: boolean) => {
    setBool(value);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };
  const navigate=useNavigate()
  const temp=val;
  console.log(temp)
  return (
    <div>
    {temp?
    <>
    <Header onChange={handleBoolean} onSearch={handleSearch} onVal={onVal} />
      <Main value={bool} que={search} />
    </>
    :<>
    
    {
    useEffect(()=>(
       navigate('/')
    ),[])
    
    }
    </>
      }
    </div>
  );
};

export default Content;

// Define the Header component
type Headerprop = {
  onChange: (value: boolean) => void;
  onSearch: (value: string) => void;
  onVal:(value:boolean)=>void
};

const Header: React.FC<Headerprop> = ({ onChange, onSearch ,onVal}) => {
  const [search, setSearch] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false); // State to track the active state of the button

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    onVal(false)

  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
    onSearch(value);
  };

  const handleButtonClick = (value: boolean) => {
    setIsActive(value); 
    onChange(value);
  };
const first=localStorage.getItem('firstName')
const last=localStorage.getItem('LastName')
  return (
    <div className="header">
      <span role="button" onClick={() => handleButtonClick(false)} className={`btn2 ${isActive ? 'active' : ''}`}>
        <h1><u >Mr.Mervin</u></h1>
      </span>
      
      
      <span role="button" onClick={() => handleButtonClick(true)} className={`btn ${isActive ? 'active' : ''}`}>
        <h1><u>Watchlist </u></h1>
      </span>
      <h3>Welcome,{first} {last}</h3>
      <div className="box">
      <input type="text" value={search} onChange={handleSearchChange}  placeholder='Search....'/>
     <FaSearch  />
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

type MainProps = {
  value: boolean;
  que: string;
};

const Main: React.FC<MainProps> = ({ value, que }) => {
  const [isId, setIsId] = useState<string>('');
  const [modal, setModal] = useState<boolean>(false);
  const [movieList, setMovieList] = useState<string | null>(null);

  useEffect(() => {
      const userID = localStorage.getItem('userID');
      setMovieList(userID);
  }, []);

  const { isLoading, isError, data: movies, refetch } = useQuery<Movie[]>('movies', async () => {
      const response = await axios.get(`https://www.omdbapi.com/?apikey=aa5bba2d&s=${que}`);
      const data = response.data.Search;
      return data;
  });
  useEffect(()=>{
    refetch()

  },[que])
  const handleClick = (id: string) => {
      setIsId(id);
      setModal(true);
  };
  const handleClose = () => {
      setModal(false);
  };
  if (isError) {
      return <h1>Error.........</h1>;
  }
  if (que === '' && !value) {
    return <p style={{alignItems:'center'}}>No movies found, Please search Movie 🔍</p>;
}
  if (!value && que !== '' && (!movies || movies.length === 0)) {
      return <p style={{alignItems:'center'}}>Movies not found ...❗❗❗</p>;
  }
  if (isLoading) {
      return <h1>Loading........</h1>;
  }
  return (
      <div className="movie-container">
          <ul className={`movie-list ${modal ? 'blur' : ''}`}>
              {value ? (
                  <WatchList values={movieList}  /> 
              ) : (
                  movies?.map((item: Movie, index: number) => (
                      <li key={index} className="movie-card" onClick={() => handleClick(item.imdbID)}>
                          <img src={item.Poster} alt={item.Title} />
                          <h1>{item.Title}</h1>
                          <p>{item.Year}</p>
                      </li>
                  ))
              )}
          </ul>
          {modal && (
              <div className="modal-overlay">
                  <div className="modal-content">
                      <MovieDetails id={isId} onClose={handleClose}  />
                  </div>
              </div>
          )}
      </div>
  );
};
// Define the MovieDetails component
interface MovieDetailsProps {
  id: string;
  onClose: () => void;
 
}

interface MovieDetails {
  Title: string;
  Poster: string;
  Year: string;
  Runtime: string;
  Plot: string;
  Released: string;
  Actors: string;
  Director: string;
  Genre: string;
  imdbRating: string | undefined;
  imdbID: string | undefined;
}

const MovieDetails = ({ id, onClose }: MovieDetailsProps) => {
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  const { data, isError, isLoading } = useQuery<MovieDetails>('movieDetails', async () => {
    const response = await axios.get(`https://www.omdbapi.com/?apikey=aa5bba2d&i=${id}`);
    return response.data;
  
  });
  if (isLoading) {
    return <h1>Loading.......</h1>;
  }
  if (isError) {
    return <h1>Error...</h1>;
  }

  const handleRating = (rating: number) => {
    setRating(rating);
  };

  const addToWatchlist = async() => {
    
    if (!data?.imdbID) {
      console.error('Movie ID not found.');
      return;
    }
  
    const storedId = localStorage.getItem('userID');
  
    if (!storedId) {
      console.error('User ID not found in localStorage.');
      return;
    }
  
    if (!rating) {
      toast.error('Please provide a rating.');
      return;
    }
    axios.get(`http://localhost:3000/users/${storedId}`)
      .then(response => {
        const existingWatchlist = response.data.watchlist || [];
        
        const isAlreadyAdded = existingWatchlist.some((movie: any) => movie.imdbId === data.imdbID);
  
        if (isAlreadyAdded) {
          toast.warn('You have already added this movie to your watchlist.');
          return;
        }
  
        const movieToAdd = {
          userId: storedId,
          Title: data.Title,
          poster: data.Poster,
          imdbId: data.imdbID,
          userRated: rating,
          review: message,
          plot:data.Plot,
        };
  
        const updatedWatchlist = [...existingWatchlist, movieToAdd];
  
        axios.patch(`http://localhost:3000/users/${storedId}`, { watchlist: updatedWatchlist })
          .then(response => {
            toast.success('Movie added to watchlist:', response.data,);
                     })
          .catch(error => {
            console.error('Error adding item to watchlist:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching watchlist:', error);
      });
  };  
  return (
    <div>
      <button onClick={onClose} className='close-modal'>&times;</button>
      <header className='group'>
        <div className='left'>
          <img src={data?.Poster} alt={data?.Title} />
        </div>
        <div className='right'>
          <h2>{data?.Title}</h2>
          <p>{data?.Released} {data?.Runtime}</p>
          <p>{data?.Genre}</p>
          <p><span>⭐</span>{data?.imdbRating} IMdb rating</p>
          <p>Your Rating:</p>
          <StarRating maxRating={10} size={26} color='#fcc419' onchange={handleRating} />
          <div className="review-container">
  <p>Review:</p>
  <textarea 
    className="review-textarea"
    rows={2} 
    cols={20} 
    value={message} 
    onChange={(e) => setMessage(e.target.value)} 
  />
</div>          <button onClick={addToWatchlist}>Add to WatchList</button>
          <p><em>{data?.Plot}</em></p>
          <p>Starring {data?.Actors}</p>
          <p>Directed by {data?.Director}</p>
          <ToastContainer />
        </div>
      </header>
    </div>
  );
};


interface WatchListProps {
  values: string|any;
}

const WatchList = ({ values}:WatchListProps) => {
  const { data, isLoading, isError } = useQuery<Movie[]>('watchlist', async () => {
    const response = await axios.get(`http://localhost:3000/users/${values}`);
    return response.data.watchlist;
  });

  const deleteMovie = async (userId: string, imdbId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = response.data;

      const movieIndex = user.watchlist.findIndex((movie:any) => movie.imdbId === imdbId);

      if (movieIndex !== -1) {
        user.watchlist.splice(movieIndex, 1);
        await axios.put(`http://localhost:3000/users/${userId}`, user);
        alert('Movie deleted successfully');
      } else {
        console.log('Movie not found in watchlist');
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };
  if (isLoading) {
    return <p>Loading.........</p>;
  }

  if (isError) {
    return <p>Error.............</p>;
  }

  return (
    <div className='watch-container'>
      <ul className='watch-list'>
        {data?.length===0? <p>Your watchlist is currently empty. Add something to start watching!</p> :
          data?.map((item:any) => (
            <li key={item.imdbId} className='watchlist'>
              <img src={item.poster} alt={item.Title} />
              <p>Your rating: {item.userRated}/10⭐</p>
              <p >your review: {item.review}</p>
              <button className='wBtn' onClick={() => deleteMovie(values, item.imdbId)}>Remove from watchlist</button>
            
            </li>
          ))}
      </ul>
    </div>
  );
};
