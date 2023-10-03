// initialize a connection with a websocket
let ws = new WebSocket("ws://" + location.hostname + ":" + 7070 + "/crazyeight");


// get the submit button
const btn = document.getElementById('submit')



// submit button takes the users entered name and sends it to the websocket
// then removes the name submit form
btn.addEventListener('click',(event) =>{
    let name = document.getElementById('name');
    var namev = name.value
    const request = {
                name: namev,
                command : "join"
            }
    ws.send(JSON.stringify(request))

    const form = document.getElementById('join-form')
    event.preventDefault();  // to not refresh the page
    form.remove() // remove the form

        });




ws.addEventListener('message', (event) => {
    let data = JSON.parse(event.data);

    if(data.messageType == 'gameplay'){

    
        data = {
            cardList : data.cards,
            centreCard : data.centreCard
        }
        

        var template = Handlebars.compile(document.querySelector('#currentPlayerCards').innerHTML)
        var filled = template(data);
        document.querySelector("#output").innerHTML = filled;
        
        
        let cardButtons = document.querySelectorAll('#cards')

        cardButtons.forEach((item) => {
            item.addEventListener('click',function(e){
                let cardType = e.target.parentNode.value.split("_");
                data = {
                    command: 'gameplay',
                    action: 'discard',
                    card: {suit:cardType[1], number:cardType[0]}
                }
                ws.send(JSON.stringify(data))
            })
        })

        let stockPile = document.querySelector('#stockPile')
        console.log(stockPile)

        stockPile.addEventListener('click',function(e){
            data = {
                command: 'gameplay',
                action: 'pickUpCard',
            }
            ws.send(JSON.stringify(data))
        })
    }
})

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