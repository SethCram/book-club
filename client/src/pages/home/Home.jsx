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
  const [user, setUser] = useState(null);
  const { search } = useLocation(); //just take search prop of location
  const pages = new Array(totalPages).fill(null).map((v, i) => i);

  const findQueryStrValue = (queries, queryString) => {
    for (let i = 0; i < queries.length; i++) {
      if (queries[i].indexOf(queryString) !== -1) {
        return queries[i].split("=")[1];
      }
    }
  }
  const queries = search.split('&&'); 
  const username = findQueryStrValue(queries, "username");

  useEffect(() => { //cant detch data in here since using sync funct
    
    const fetchPosts = async () => {
      const response = await axios.get("/posts" + search);  

      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    }
    fetchPosts();

    //force scroll user to top of page
    window.scrollTo(0, 0);

  }, [search, pageNumber]) //only runs code everytime new query or page number changes

  //retrieve user according to username
  useEffect(() => {
    const getUser = async () => { 
      //only set user if the search type is requesting them
      if (username)
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

  }, [username]) //run everytime username changes

  function updateUrlParameter(url, param, value){
    var regex = new RegExp('([?|&]'+param+'=)[^\&]+');
    return url.replace( regex , '$1' + value);
  }

  const updatePagePagination = (search, parameter, pageIndex) => {

    //if pre-existing search
    if (search) {
      //if one of the queries is currently pagination
      if (search.indexOf(parameter) !== -1) {
        //update the pagination
        search = updateUrlParameter(search, parameter, pageIndex)
      }
      //if one of the queries isn't currently pagination
      else {
        //add pagination to the end
        search += "&&" + parameter + "=" + pageIndex;
      }
    }
    //no pre-existing search 
    else
    {
      search = "?page=" + pageIndex;
    }

    return search;
  }

  const incrPageCount = () => {
    return Math.min(totalPages-1, pageNumber + 1);
  }

  const decrPageCount = () => {
    return Math.max(0, pageNumber - 1);
  }

  return (
    <>
        <Header queryTerms={search} />
        <div className='home'>
          <div className="homeColumnAligned">
            <Posts posts={ posts } />
            {username && <Sidebar sidebarUser={user} />}
            
            <div className="homePush"></div>
          </div>
          {pages.length > 1 && 
            <div className="homePagination">
              <Link className="link" to={"/" + updatePagePagination(search, "page", decrPageCount())}>
                <button
                  className="homePaginationButton"
                  onClick={() => { setPageNumber(decrPageCount()) }}
                >
                  Previous
                </button>
              </Link>
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
              <Link className="link" to={"/" + updatePagePagination(search, "page", incrPageCount())}>
                <button
                  className="homePaginationButton"
                  onClick={() => { setPageNumber(incrPageCount()) }}
                >
                  Next
                </button>
              </Link>
            </div>
          }
        </div>
    </>
      
  )
}
