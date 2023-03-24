import "./SinglePost.css"
import { Link } from "react-router-dom"
import { useContext, useEffect, useRef, useState } from "react"
import axios from "axios"
import { Context } from "../../context/Context";
import Multiselect from "multiselect-react-dropdown";
import { ThemeContext } from "../../App";
import ReputationIcon from "../reputationIcon/ReputationIcon";
import CommentSection from "../commentSection/CommentSection";
import * as DOMPurify from 'dompurify';
import Editor from "../editor/Editor";

export default function SinglePost({post, setUpdatedPostAuthor}) {
    const { user } = useContext(Context);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [updateMode, setUpdateMode] = useState(false);
    const [picture, setPicture] = useState(null);
    const [deleteOldPicture, setDeleteOldPicture] = useState(false);
    const [categories, setCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const multiSelectRef = useRef();
    const { theme } = useContext(ThemeContext);
    const [vote, setVote] = useState(null);
    const [repScore, setRepScore] = useState(0);

    const clearThumbsUpScore = 1;
    const solidThumbsUpScore = 0;
    const clearThumbsDownScore = -1;
    const solidThumbsDownScore = 0;

    //retrieve post according to postId
    useEffect(() => {
        const updateLocalPostFields = () => {
            //need for updating:
            setTitle(post.title);        
            setDescription(post.description);  
            setCategories(post.categories);
            setRepScore(post.reputation);
        };
        if (post) {
            updateLocalPostFields(); 
        }


    }, [post]) //rerun when postId changes

    useEffect(() => {
        const getVote = async () => {
            try {
               //get vote
                const vote = await axios.get(`/votes/get/`, {
                    params: {
                        username: user.username,
                        linkedId: post._id
                    }
                });

                setVote(vote.data); 
            } 
            catch (error) {
                //console.log(error);
            }
        };
        if (user && post) {
            getVote();
        }
    }, [post, user])

    const handleDelete = async () => {
        try {
            await axios.delete(`/posts/${post._id}`, {
                data: { username: user.username }
            });
            window.location.replace("/"); // go to home page if post deleted
        } catch (error) {
            
        }
        
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        const uploadedCategories = multiSelectRef?.current.getSelectedItems();

        const updatedPost = {
            username: user.username,
            title,
            description,
            categories: uploadedCategories
        };

        //console.log(`delete old picture ${deleteOldPicture}`);

        //if haven't reloaded page yet after previous file upload, this'll be empty
        //console.log(`and cached post photo: ${post.photo}`);

        const actuallyDeleteOldPicture = deleteOldPicture && post.photo;

        //if want to delete old pic and there is one, delete it
        if (actuallyDeleteOldPicture)
        {
            try {
                
                //delete from FS
                const response = await axios.delete("/photo/delete/", {
                    data: { filePath: post.photo }
                });

                //rm from db post
                updatedPost.photo = "";
                //clear locally cached post
                post.photo = "";
                setPicture("");

                console.log(response);

            } catch (error) {
                console.log("Failed to delete " + post.photo);
            }
        }

        //if there's a new picture
        if (picture) {
            const data = new FormData();
            const fileName = Date.now() + picture.name;
            
            data.append("name", fileName);
            data.append("file", picture);

            try {
                const response = await axios.post("/upload", data);
                //update db photo url
                updatedPost.photo = response.data.url;
                //update local cache photo url
                post.photo = response.data.url; //need this for future file deletion
                //setPicture(response.data.url); //cant set this here bc url created from picture var
            } catch (error) {
                console.log(error);
            }
        }
        
        try {
            await axios.put("/posts/" + post._id, updatedPost);

            setUpdateMode(false); //dont needa update this way
        } catch (error) {
            
        }

        //reset deletion desires
        setDeleteOldPicture(false);

        //update categories
        setCategories(uploadedCategories);
    }

    useEffect(() => {
        const getCategories = async () => {
          try {
            const storedCategories = await axios.get("/categories/");
            setAllCategories(storedCategories.data);
          } catch (error) {
          
          }
        }
        getCategories();
    }, [])

    const handleVote = async (score) => {

        //console.log(score);

        let voteObject;

        let changeInVoteScoring;

        try {

            if (vote) {
                //update vote w/ new score
                voteObject = await axios.put(`/votes/update/${vote._id}`, {
                    score,
                    linkedId: post._id,
                    voteId: vote._id,
                    username: user.username
                });

                changeInVoteScoring = voteObject.data.vote.score - vote.score
            }
            else
            {
                //create new vote
                voteObject = await axios.post("/votes/vote", {
                    score,
                    linkedId: post._id,
                    username: user.username
                }); 

                changeInVoteScoring = voteObject.data.vote.score;
            }

            //if linkedModel badgeName, update it locally (have to use context API ?)
            if (voteObject.data.linkedModel.badgeName) {
                post["badgeName"] = voteObject.data.linkedModel.badgeName;
            }

            if (Object.keys(voteObject.data.updatedAuthor).length > 0) {
                //need to update sidebar user reputation
                console.log("Sidebar author rep should be updated");
                setUpdatedPostAuthor(voteObject.data.updatedAuthor);
            }

            //set new vote properly
            setVote(voteObject.data.vote);

            //change local post rep score
            setRepScore(repScore + changeInVoteScoring);

        } catch (error) {
            console.log(error);
        } 
    };

    const chooseVoteIconClass = (desiredNumber, clearIcon) => {

        //if any vote cast
        if (vote) {
            //if vote cast is equal to desired number
            if (vote.score === desiredNumber) {
                return "icon-lock";
            }
            else
            {
                return "icon-unlock";
            }
        }
        //if no vote cast
        else
        {
            //display icon only if clear
           if (clearIcon) {
                return "icon-lock";
            }
            else
            {
                return "icon-unlock";
            } 
        }
    };

  return (
      <div className="singlePost">
          <div className="singlePostWrapper">
              {((post?.photo && !deleteOldPicture) || picture)  && (
                <img
                    className="singlePostImg"
                    src={picture ? URL.createObjectURL(picture) : post?.photo}
                    alt="" 
                />
              )}

              {updateMode &&  
                <div className="singlePostPictureIcons">
                    <label htmlFor='fileInput'>
                        <i className="singlePostPictureIcon fa-solid fa-plus"/>
                    </label>
                      <input
                          type='file'
                          id='fileInput'
                          style={{ display: "none" }}
                          onChange={(event) => { setPicture(event.target.files[0]); setDeleteOldPicture(true); }} //set picture to file uploaded
                    />
                      {(picture || post.photo !== "") && <i className="singlePostPictureIcon fa-regular fa-trash-can" onClick={() => { setPicture(null); setDeleteOldPicture(true); }}/>}
                </div>
              }
              <div className="singlePostCategories">
                {updateMode ?
                    <Multiselect
                        className="singlePostCategory"
                        isObject={true}
                        displayValue="name" // Property name to display in the dropdown options
                        options={allCategories}
                        selectedValues={categories}
                        placeholder="Select categories..."
                        selectionLimit={3}
                        showArrow
                        showCheckbox
                        avoidHighlightFirstOption
                        ref={multiSelectRef}
                        style={theme === "dark" ? { //Select styling CSS based on theme
                            searchBox: {
                            border: 'none'
                            },
                            chips: {
                            'background': 'var(--color-gold)'
                            },
                            inputField: {
                            'color' : 'white'
                            },
                            optionContainer: {
                            'background': 'var(--color-bg-dark)'
                            },
                            circle: {
                            'color': 'black'
                            }
                        } : {
                            searchBox: {
                            border: 'none'
                            },
                            chips: {
                            'background': 'var(--color-gold)'
                            },
                        }}
                    /> :
                    categories?.map((category, i) => (
                        <span className="singlePostCategory" key={i}>
                            <Link to={`/?category=${category.name}`} className="link">{category.name}</Link>
                        </span>
                    ))
                }
              </div>
              <span className="singlePostTitleRow">
                <div className="singlepostReputation">
                    <ReputationIcon repScore={repScore} post={post} />
                </div>
                {updateMode ?
                    <input type="text"
                        value={title}
                        className="singlePostTitleInput singlePostInputField"
                        autoFocus={true} 
                        onChange={(event)=>setTitle(event.target.value)}
                    /> : 
                    <h1 className="singlePostTitle">
                        {title}
                    </h1>
                }
                <div className="singlePostScoringIcons">
                    {!updateMode && user && post?.username !== user?.username &&
                        <>
                            <div className="singlePostScoringIconPairing">
                                <i 
                                    className={`singlePostScoringIcon ${chooseVoteIconClass(0, true)} fa-regular fa-thumbs-up`}
                                    onClick={() => {handleVote(clearThumbsUpScore) }}
                                ></i>
                                <i 
                                className={`singlePostScoringIcon ${chooseVoteIconClass(1, false)} fa-solid fa-thumbs-up`}
                                onClick={() => {handleVote(solidThumbsUpScore) }}
                                ></i>
                            </div>
                            <div className="singlePostScoringIconPairing">
                                <i 
                                className={`singlePostScoringIcon ${chooseVoteIconClass(0, true)} fa-regular fa-thumbs-down`}
                                onClick={() => {handleVote(clearThumbsDownScore) }}
                                ></i>
                                <i 
                                className={`singlePostScoringIcon ${chooseVoteIconClass(-1, false)} fa-solid fa-thumbs-down`}
                                onClick={() => {handleVote(solidThumbsDownScore) }}
                                ></i>
                            </div>
                        </>
                    }
                </div>
                {!updateMode && post?.username === user?.username &&
                    <div className="singlePostIcons">
                        <i className="singlePostIcon fa-regular fa-pen-to-square" onClick={()=>setUpdateMode(true)}></i>
                        <i className="singlePostIcon fa-regular fa-trash-can" onClick={handleDelete}></i>
                    </div>
                }
              </span>
              <div className="singlePostInfo">
                  <span className="singlePostAuthor">
                      Author: 
                      <Link className="link" to={`/?username=${post?.username}`}>
                          <b>
                            {" " + post?.username /* needa use ? for as long as post is passed in, since it's retrieved via async funct */ }
                          </b>
                      </Link>
                  </span>
                  <span className="singlePostDate">Published: {new Date(post?.createdAt).toDateString()}</span>
              </div>
              {updateMode ?
                <div
                    className="singlePostDescriptionInput singlePostInputField" 
                  >
                    <Editor setDescription={setDescription} defaultText={description} />
                </div>
                :
                <p
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }} 
                    className="singlePostDescription"
                />
              }
              {updateMode && 
                <button
                  className="singlePostUpdateButton"
                  onClick={handleUpdate}
                >
                    Update
                </button>
              }

              <CommentSection post={post} setUpdatedPostAuthor={setUpdatedPostAuthor} />

          </div>
      </div>
  )
}
