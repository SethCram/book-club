import "./SinglePost.css"
import { Link, useNavigate } from "react-router-dom"
import { useContext, useEffect, useRef, useState } from "react"
import axios from "axios"
import { Context } from "../../context/Context";
import ReputationIcon from "../reputationIcon/ReputationIcon";
import CommentSection from "../commentSection/CommentSection";
import * as DOMPurify from 'dompurify';
import Editor from "../editor/Editor";
import Vote, { VoteType } from "../vote/Vote";
import MyMultiselect from "../mymultiselect/MyMultiselect";
import { getAxiosAuthHeaders } from "../../App";

export default function SinglePost({post, setUpdatedPostAuthor}) {
    const { user, dispatch } = useContext(Context);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [updateMode, setUpdateMode] = useState(false);
    const [picture, setPicture] = useState(null);
    const [deleteOldPicture, setDeleteOldPicture] = useState(false);
    const [categories, setCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const multiSelectRef = useRef();
    const [vote, setVote] = useState(null);
    const [repScore, setRepScore] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    const [updatedPost, setUpdatedPost] = useState(null);
    const navigate = useNavigate();

    // extend the existing array of allowed tags and attributes
    const sanitizeConfig = { ADD_TAGS: ['iframe'], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'] };

    DOMPurify.addHook('uponSanitizeElement', (node, data) => {
        //if an iframe doesnt have all of the typical attributes assoc'd w/ ckeditor 
        //  (honestly not a great check but better than nothing)
        if (data.tagName === 'iframe' && 
            !(node.hasAttribute('style') && 
            node.hasAttribute('allow') && 
            node.hasAttribute('allowfullscreen') && 
            node.hasAttribute('frameborder') && 
            node.hasAttribute('src') )) {
                //console.log(node);
                //console.log(data);
            
                //remove its source
                node.src = '';
                data.attrValue = node.src;
        }
        return node;
    });

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

    useEffect(() => {
        const updateLocalPostFields = () => {
            //need for updating:
            setRepScore(updatedPost.reputation);

            if (updatedPost.badgeName) {
                post.badgeName = updatedPost.badgeName;
            }
            
        };
        if (updatedPost) {
            updateLocalPostFields(); 
        }
    }, [updatedPost])

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

    const handleDelete = async () => {
        try {

            const [axiosAuthHeaders, tokens] = await getAxiosAuthHeaders(user, dispatch);

            await axios.delete(`/posts/${post._id}`,
                {
                    data: { username: user.username },
                    headers: axiosAuthHeaders.headers
                },
            );

            navigate("/"); // go to home page if post deleted
        } catch (error) {
            
        }
        
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        const uploadedCategories = multiSelectRef?.current.getSelectedItems();

        const postUpdate = {
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
                postUpdate.photo = "";
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
                postUpdate.photo = response.data.url;
                //update local cache photo url
                post.photo = response.data.url; //need this for future file deletion
                //setPicture(response.data.url); //cant set this here bc url created from picture var
            } catch (error) {
                console.log(error);
            }
        }
        
        try {

            const [axiosAuthHeaders, tokens] = await getAxiosAuthHeaders(user, dispatch);

            await axios.put("/posts/" + post._id,
                postUpdate,
                axiosAuthHeaders
            );

            setUpdateMode(false); //dont needa update this way
        } catch (error) {
            console.log(error);
        }

        //reset deletion desires
        setDeleteOldPicture(false);

        //update categories
        setCategories(uploadedCategories);

        setErrorMsg("");
    }

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
                    <div className="singlePostCategory">
                        <MyMultiselect
                            displayValue={"name"}
                            options={allCategories}
                            setOptions={setAllCategories}
                            preSelectedOptions={categories}
                            placeholderTxt="Select categories..."
                            selectionLimit={3}
                            multiSelectRef={multiSelectRef}
                            setErrorMsg={setErrorMsg}
                        />
                    </div>
                    :
                    categories?.map((category, i) => (
                        <span className="singlePostCategory" key={i}>
                            <Link
                                to={`/?category=${category.name}`}
                                className="categoryBtn link">
                                    {category.name} 
                            </Link>
                        </span>
                    ))
                }
              </div>
              {errorMsg &&
                  <span className="singlePostVoteContainer">
                      <div className="responseMsg errorText">{errorMsg}</div>
                  </span>
              }
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
                                <Vote 
                                  voteType={VoteType.UPVOTE}
                                  hollowIcon={true}
                                  setVote={setVote}
                                  setVoteErrorMsg={setErrorMsg}
                                  setUpdatedLinkedModel={setUpdatedPost}
                                  setUpdatedAuthor={setUpdatedPostAuthor}
                                  linkedId={post?._id}
                                  existingVote={vote}
                                />
                                <Vote 
                                  voteType={VoteType.UPVOTE}
                                  hollowIcon={false}
                                  setVote={setVote}
                                  setVoteErrorMsg={setErrorMsg}
                                  setUpdatedLinkedModel={setUpdatedPost}
                                  setUpdatedAuthor={setUpdatedPostAuthor}
                                  linkedId={post?._id}
                                  existingVote={vote}
                                />
                            </div>
                            <div className="singlePostScoringIconPairing">
                                <Vote 
                                  voteType={VoteType.DOWNVOTE}
                                  hollowIcon={true}
                                  setVote={setVote}
                                  setVoteErrorMsg={setErrorMsg}
                                  setUpdatedLinkedModel={setUpdatedPost}
                                  setUpdatedAuthor={setUpdatedPostAuthor}
                                  linkedId={post?._id}
                                  existingVote={vote}
                                />
                                <Vote 
                                  voteType={VoteType.DOWNVOTE}
                                  hollowIcon={false}
                                  setVote={setVote}
                                  setVoteErrorMsg={setErrorMsg}
                                  setUpdatedLinkedModel={setUpdatedPost}
                                  setUpdatedAuthor={setUpdatedPostAuthor}
                                  linkedId={post?._id}
                                  existingVote={vote}
                                />
                            </div>
                        </>
                    }
                </div>
                {!updateMode && (post?.username === user?.username || user.isAdmin) &&
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
                <>
                    <p
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description, sanitizeConfig) }} 
                        className="singlePostDescription ck-content"
                    />
                </>
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
