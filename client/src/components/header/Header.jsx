import { useLocation } from "react-router-dom";
import "./Header.css"
import { useEffect, useState } from "react";

export default function Header({ queryTerms }) {
  const { search } = useLocation();
  const [queryUsername, setQueryUsername] = useState("");
  const [queryCategory, setQueryCategory] = useState("");
  const [searchBarContents, setSearchBarContents] = useState("");
  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    const findQueryStrValue = (queries, queryString) => {
      for (let i = 0; i < queries.length; i++) {
        if (queries[i].indexOf(queryString) !== -1) {
          return queries[i].split("=")[1];
        }
      }
    }

    const queries = search.split('&&'); 
    const username = findQueryStrValue(queries, "username");
    const category = findQueryStrValue(queries, "category");
    const searchContents = findQueryStrValue(queries, "searchContents");
    const page = findQueryStrValue(queries, "page");

    setQueryUsername(username);
    setQueryCategory(category);
    setSearchBarContents(searchContents);
    setPageNumber(Number(page));

  }, [search])

  return (
      <div className='header'>
        {queryTerms ? 
          <>
            <span className="headerSearchTitle"> Search Results </span>
            <hr className="headerSearchBar"/>
            {queryUsername && <span className="headerSearchSubtitle">user: {queryUsername}</span>}
            {queryCategory && <span className="headerSearchSubtitle">category: {queryCategory}</span>}
            {searchBarContents && <span className="headerSearchSubtitle">{searchBarContents}</span>}
            {pageNumber > 0 && <span className="headerSearchSubtitle">page: {pageNumber+1}</span>}
          </>
          : 
          <>
            <div className="headerTitles">
              <span className="headerTitleSmall">Blog</span>
              <span className="headerTitleLarge">Writing Platform</span>
            </div>
            <img
              className="headerImg"
              src="https://upload.wikimedia.org/wikipedia/commons/8/8f/Bachalpsee_reflection.jpg"
              alt=""
            />
          </>
        }
      </div>
  )
}
