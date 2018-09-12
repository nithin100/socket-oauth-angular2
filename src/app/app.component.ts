import { Component } from '@angular/core';
import {HttpHeaders,HttpClient} from '@angular/common/http';
import {Http,Headers} from '@angular/http';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private serverUrl = 'http://localhost:8080/stomp/socket/?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzY3MzcyNjAsInVzZXJfbmFtZSI6Im5pdGhpbmdhbmppIiwiYXV0aG9yaXRpZXMiOlsiVVNFUiJdLCJqdGkiOiI0NmUzMDYyZS1lMTI1LTRjZDYtYTMwMi02NWNhODNmZWNmZjUiLCJjbGllbnRfaWQiOiJjbGllbnQiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXX0.fnMzJAGailFKh96--kZyVKwAHFqxdvytfhT-dvg1sLM';
  private title = 'WebSockets chat';
  private stompClient;
  private sessionId=null;
  private sampleMessage={
                        "messageSender":"sample",
                        "messageReceiver":"nithinganji",
                        "messageContent":"sample content"};

  private headers:HttpHeaders; 
  
  constructor(private http:Http){
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection(){
    // this.http = new HttpClient();
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzY3MzcyNjAsInVzZXJfbmFtZSI6Im5pdGhpbmdhbmppIiwiYXV0aG9yaXRpZXMiOlsiVVNFUiJdLCJqdGkiOiI0NmUzMDYyZS1lMTI1LTRjZDYtYTMwMi02NWNhODNmZWNmZjUiLCJjbGllbnRfaWQiOiJjbGllbnQiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXX0.fnMzJAGailFKh96--kZyVKwAHFqxdvytfhT-dvg1sLM'
    });

    const httpOptions = {
      headers: new Headers({
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzY3MzcyNjAsInVzZXJfbmFtZSI6Im5pdGhpbmdhbmppIiwiYXV0aG9yaXRpZXMiOlsiVVNFUiJdLCJqdGkiOiI0NmUzMDYyZS1lMTI1LTRjZDYtYTMwMi02NWNhODNmZWNmZjUiLCJjbGllbnRfaWQiOiJjbGllbnQiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXX0.fnMzJAGailFKh96--kZyVKwAHFqxdvytfhT-dvg1sLM'
      })
    };

    //this.http.get('http://localhost:8080/api/hello',httpOptions).subscribe(response=>console.log(response));

     let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({"message":"CONNECT"}, function(frame) {
      //setConnected(true);
      var url = that.stompClient.ws._transport.url;
      console.log(that.stompClient.ws._transport.url);
      url = url
          .replace(
              "ws://localhost:8080/stomp/socket/",
              "");
      url = url.replace("/websocket", "");
      url = url.replace(/^[0-9]+\//, "");
      url = url.substring(0,url.indexOf("?"));
      //console.log(url.substring(0,url.indexOf("?")));
      console.log("Your current session is: " + url);
      that.sessionId = url;
      that.stompClient.subscribe("/user/rchat/chat/queue"+"-user"+that.sessionId, (message) => {
        if(message.body) {
          $(".chat").append("<div class='message'>"+message.body+"</div>")
          console.log(message.body);
        }
      });
      //console.log(that.sampleMessage);
      that.stompClient.send("/app/stomp/socket",{},JSON.stringify(that.sampleMessage));
    });
  }
/*
  sendMessage(message){
    this.stompClient.send("/app/send/message" , {}, message);
    $('#input').val('');
  } */
  
}
