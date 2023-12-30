import '../App.css';
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function BlogEditor() {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  return (
    <>
      <div className='blog-editor'>
        <Editor
          apiKey='culv1et9w5eu1ohce78h9mzcndr0as09n8clgz6l7pb5lk1p'
          onInit={(evt, editor) => editorRef.current = editor}
          initialValue=""
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
        />
      </div>
    </>
  );
}