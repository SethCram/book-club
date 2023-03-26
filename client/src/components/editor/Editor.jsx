import { CKEditor } from '@ckeditor/ckeditor5-react';
//import { Editor as CustomEditor } from 'ckeditor5-custom-build/build/ckeditor';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import "./Editor.css";
import axios from 'axios';

export default function RFC_CkEditor({setDescription, defaultText="<p>Tell your story...</p>"}) {

    function uploadAdapter(loader) {
        return {
            upload: () => {
                return new Promise((resolve, reject) => {
                    const body = new FormData();
                    loader.file.then((file) => {
                        const fileName = Date.now() + file.name;
                        body.append("name", fileName);
                        body.append("file", file);
                        axios.post("/upload", body)
                            //.then((response) => response.json())
                            .then(response => {
                                resolve({ default: response.data.url })
                            })
                            .catch(err => {
                                reject(err);
                            });
                    })
            })
        }}
    }

    function uploadPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = loader => {
            return uploadAdapter(loader);
        }
    }

    return (
        <CKEditor
            editor={Editor}
            data={defaultText}
            config={{
                extraPlugins: [uploadPlugin],
                mediaEmbed: {
                    previewsInData: true,
                    removeProviders: [ 'instagram', 'twitter', 'googleMaps', 'flickr', 'facebook' ]
                }
            }}
            onReady={editor => {
                // You can store the "editor" and use when it is needed.
                console.log('Editor is ready to use!', editor);
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                setDescription(data);
                //console.log({ event, editor, data });
            }}
        />
  )
}
