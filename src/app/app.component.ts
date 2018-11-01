import { Component } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as $ from 'jquery';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private serverUrl = 'http://localhost:8080/stomp/socket/?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDEwMTI4NjksInVzZXJfbmFtZSI6InRlc3QiLCJhdXRob3JpdGllcyI6WyJVU0VSIl0sImp0aSI6ImU3Y2U5YWU1LTE5NGMtNDY3OC1iZDg4LWVhNTk1ZDg5NDQyZSIsImNsaWVudF9pZCI6ImNsaWVudCIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdfQ.sqxIwdlEyDXoyOpcMR12IJxWeWzkfZOG_HPHputMWuM';
  private title = 'WebSockets chat';
  private stompClient;
  private sessionId = null;
  private sampleMessage = {
    "messageSender": "test",
    "messageReceiver": "nithin",
    "messageContent": "sample content"
  };

  private headers: HttpHeaders;

  constructor(private http: Http) {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    // this.http = new HttpClient();
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDEwMTI4NjksInVzZXJfbmFtZSI6InRlc3QiLCJhdXRob3JpdGllcyI6WyJVU0VSIl0sImp0aSI6ImU3Y2U5YWU1LTE5NGMtNDY3OC1iZDg4LWVhNTk1ZDg5NDQyZSIsImNsaWVudF9pZCI6ImNsaWVudCIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdfQ.sqxIwdlEyDXoyOpcMR12IJxWeWzkfZOG_HPHputMWuM'
    });

    const httpOptions = {
      headers: new Headers({
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDEwMTI4NjksInVzZXJfbmFtZSI6InRlc3QiLCJhdXRob3JpdGllcyI6WyJVU0VSIl0sImp0aSI6ImU3Y2U5YWU1LTE5NGMtNDY3OC1iZDg4LWVhNTk1ZDg5NDQyZSIsImNsaWVudF9pZCI6ImNsaWVudCIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdfQ.sqxIwdlEyDXoyOpcMR12IJxWeWzkfZOG_HPHputMWuM'
      })
    };

    this.http.get('http://localhost:8080/api/hello', httpOptions).subscribe(response => console.log(response));

    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      //setConnected(true);
      console.log(frame);
      var url = that.stompClient.ws._transport.url;
      console.log(that.stompClient.ws._transport.url);
      url = url
        .replace(
          "ws://localhost:8080/stomp/socket/",
          "");
      url = url.replace("/websocket", "");
      url = url.replace(/^[0-9]+\//, "");
      url = url.substring(0, url.indexOf("?"));
     
      console.log("Your current session is: " + url);
      that.sessionId = url;
      that.stompClient.subscribe("/user/rchat/chat/queue" + "-user" + that.sessionId, (message) => {

        if (message.body) {

          $(".chat").append("<div class='message'>" + message.body + "</div>")

        }
      });
      //console.log(that.sampleMessage);
      that.stompClient.send("/app/stomp/socket", {}, JSON.stringify(that.sampleMessage));
    });
  }

  sendMessage(text) {
    console.log(text);
    
    const newmessage:any = {
      
    };

    //newmessage.messageSender='test';
    newmessage.messageReceiver='test';
    newmessage.messageContent=text;
    this.stompClient.send("/app/stomp/socket", {}, JSON.stringify(newmessage));
    $('#input').val('');
  }

}
