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
                },
                fontColor: {
                    colors: [
                        {
                            color: 'hsl(0, 0%, 0%)',
                            label: 'Black'
                        },
                        {
                            color: 'hsl(0, 0%, 30%)',
                            label: 'Dim grey'
                        },
                        {
                            color: 'hsl(0, 0%, 60%)',
                            label: 'Grey'
                        },
                        {
                            color: '#e64d4d',
                            label: 'Red'
                        },
                        {
                            color: '#e6994d',
                            label: 'Orange'
                        },
                        {
                            color: '#e6e64d',
                            label: 'Yellow'
                        },
                        {
                            color: '#4de64d',
                            label: 'Green'
                        },
                        {
                            color: '#4d99e6',
                            label: 'Light Blue'
                        },
                        {
                            color: '#4d4de6',
                            label: 'Dark Blue'
                        },
                        {
                            color: '#994de6',
                            label: 'Purple'
                        },
                    ]
                },
                highlight: {
                    options: [
                        { model: 'yellowMarker', class: 'marker-yellow', title: 'Yellow Marker', color: 'var(--ck-highlight-marker-yellow)', type: 'marker' },
                        { model: 'greenMarker', class: 'marker-green', title: 'Green marker', color: 'var(--ck-highlight-marker-green)', type: 'marker' },
                        { model: 'pinkMarker', class: 'marker-pink', title: 'Pink marker', color: 'var(--ck-highlight-marker-pink)', type: 'marker' },
                        { model: 'blueMarker', class: 'marker-blue', title: 'Blue marker', color: 'var(--ck-highlight-marker-blue)', type: 'marker' },
                        { model: 'redMarker', class: 'marker-red', title: 'Red marker', color: 'red', type: 'marker' },
                    ]
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
