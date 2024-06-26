import React, { useEffect, useRef } from "react";
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from "../actions";

const Editor = ({socketRef, roomId, onCodeChange}) =>{
    
    const editorRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current) {
            editorRef.current = Codemirror.fromTextArea(document.getElementById('realtimeEditor'), {
                mode: { name: 'javascript', json: true },
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            });

            editorRef.current.on('change', (instance, changes) =>{
                const {origin} = changes;
                const code = instance.getValue();
                
                onCodeChange(code);

                if(origin !== 'setValue'){
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                };
            });
        };

    }, []);

    useEffect(() =>{

        if(socketRef.current){

            socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) => {
                if(code !== null){
                    editorRef.current.setValue(code);
                };
            });

            socketRef.current.on(ACTIONS.FILE_UPLOAD, ({code}) => {
                if(code !== null){
                    editorRef.current.setValue(code);
                };
            });
        };
        
        return () => {
            if(socketRef.current){
                socketRef.current.off(ACTIONS.CODE_CHANGE);
                socketRef.current.off(ACTIONS.FILE_UPLOAD);
            };
        };

    }, [socketRef.current]);

    return(
            <textarea id="realtimeEditor"></textarea>
    )
}

export default Editor
