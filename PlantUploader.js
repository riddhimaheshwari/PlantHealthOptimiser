import React, { Component } from "react";
import PlantInfo from "./PlantInfo";
import plantData from "../data/plantdetails.json";
import LOADING_ICON from "./../images/loading.gif";
import { withRouter } from "react-router-dom";
import Modal from "react-modal";

import PlantModal from "./PlantModal";

class PlantUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragOver: false,
      file: null,
      responseData:null,
      loading:false
    };
  }

  handleDropFile = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      let file = e.dataTransfer.files[0];
      this.setState({ file: file });
      this.setState({ dragOver: false });
      //this.props.onChange(file);
    }
  };
  handleOnDragOver = (e) => {
    this.setState({ dragOver: true });
    e.stopPropagation();
    e.preventDefault();
  };

  handleFileChange = (e, type) => {
    var self = this;
    if (e.target.files.length > 0) {
      let file = e.target.files[0];

      this.setState({ file: file });
      //this.props.onChange(file);
    }
  };

  analyseImage = async function() {
    var self = this;
    let uploadedFile = self.state.file;
    console.log("file", file);
    let fileDetail = null;
    let file = null;
    self.setState({loading:true});

    if (uploadedFile instanceof File) {
      let reader = new FileReader();
      reader.readAsDataURL(uploadedFile);
      fileDetail = new Promise((resolve) => {
        reader.onload = (evnt) => {
          let fileData = evnt.target.result;
          fileData = fileData.replace(`data:${uploadedFile.type};base64,`, "");
          fileDetail = {
            ContentType: uploadedFile.type,
            Name: uploadedFile.name,
            Data: fileData,
          };
          resolve();
        };
      });
    }
    let res = await Promise.resolve(fileDetail).then(() => {
     
      let api_token = "9890b0728f9649ab8f633f24d7ae2d9e";
      let body = {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Is plant healthy?Tell me the possible disease and solutions"},
              {
                type: "image_url",
                image_url: {
                  url: `data:${fileDetail.ContentType};base64,${fileDetail.Data}`,
                },
              },
            ],
          },
        ],
        max_tokens: 512,
        stream: false,
      };

      fetch("https://api.aimlapi.com/chat/completions", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin": ["http://localhost:3000"],
          "Content-Type": "application/json",
          Authorization: `Bearer ${api_token}`,
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => {
          self.setState({responseData:data.choices,loading:false})
        });
    });
  };

  render() {
    let file = this.state.file;
    return (
      <div>
        <div className="div-center"><img src="./images/uploader.png"></img></div>
        <div className="fileContainer">
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            name="fileUpload"
            hidden={true}
            onChange={this.handleFileChange}
          />

          <label
            htmlFor="file-upload"
            id="file-drag"
            className={"drag-drop-zone " + (this.state.dragOver ? "hover" : "")}
            onDrop={this.handleDropFile}
            onDragOver={this.handleOnDragOver}
          >
            {file &&
              <img
                src={URL.createObjectURL(this.state.file)}
                className="image-size"
              />
             }
          </label>
          <div className="div-center pt-1">
            <a className="btn" onClick={() => this.analyseImage()}  style={{pointerEvents:this.state.loading?'none':'all'}}>
              ANALYSE {this.state.loading &&<span className="pl-pt2"><img className="img-loader" src={LOADING_ICON} ></img></span>}
            </a>
            
          </div>
        </div>
        <div>
        <Modal  isOpen={this.state.responseData} style={{
              content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              width: '600px',
              maxHeight:'600px',
              transform: 'translate(-50%, -50%)',
              overflowY: 'scroll'
            }
          }
          }>
            <div>
              <div className="pb-1"><b>Plant Condition</b></div>
              <div><ul className="plant-detail-text"> {this.state.responseData && this.state.responseData.map(p=><li>{p.message.content}</li>)}</ul></div>
              <div className="ok-btn-div"><a className="btn"  onClick={()=>{this.setState({responseData:null}) }}>OK</a> </div>
            </div>
            </Modal>  
        </div>
      </div>
    );
  }
}

export default withRouter(PlantUploader);
