// initialize a connection with a websocket
let ws = new WebSocket("ws://" + location.hostname + ":" + 7070 + "/crazyeight");


// get the submit button
const btn = document.getElementById('submit')



// submit button takes the users entered name and sends it to the websocket
// then removes the name submit form
btn.addEventListener('click',(event) =>{
    let name = document.getElementById('name');
    var namev = name.value

    if(name.length != 0){
        const request = {
                    name: namev,
                    command : "join"
                }
        ws.send(JSON.stringify(request))

        const form = document.getElementById('join-form')
        form.style.display = 'block'
        event.preventDefault();  // to not refresh the page
        // form.remove() // remove the form

        toggle('join-form')

        }
    else{
        alert("name cant be empty")
    }
})



function toggle(selector){
    const form = document.getElementById(selector)
        if(form.style.display == 'none'){
            form.style.display = 'block';
        }
        else{
            form.style.display = 'none';
        }
    }

ws.addEventListener('message', (event) => {
    let data = JSON.parse(event.data);
    console.log(data);
    if(data.messageType == 'gameplay'){

    const suits = createSuitSelection()

        data = {
            cardList : data.cards,
            centreCard : data.centreCard,
            playerName: data.playerName,
            otherPlayerCards: Array.from({length:data.otherPlayerCards},(_,i) => i+1),
            currentPlayer : data.currentPlayer
        }
        
    
        var template = Handlebars.compile(document.querySelector('#currentPlayerCards').innerHTML)
        var filled = template(data);
        document.querySelector("#output").innerHTML = filled;
        

        if(data.playerName == data.currentPlayer){
            console.log("they do")
            var div = document.getElementById("playerCards")
            if(div != null){
                console.log('it exits')

                // div.style.backgroundColor = "black"
            }
        }
        
        let cardButtons = document.querySelectorAll('#cards')

        cardButtons.forEach((item) => {
            item.addEventListener('click',async function(e){

                
                // toggle('suitSelection')

                let cardType = e.target.parentNode.value.split("_");
                
                data = {
                    command: 'gameplay',
                    action: 'discard',
                    card: {suit:cardType[1], number:cardType[0]}
                }
                
                if(cardType[0] == "8"){
                    
                    console.log(item.getBoundingClientRect())
                    
                    toggle('suitSelection')
                    
                    await myFunc()
                    let suit = getSuit();
                    console.log(suit)
                    data.arguments = suit
                }
                ws.send(JSON.stringify(data))
            })
        })

        let stockPile = document.querySelector('#stockPile')
        stockPile.addEventListener('click',function(e){
            data = {
                command: 'gameplay',
                action: 'pickUpCard',
            }
            ws.send(JSON.stringify(data))
        })
    }
    
    if(data.messageType == 'waitingPlayers'){
        data = {
            message : data.message,
            playerName: data.playerName
        }
        var template = Handlebars.compile(document.querySelector('#serverMessages').innerHTML)
        var filled = template(data);
        document.querySelector("#output").innerHTML = filled;
    }

    if(data.messageType == 'nameTaken'){
        data = {
            message : data.message,
            playerName: data.playerName
        }
        var template = Handlebars.compile(document.querySelector('#serverMessages').innerHTML)
        var filled = template(data);
        document.querySelector("#output").innerHTML = filled;
        toggle('join-form')
    }
})

// A helper function for handlebars to check if 2 values are equal or the same
Handlebars.registerHelper('ifEquals', function (a, b, options) {
    if (a == b) { return options.fn(this); }
    return options.inverse(this);
});

function  createSuitSelection(){
    const suitSelector = document.createElement('div');
    suitSelector.setAttribute('id','suitSelection')
    
    const listOfSuits = document.createElement('ul')
    
    const heartsButton = document.createElement('button')
    heartsButton.innerText = 'H'
    // heartsButton.setAttribute('value','Hearts')
    heartsButton.setAttribute('class','suits')


    const spadesButton = document.createElement('button')
    spadesButton.innerText = 'S'
    // spadesButton.setAttribute('value','Spades')
    spadesButton.setAttribute('class','suits')

    const clubsButton = document.createElement('button')
    clubsButton.innerText = 'C'
    // clubsButton.setAttribute('value','Clubs')
    clubsButton.setAttribute('class','suits')

    const diamondsButton = document.createElement('button')
    diamondsButton.innerText = 'D'
    // diamondsButton.setAttribute('value','Diamonds')
    diamondsButton.setAttribute('class','suits')

    listOfSuits.appendChild(heartsButton);
    listOfSuits.appendChild(spadesButton);
    listOfSuits.appendChild(clubsButton);
    listOfSuits.appendChild(diamondsButton);

    suitSelector.appendChild(listOfSuits)

    suitSelector.style.display = 'none';

    document.body.appendChild(suitSelector)


    const suits = document.querySelectorAll('.suits')
    



    suits.forEach((item) => {
        item.addEventListener('click',function(e){
            let suit =  e.target.innerText
            item.setAttribute('value',suit)
        })
    })

    return suitSelector
    
}

function waitForClick(){
    return new Promise( resolve => {
        const buttons = document.querySelectorAll('.suits');

        function clickHandler(event){
            // console.log(event.target.value)
            event.target.setAttribute('value',event.target.value)
            resolve()
        }

        buttons.forEach(button => button.addEventListener('click',event =>clickHandler(event)))
    })
}

async function myFunc(){
    await waitForClick()
    console.log('button clicked')
}

function getSuit(){
    const suits = document.querySelectorAll('.suits')
    let selected = '';
    for(let i = 0; i < suits.length;i++){
        if(suits[i].value){
            selected = suits[i].value
        }
    }
    const suitSelector = document.getElementById('suitSelection')
    suitSelector.remove()
    return selected
}
// ws.onclose = () => alert("WebSocket connection closed");

// // Add event listeners to button and input field
// id("send").addEventListener("click", () => sendAndClear(id("message").value));
// id("message").addEventListener("keypress", function (e) {
//     if (e.keyCode === 13) { // Send message if enter is pressed in input field
//         sendAndClear(e.target.value);
//     }
// });

// function sendAndClear(message) {
//     if (message !== "") {
//         ws.send(message);
//         id("message").value = "";
//     }
// }

// function updateChat(msg) { // Update chat-panel and list of connected users
//     let data = JSON.parse(msg.data);
//     id("chat").insertAdjacentHTML("afterbegin", data.userMessage);
//     id("userlist").innerHTML = data.userlist.map(user => "<li>" + user + "</li>").join("");
// }