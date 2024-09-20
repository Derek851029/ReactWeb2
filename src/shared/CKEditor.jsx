import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
/*import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';*/
/*import ClassicEditor from '@ckeditor/ckeditor5-build-classic';*/
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
//import { Essentials } from '@ckeditor/ckeditor5-essentials';
//import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
//import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';

const CKEditorComponent = (props) => {

    useEffect(() => {

    }, [props.contentData])

    return (
        <div className="document-editor">
            <CKEditor
                disabled={props.editorDisable ?? false }
                editor={DecoupledEditor}
                data={props.contentData ?? ""}
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                    editor.ui.getEditableElement().parentElement.insertBefore(
                        editor.ui.view.toolbar.element,
                        editor.ui.getEditableElement()
                    );

                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    props.setContentData(data);
                    if (props.form) {
                        props.form.setFieldsValue({ draw_note : data})
                    }
                    console.log(data);
                }}
                onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                }}
            />
        </div>
    );
}

export default CKEditorComponent;