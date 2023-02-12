import { useEffect, useState } from "react"
import Header from '../../components/header/Header'
import Posts from '../../components/posts/Posts'
import Sidebar from '../../components/sidebar/Sidebar'
import './Home.css'
import axios from "axios"
import { Link, useLocation } from "react-router-dom"

export default function Home() {
  const [posts, setPosts] = useState([]); //init arr empty bc no data fetched (state var)
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { search } = useLocation(); //just take search prop of location
  const [user, setUser] = useState(null);
  const userSearchType = search?.split("=")[0] === "?username";
  const username = search?.split("=")[1];
  const pages = new Array(totalPages).fill(null).map((v, i) => i);

  useEffect(() => { //cant detch data in here since using sync funct

    console.log(search);
    
    const fetchPosts = async () => {
      const response = await axios.get("/posts" + search);  

      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    }
    fetchPosts();

  }, [search, pageNumber]) //only runs code everytime new query or page number changes

  //retrieve user according to username
  useEffect(() => {
    const getUser = async () => { 
      //only set user if the search type is requesting them
      if (userSearchType)
      {
        try {
          const response = await axios.get("/users/username/" + username);
          setUser(response.data);
        } catch (error) {
          //notify requester that username was changed/user deleted
        }
      }
    };
    getUser();      

  }, [username, userSearchType]) //run everytime username changes

  function updateUrlParameter(url, param, value){
    var regex = new RegExp('([?|&]'+param+'=)[^\&]+');
    return url.replace( regex , '$1' + value);
  }

  const updatePagePagination = (search, parameter, pageIndex) => {

    //if pre-existing search
    if (search) {
      //if one of the queries is current pagination
      if (search.indexOf(parameter) !== -1) {
        //update the pagination
        search = updateUrlParameter(search, parameter, pageIndex)
      }
      //if one of the queries isn't current pagination
      else {
        //add pagination to the end
        search += "&&" + parameter + "=" + pageIndex;
      }
    }
    //no pre-existing search 
    else
    {
      search = "?page=" + pageIndex + "/";
    }

    return search;
  }

  return (
    <>
        <Header />
        <div className='home'>
          <Posts posts={ posts } />
        {userSearchType && <Sidebar user={user} />}
        <div className="homePagination">
          <button>Previous</button>
          {pages.map((pageIndex) => (
            <Link className="link" key={pageIndex} to={"/" + updatePagePagination(search, "page", pageIndex)}>
              <button
                className="homePaginationButton"
                key={pageIndex}
                onClick={() => setPageNumber(pageIndex)}
              >
                {pageIndex + 1}
              </button>
            </Link>
          ))}
          <button>Next</button>
        </div>
        </div>
    </>
      
  )
}
