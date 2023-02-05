import "./SinglePost.css"
import { Link } from "react-router-dom"
import { useContext, useEffect, useRef, useState } from "react"
import axios from "axios"
import { Context } from "../../context/Context";
import { imagesFolder } from "../../pages/settings/Settings";
import Multiselect from "multiselect-react-dropdown";

export default function SinglePost({post}) {
    const { user } = useContext(Context);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [updateMode, setUpdateMode] = useState(false);
    const [picture, setPicture] = useState(null);
    const [deleteOldPicture, setDeleteOldPicture] = useState(false);
    const [allCategories, setAllCategories] = useState([]);
    const multiSelectRef = useRef();

    //retrieve post according to postId
    useEffect(() => {
        const updateLocalPostFields = () => {
            //need for updating:
            setTitle(post?.title);        
            setDescription(post?.description);  
        };
        updateLocalPostFields();      

    }, [post]) //rerun when postId changes

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

        const updatedPost = {
            username: user.username,
            title,
            description
        };

        const actuallyDeleteOldPicture = deleteOldPicture && post.photo !== "";

        //console.log(post.photo);

        //if want to delete old pic and there is one, delete it
        if (actuallyDeleteOldPicture)
        {
            try {
                //rm from post
                updatedPost.photo = "";
                
                //delete from FS
                await axios.delete("/photo/delete/", {
                    data: { filePath: post.photo }
                });

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

            updatedPost.photo = imagesFolder + fileName;

            try {
                await axios.post("/upload", data);
            } catch (error) {
                
            }
        }
        
        try {
            await axios.put("/posts/" + post._id, updatedPost);

            setUpdateMode(false); //dont needa update this way
        } catch (error) {
            
        }

        //reset deletion desires
        setDeleteOldPicture(false);

        //if old pic deletion attempted, reload window
        if (actuallyDeleteOldPicture) {
            window.location.reload(); //reload page to allow old image to dissapear
        }
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

              {updateMode &&  //why can we use 'writeIcon' class here?
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
                        onSearch={function noRefCheck(){}}
                        onSelect={function noRefCheck(){}} // Function will trigger on select event
                        onRemove={function noRefCheck(){}} // Function will trigger on remove event
                        displayValue="name" // Property name to display in the dropdown options
                        options={allCategories}
                        selectedValues={post?.categories}
                        placeholder="Select categories..."
                        selectionLimit={3}
                        showArrow
                        showCheckbox
                        avoidHighlightFirstOption
                        ref={multiSelectRef}
                        style={{
                        searchBox: {
                            border: 'none',
                        },
                        chips: {
                            'background': '#be9656',
                        }
                        }}
                    /> :
                    post?.categories.map((category, i) => (
                        <span className="singlePostCategory" key={i}>
                            <Link to={`/?category=${category.name}`} className="link">{category.name}</Link>
                        </span>
                    ))
                }
              </div>
              {updateMode ?
                <input type="text"
                    value={title}
                    className="singlePostTitleInput"
                    autoFocus={true} 
                    onChange={(event)=>setTitle(event.target.value)}
                /> : 
                  <h1 className="singlePostTitle">
                    {title}
                    {post?.username === user?.username && // ? indicates only do comparison if user != null
                        <div className="singlePostIcons">
                            <i className="singlePostIcon fa-regular fa-pen-to-square" onClick={()=>setUpdateMode(true)}></i>
                            <i className="singlePostIcon fa-regular fa-trash-can" onClick={handleDelete}></i>
                        </div>
                    }
                </h1>
              }
                  
              
              <div className="singlePostInfo">
                  <span className="singlePostAuthor">
                      Author:
                      <Link className="link" to={`/?username=${post?.username}`}>
                          <b>
                            {post?.username /* needa use ? for as long as post is passed in, since it's retrieved via async funct */ }
                          </b>
                      </Link>
                  </span>
                  <span className="singlePostDate">Published: <b>{new Date(post?.createdAt).toDateString()}</b></span>
              </div>
              {updateMode ?
                <input
                    type="text"
                    value={description}
                    className="singlePostDescriptionInput" 
                    onChange={(event)=>setDescription(event.target.value)}
                /> :
                <p className="singlePostDescription">
                    {description}
                </p>
              }
              {updateMode && 
                <button
                  className="singlePostUpdateButton"
                  onClick={handleUpdate}
                >
                    Update
                </button>
              }
          </div>
      </div>
  )
}
