import "./WritePage.css"

export default function WritePage() {
  return (
      <div className='writePage'>
          <img 
              className="writeImg"
              src="https://upload.wikimedia.org/wikipedia/en/3/37/Dog_with_a_Blog_Logo.png"
              alt=""
          />
          <form className='writeForm'>
              <div className='writeFormGroup'>
                  <label htmlFor='fileInput'>
                    <i className="writeIcon fa-solid fa-plus"></i>
                  </label>
                  <input
                      type='file'
                      id='fileInput'
                      style={{ display: "none" }}
                  />
                  <input
                      className='writeInput'
                      type='text'
                      placeholder='Title'
                      autoFocus={true}
                  />
              </div>
              <div className="writeFormGroup">
                  <textarea className="writeInput writeText" placeholder="Tell your story..." type="text"></textarea>
              </div>
              <button className="writeSubmit">Publish</button>
          </form>
    </div>
  )
}
