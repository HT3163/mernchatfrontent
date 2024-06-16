import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import "./MessageForm.css";
import EmojiPicker from 'emoji-picker-react'
import Picker from "emoji-picker-react";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAlt";
import axios from 'axios';
import FileDownload from './FileDownload';


function MessageForm() {

    const [showPicker, setShowPicker] = useState(false);
    const [message, setMessage] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);

    const onEmojiClick = (event) => {
        setMessage((prevInput) => prevInput + event.emoji);
        setShowPicker(false);
    };

        // download start code

    // const [uploadedFile, setUploadedFile] = useState(null);
    console.log("he:",uploadedFile)

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('https://mernchat-backend-b97caa5ceba8.herokuapp.com/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      setUploadedFile(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDownload = (file) => {
    console.log("this is hamza tahir")
    if (file) {
      const downloadUrl = `https://mernchat-backend-b97caa5ceba8.herokuapp.com/api/download/${file.filename}`;
      window.open(downloadUrl, '_blank');
    }
  };



    const user = useSelector((state) => state.user);
    const { socket, currentRoom, setMessages, messages, privateMemberMsg } = useContext(AppContext);
    const messageEndRef = useRef(null);




    useEffect(() => {
        scrollToBottom();
    }, [messages, showPicker, uploadedFile]);

    function getFormattedDate() {
        const date = new Date();
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString();

        month = month.length > 1 ? month : "0" + month;
        let day = date.getDate().toString();

        day = day.length > 1 ? day : "0" + day;

        return month + "/" + day + "/" + year;
    }

    function handleSubmit(e) {
        e.preventDefault();
    }

    function scrollToBottom() {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const todayDate = getFormattedDate();

    socket.off("room-messages").on("room-messages", (roomMessages) => {
        setMessages(roomMessages);
    });

    function handleSubmit(e) {
        e.preventDefault();
        
        // if (!message || !uploadedFile) return;
        console.log("hi")
        const today = new Date();
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        const time = today.getHours() + ":" + minutes;
        const roomId = currentRoom;
        socket.emit("message-room", roomId, message, user, time, todayDate, uploadedFile);
        setMessage("");
        setUploadedFile(null)
    }





    return (
        <>
            <div className="messages-output">
                {user && !privateMemberMsg?._id && <div className="alert alert-info">You are in the {currentRoom} room</div>}
                {user && privateMemberMsg?._id && (
                    <>
                        <div className="alert alert-info conversation-info">
                            <div>
                                Your conversation with {privateMemberMsg.name} <img src={privateMemberMsg.picture} className="conversation-profile-pic" />
                            </div>
                        </div>
                    </>
                )}
                {!user && <div className="alert alert-danger">Please login</div>}

                {user &&
                    messages.map(({ _id: date, messagesByDate }, idx) => (
                        <div key={idx}>
                            <p className="alert alert-info text-center message-date-indicator">{date}</p>
                            {messagesByDate?.map(({ content, time, from: sender,file }, msgIdx) => (
                                <div className={sender?.email == user?.email ? "message" : "incoming-message"} key={msgIdx}>
                                    <div className="message-inner">
                                        <div className="d-flex align-items-center mb-3">
                                            <img src={sender.picture} style={{ width: 35, height: 35, objectFit: "cover", borderRadius: "50%", marginRight: 10 }} />
                                            <p className="message-sender">{sender._id == user?._id ? "You" : sender.name}</p>
                                        </div>
                                        <p className="message-content">{content}</p>
                                        <p className="message-timestamp-left">{time}</p>
                                        <p>{file? file.filename: ""}</p>
                                        {file? <button onClick={()=> handleDownload(file)}>Download File</button> : ""}
                                        {/* <button onClick={()=> handleDownload(file)}>Download File</button> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                <div ref={messageEndRef} />
            </div>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={10}>
                        <Form.Group>
                            <Form.Control type="text" placeholder="Your message" disabled={!user} value={message} onChange={(e) => setMessage(e.target.value)}></Form.Control>
                        </Form.Group>
                    </Col>
                    
                
                    <Col md={1}>
                        <img style={{height: '-webkit-fill-available'}} className="emoji-icon" src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg" onClick={() => setShowPicker((val) => !val)}/>
                        {showPicker && (<Picker pickerStyle={{ width: "100%" }} onEmojiClick={onEmojiClick} />)}
                        {/* <div>
                        <h1>File Upload and Download Example</h1>
                        <FileDownload onFileUpload={handleFileUpload} />
                        {uploadedFile && (
                            <div>
                            <p>Uploaded file: {uploadedFile.originalname}</p>
                            <button onClick={handleDownload}>Download File</button>
                            </div>
                        )}
                        </div> */}
                        
                    </Col>
                    <Col md={1}>
                        <Button variant="primary" type="submit" style={{ width: "100%", backgroundColor: "orange" }} disabled={!user}>
                            <i className="fas fa-paper-plane"></i>
                        </Button>
                    </Col>
                </Row>
            </Form>
            <div>
                        {/* <h1>File Upload and Download Example</h1> */}
                        <FileDownload onFileUpload={handleFileUpload} />
                        {uploadedFile && (
                            <div>
                            <p>Uploaded file: {uploadedFile.originalname}</p>
                            {/* <button onClick={handleDownload}>Download File</button> */}
                            </div>
                        )}
                        </div>
        </>
    );
}

export default MessageForm;
