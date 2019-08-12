import React from 'react';
import $ from 'jquery'; 
import './App.css';
import * as firebase from 'firebase'

var firebaseConfig = 
{
  apiKey: "AIzaSyDmSPesO8K2u-Fvxb8rNRwV88z9_jwbus0",
  authDomain: "pizzadetailer-f5175.firebaseapp.com", 
  databaseURL: "https://pizzadetailer-f5175.firebaseio.com",
  projectId: "pizzadetailer-f5175",
  storageBucket: "pizzadetailer-f5175.appspot.com",
};
firebase.initializeApp(firebaseConfig);

class App extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      userName: '',
      userNumber: '',
      toppingInput: '',
      list: [],
      confirmation: '',
      selected: '',
    }
  }

  changeUserName(input)
  {
    this.setState
    (
      {
        userName: input
      }
    );
  }

  errName()
  {
    var name = document.getElementById("nameBox");
    var letters = /^[A-Za-z]+$/;
    if(name.value.match(letters) && name.value.length > 1)
    {
      return true;
    }
    else
    {
      alert("Must Enter Valid Name");
    }
  }

  changeUserNumber(input)
  {
    this.setState
    (
      {
        userNumber: input
      }
    );
  }

  errNumber()
  {
    var number = document.getElementById("numberBox");
    var phoneRe = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/;
    var digits = number.value.replace(/\D/g, "");
    if( phoneRe.test(digits))
    {
      return true;
    }
    else
    { 
      alert("Must Enter Valid Phone Number");
    }
  }

  changeToppingInput(input)
  {
    this.setState
    (
      {
        toppingInput: input
      }
    );
  }

  addToList(input)
  {
    var listArray = this.state.list;
    listArray.push(input);
    this.setState
    (
      {
        list: listArray,
        toppingInput: ''
      }
    );
  }

  funky()
  {
    var chx = document.getElementsByName('myRadio');
    for (var i=0; i<chx.length; i++) 
    {
      if (chx[i].checked)
       {
        return true;
       } 
    }
    alert("Must choose pizza size")
  }

  submission()
  {

    if(this.errName() == true && this.errNumber() == true && this.funky() == true)
   {
      var user = this.state.userName;
      var number = this.state.userNumber;

      this.setState
      (
        {
          confirmation: "Thanks for your order " + user + ". We will call you when your pizza ia ready at " + number 
        }
      );

      $( "#userInfo" ).fadeOut();
      $( "#ToppingInfo" ).fadeOut();
      $( "#After" ).delay(500).fadeIn();

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      var todayDate = mm + '/' + dd + '/' + yyyy;
      var time = today.getHours() + "h:" + today.getMinutes() + "m:" + today.getSeconds() + "s" ;

      var totalTimeAndDate = time + " on  " + todayDate;

      const rootRef = firebase.database().ref();
      const storesRef = rootRef.child('Orders');
      const newStoreRef = storesRef.push();
      newStoreRef.set
      ({
        Name: this.state.userName,
        Number: this.state.userNumber,
        Time: totalTimeAndDate,
        PizzaSize: this.state.selected,
        Toppings: this.state.list
      });
   }
    
  }

 


  render()
  {
    return (
      <div id="Everything">
        <div class="topnav">
           <a class="active" href="#home">Welcome to Pizza Detailer</a>
       </div>
        <div id="userInfo">
          <input placeholder="Enter name" id="nameBox" className="boxy" onChange={ (e)=>this.changeUserName(e.target.value)} value={this.state.userName} type="text" /> 
          <br/>
          <input placeholder="Enter number" id="numberBox" className="boxy"  onChange={ (e)=>this.changeUserNumber(e.target.value)} value={this.state.userNumber} type="text" />
        </div>

        <div id="ToppingInfo">

          <div id="sizes">
            <input type='radio' id='small' className="form-radio" name='myRadio' value="Small Pizza"
              checked={this.state.selected === 'Small Pizza'} onChange={(e) => this.setState({ selected: e.target.value})} />Small
        
            <input type='radio' id='medium' className="form-radio" name='myRadio' value='Medium Pizza' 
              checked={this.state.selected === 'Medium Pizza'} onChange={(e) => this.setState({ selected: e.target.value })} />Medium
         
            <input type='radio' id='large' className="form-radio" name='myRadio' value='Large Pizza' 
              checked={this.state.selected === 'Large Pizza'} onChange={(e) => this.setState({ selected: e.target.value })} />Large
          </div>

        
            <input placeholder="Enter detail" className="boxy" onChange={ (e)=>this.changeToppingInput(e.target.value)} value={this.state.toppingInput} type="text"/>
            <button onClick={ ()=> this.addToList(this.state.toppingInput)}>Add</button><br/>
            <span id="example">Ex. Olives on one half of the pizza</span>
            <ul>
            {this.state.list.map( (val)=> <li>{val}</li>)}
            </ul>
       

          <button id="submitter" onClick={ ()=> this.submission(this.state.confirmation)}>Order Pizza</button>
          
        </div>

        <div id="After" >
          <p>{this.state.confirmation}</p>  
          <p>Your order details are below:</p>  
          <p>{this.state.selected}</p>
          <ul>
            {this.state.list.map( (val)=> <li>{val}</li>)}
          </ul>
        </div>

      </div>
      );
  }
}

export default App;
