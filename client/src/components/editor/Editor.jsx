import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Editor as CustomEditor } from 'ckeditor5-custom-build/build/ckeditor';
import "./Editor.css";

export default function Editor({setDescription, defaultText="<p>Tell your story...</p>"}) {


    return (
        <div>
            <CKEditor
                editor={CustomEditor}
                data={defaultText}
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                    /*editor.editing.view.change((writer) => {
                        writer.setStyle(
                            "width",
                            "200px",
                            editor.editing.view.document.getRoot()
                        );
                    });*/
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setDescription(data);
                    console.log({ event, editor, data });
                }}
            />
        </div>
  )
}
