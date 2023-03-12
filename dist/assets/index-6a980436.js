(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const c=20;let o,y;function R(i){const e=i;i.addEventListener("dragstart",t=>{o=e,o.style.opacity=.3,y=o.style.border,o.style.border="thin solid #F5F5F5",t.dataTransfer.setData("text/plain",`${t.clientX},${t.clientY}`)}),i.addEventListener("dragover",t=>{t.preventDefault()}),i.addEventListener("dragend",()=>{o.parentElement.appendChild(o),o.style.opacity=1,o.style.border=y})}function C(i){i.addEventListener("dragenter",e=>{e.preventDefault()}),i.addEventListener("dragover",e=>{e.preventDefault()}),i.addEventListener("drop",e=>{e.preventDefault();const t=e.dataTransfer.getData("text/plain").split(",");let s=o.offsetLeft+(e.clientX-parseInt(t[0])),a=o.offsetTop+(e.clientY-parseInt(t[1]));s<c?s=c:s>i.clientWidth-c-o.clientWidth&&(s=i.clientWidth-c-o.clientWidth),a<c?a=c:a>i.clientHeight-c-o.clientHeight&&(a=i.clientHeight-c-o.clientHeight),o.style.left=s+"px",o.style.top=a+"px"})}const E=`:host{position:absolute;top:20px;left:20px;background-color:#4a464eee;width:300px;height:400px;border-radius:8px;border:2px outset rgba(44,44,46,.368);display:flex;flex-direction:column;margin:0;padding:0;box-sizing:border-box}:host(.light){background:radial-gradient(circle at 10% 20%,rgb(186,190,245) 0%,rgb(192,192,245) 33.1%,rgb(218,203,246) 90%)}nav{display:flex;justify-content:flex-end;align-items:center;padding:.3rem}.close{width:20px;height:20px;margin:5px;cursor:pointer;opacity:.8}.logo{margin-right:auto;width:27px;height:27px}
`;class m extends HTMLElement{constructor(e){super(),this.attachShadow({mode:"open"}),this.createStyle(E),this.classList.add("custom-app"),this.shadowRoot.appendChild(this.createNode(this._windowBox(e))),this.addEventListener("click",t=>{t.stopPropagation(),console.log("EVENT IN THE GLOBAL APPWINDOW",t),t.currentTarget.parentElement.appendChild(t.currentTarget)}),this.connected=!1,this.isRemoved=!1}connectedCallback(){this.customFocus(),this.initFlag||(this.draggable=!0,R(this),this.shadowRoot.querySelector(".close").addEventListener("click",this.closeWindow.bind(this)),this.initFlag=!0)}closeWindow(e){e&&e.stopPropagation(),this.isRemoved=!0,this.remove()}customFocus(){}addToHeader(e){this.shadowRoot.querySelector("nav").insertBefore(e,this.shadowRoot.querySelector(".close"))}createNode(e){const t=document.createElement("template");return t.innerHTML=e,t.content.cloneNode(!0)}createStyle(e){const t=document.createElement("style");t.appendChild(document.createTextNode(e)),this.shadowRoot.appendChild(t)}changeAppWindowDimensions(e,t){this.shadowRoot.host.style.width=e,this.shadowRoot.host.style.height=t}_windowBox(e){return`
      <nav> 
        <img class="logo" src=${e} alt="app icon">
        <img class="close" src="img/close.svg" alt="close button">
      </nav>
  `}}customElements.define("app-window",m);let n;const b=50;function T(){"chatCache"in localStorage?n=JSON.parse(localStorage.getItem("chatCache")):n=[]}function q(){return n}function A(i){n.push(i),n=[...new Set(n)],i.size>b&&(n=n.splice(i.size-b)),localStorage.setItem("chatCache",JSON.stringify(n))}function M(i,e){const t={name:i,time:e};let s=u();s==null&&(s=[]),s.push(t);const a=s.sort((r,l)=>r.time>l.time?1:r.time<l.time?-1:0);localStorage.setItem("timings",JSON.stringify(a.slice(0,5)))}function u(){return"timings"in localStorage?JSON.parse(localStorage.getItem("timings")):[]}function N(i){return`${i.name}: ${i.time} sec.`}const U=`.toggle-btn{position:relative;width:30px;height:14px;border:2px solid #2a2a2a;border-radius:20px;display:flex;justify-content:center;align-items:center;cursor:pointer;transition:.3s;margin-right:5px}.circle{position:absolute;left:0;width:14px;height:14px;border-radius:20px;background-color:#2a2a2a;transition:.3s}.active{border-color:#68478d}.active .circle{left:100%;transform:translate(-100%);transition:.3s;background-color:#68478d}.chat-messages{margin:0;padding:0;height:100%;background-color:#140ebe0f;overflow:auto;border-radius:5px}.user-input{min-width:90%;max-width:90%;min-height:3rem;max-height:3rem;align-self:center;margin:.25rem 0;border-radius:8px;padding:.3rem;font-family:sans-serif;font-size:.85rem;background-color:#fffd}textarea:focus{outline:none}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(136,136,136,.437);border-radius:10px}li{margin:.5rem 0;display:flex;flex-direction:column;gap:.4rem;font-family:sans-serif;font-size:.8rem;color:#cac6c6;letter-spacing:1px}li.light{color:#2e1a47}.message-header{background-color:#00000038;padding:.5rem;display:flex;justify-content:space-between}h4{margin:0;font-weight:600;border-radius:4px;max-width:50%;word-wrap:break-word}.timestamp{color:#979797;font-size:.7rem;margin:0}.timestamp.light{color:inherit}span{padding:0 .5rem;word-wrap:break-word}.register-user{margin:2rem 0;align-self:center;display:flex;flex-direction:column}.username{height:1.5rem;width:10rem;border-radius:5px;background-color:#fffd}.username:focus{outline:none}input[type=submit]{align-self:flex-start;border-radius:5px;font-weight:700;padding:5px;color:#000000b3;cursor:pointer;margin:1rem 0}.edit-username{display:flex;border-radius:15px;padding:2px;margin-right:3px}.edit-btn{padding:0;border:none;background-color:transparent;cursor:pointer;display:flex;justify-content:center}.edit-username-input{padding:0;width:0;background-color:#f5f5f5;border:none;border-radius:inherit;outline:none;transition:.6s}.editing{width:120px;padding:0 5px;margin-right:5px;transition:.5s}
`;class k extends m{isLightTheme=!1;isEditing=!1;isUsernameRegistered=!1;serverAddress="wss://courselab.lnu.se/message-app/socket";key="eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd";emojis={":)":"😀",":(":"🙁","<3":"♥️",xD:"😂",";)":"😉",":p":"😜",":'(":"😭",":*":"😘"};static{localStorage.removeItem("chat-register-user-dialog")}constructor(e){super(e),this.socket=new WebSocket(this.serverAddress),this._checkSocket(),this.socket.onclose=()=>{console.log("%cCurrent socket is closed","color: yellow;")},this.createStyle(U),!localStorage.getItem("chat-username")&&!localStorage.getItem("chat-register-user-dialog")?(console.log("-> user name input..."),localStorage.setItem("chat-register-user-dialog",!0),this.shadowRoot.appendChild(this.createNode(this._registerUserMarkup())),this.usernameField=this.shadowRoot.querySelector(".username"),this.usernameField.addEventListener("click",t=>t.stopPropagation()),this.shadowRoot.querySelector(".submit").addEventListener("click",this._submitUsername.bind(this)),this.isUsernameRegistered=!0):localStorage.getItem("chat-username")?(console.log("-> chat mode..."),this._prepareChatArea(),this.isUsernameRegistered=!0):console.log("-> nothing (preventing another user name input dialog)...")}disconnectedCallback(){this.isRemoved&&(console.log("%cClosing socket in the disconnected callback","color: yellow;"),this.socket.close(1e3,"Regular socket shutdown"),localStorage.removeItem("chat-register-user-dialog"))}_submitUsername(e){e.preventDefault(),e.stopPropagation();const t=this.usernameField.value.trim();t?(this.shadowRoot.removeChild(this.shadowRoot.querySelector("form")),localStorage.setItem("chat-username",t),localStorage.removeItem("chat-register-user-dialog"),this._prepareChatArea()):(alert("Invalid username. Please try again."),this.usernameField.value="")}_prepareChatArea(){const e=this.createNode(this._chatAreaMarkup());this.input=e.querySelector(".user-input"),this._prepareTextAreaForInput(),this.output=e.querySelector(".chat-messages"),q().forEach(t=>{this.output.appendChild(this.createNode(this._chatMessageMarkup(JSON.parse(t),"")))}),this._socketOnMessage(),this.shadowRoot.appendChild(e),this.addToHeader(this.createNode(this._editUsernameMarkup())),this.editUsernameDiv=this.shadowRoot.querySelector(".edit-username"),this.editUsernameInput=this.editUsernameDiv.querySelector(".edit-username-input"),this.shadowRoot.querySelector(".edit-btn").addEventListener("click",this._editUsername.bind(this)),this.editUsernameInput.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation()}),this.addToHeader(this.createNode(this._toggleThemeMarkup())),this.shadowRoot.querySelector(".toggle-btn").addEventListener("click",this._changeTheme.bind(this))}_prepareTextAreaForInput(){this.input.addEventListener("input",e=>{e.stopPropagation();for(const t in this.emojis){const s=e.target.value;e.target.value=s.replaceAll(t,this.emojis[t])}}),this.input.addEventListener("click",e=>{e.stopPropagation()}),this.input.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),this._sendMessage())})}_editUsername(e){e.preventDefault(),e.stopPropagation();const t=localStorage.getItem("chat-username");if(this.isEditing=!this.isEditing,this.isEditing)e.target.innerHTML=`
      ☑️`,this.editUsernameInput.value=t,this.editUsernameInput.focus(),this.editUsernameInput.classList.add("editing");else{e.target.innerHTML=`
      ✏️`;const s=this.editUsernameInput.value.trim();s?localStorage.setItem("chat-username",s):alert("New username is invalid."),this.editUsernameInput.classList.remove("editing"),this.editUsernameDiv.style.border="none"}}_changeTheme(e){e.preventDefault(),e.stopPropagation(),this.isLightTheme=!this.isLightTheme,this.isLightTheme?(e.currentTarget.classList.add("active"),this.shadowRoot.host.classList.add("light"),this.output.querySelectorAll("li").forEach(t=>{t.classList.add("light"),t.querySelector(".timestamp").classList.add("light")})):(e.currentTarget.classList.remove("active"),this.shadowRoot.host.classList.remove("light"),this.output.querySelectorAll("li").forEach(t=>{t.classList.remove("light"),t.querySelector(".timestamp").classList.remove("light")}))}_socketOnMessage(){this.socket.onmessage=e=>{const t=JSON.parse(e.data);if(t.type==="heartbeat")console.log(`%c${t.username} sends ${t.type}`,"color: green;");else{t.date=new Date().toLocaleString(),t.type!=="notification"&&A(JSON.stringify(t));const s=this.isLightTheme?"light":"";this.output.appendChild(this.createNode(this._chatMessageMarkup(t,s))),this.output.scrollTop=this.output.scrollHeight}}}_checkSocket(){if(!this.socket||this.socket.readyState===3)throw new Error(`Failed to connect to  ${this.serverAddress}`)}_sendMessage(){this._checkSocket();const e=this.input.value.trim();if(e){const t={type:"message",data:e,username:localStorage.getItem("chat-username"),channel:"my, not so secret, channel",key:this.key};this.socket.send(JSON.stringify(t))}this.input.value=""}_toggleThemeMarkup(){return`
    <div class="toggle-btn">
      <div class="circle"></div>
    </div>
    `}_editUsernameMarkup(){return`
    <div class="edit-username">
        <input type="text" class="edit-username-input" maxlength="15">
        <button class="edit-btn">
          ✏️
        </button>
      </div>
    `}_chatAreaMarkup(){return`
    <ul class="chat-messages"></ul>
    <textarea rows="2" class="user-input"></textarea>
    `}_chatMessageMarkup(e,t){return`
    <li class=${t}>
      <div class="message-header">
        <h4>${e.username}</h4>
        <p class="timestamp ${t}">${e.date}</p>
      </div>
      <span>${e.data}</span>
    </li>
    `}_registerUserMarkup(){return`  
    <form class="register-user">
      <input type="text" class="username" placeholder="Enter your username" maxlength="15"><br>
      <input type="submit" class="submit" value="Submit">
    </form> 
    `}}customElements.define("chat-app",k);const I=`.board-dimension{margin:auto;padding:0;letter-spacing:1px;font-family:sans-serif}.btn-board-dimension{margin:1rem .5rem;padding:.5rem;border-radius:5px;cursor:pointer}p{text-align:center;margin:0;padding:0;font-size:1rem;color:#cac6c6}.timer{align-self:center;letter-spacing:1px;font-family:sans-serif;font-size:1rem;color:#cac6c6;margin-right:auto}.memory-game{display:flex;flex-wrap:wrap;align-content:flex-start;background-color:#140ebe0f;perspective:1000px}.memory-card{border-radius:8px;border:2px outset rgba(44,44,46,.368);margin:5px;position:relative;transition:transform .4s;transform:scale(1);transform-style:preserve-3d}.memory-card:active{transform:scale(.95);transition:transform .2s}.memory-card.turn{transform:rotateY(180deg)}.memory-card:focus{outline:none;border:2px solid rgb(185,176,176)}.front{transform:rotateY(180deg)}.front,.back{width:100%;height:100%;position:absolute;backface-visibility:hidden}.out-of-game{opacity:.4}.game-result{width:inherit;height:inherit;margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px}p{text-align:center;margin:0 .5rem;padding:0;font-size:1rem;color:#cac6c6;letter-spacing:1px;font-family:sans-serif;word-break:break-all}.play-again{align-self:center;padding:10px;border-radius:5px;cursor:pointer}
`,d={TWOTWO:"2 x 2",TWOFOUR:"2 x 4",FOURFOUR:"4 x 4"};class _ extends m{state={first:null,second:null,flipped:!1,block:!1,flipCallBack:null,flippedCards:0,attempts:0,boardRows:0,boardCols:0,cards:null,timer:null,seconds:0};constructor(e){super(e),this.createStyle(I),this.addToHeader(this.createNode(this._timerMarkup())),this.addEventListener("keydown",t=>{if(console.log("Focusing and highlighting first active card"),t.stopPropagation(),this.state.cards){for(const s of this.state.cards)if(!s.classList.contains("out-of-game")){s.focus();return}}}),this._startNewGame()}disconnectedCallback(){this.state.cards&&this.state.cards.forEach(e=>e.blur()),this.isRemoved&&clearInterval(this.state.timer)}_startNewGame(){this.changeAppWindowDimensions("250px","250px"),this.shadowRoot.querySelector(".timer").innerHTML="00:00:00",this.shadowRoot.appendChild(this.createNode(this._chooseBoardMarkup())),this.shadowRoot.querySelectorAll(".btn-board-dimension").forEach(e=>e.addEventListener("click",t=>{t.stopPropagation(),this.shadowRoot.removeChild(this.shadowRoot.querySelector(".board-dimension")),this.state.timer=setInterval(()=>this._countTime(),1e3),this.shadowRoot.appendChild(this.createNode(this._gameAreaMarkup())),this.board=this.shadowRoot.querySelector(".memory-game"),this._createBoard(t.target.textContent),this.state.flipCallBack=this._turnCard.bind(this),this.state.cards=this.shadowRoot.querySelectorAll(".memory-card"),this.state.cards.forEach(s=>s.addEventListener("click",this.state.flipCallBack)),this.state.cards.forEach(s=>s.addEventListener("keydown",this._keyDownCallBack.bind(this))),this.customFocus()}))}_countTime(){++this.state.seconds;let e=Math.floor(this.state.seconds/3600),t=Math.floor((this.state.seconds-e*3600)/60),s=this.state.seconds-(e*3600+t*60);e<10&&(e=`0${e}`),t<10&&(t=`0${t}`),s<10&&(s=`0${s}`),this.shadowRoot.querySelector(".timer").innerHTML=`${e}:${t}:${s}`}_checkAndFocusCardAbove(e){const t=+e.dataset.x,s=+e.dataset.y;s>0&&(e.blur(),this.state.cards[(s-1)*this.state.boardCols+t].focus())}_checkAndFocusCardBelow(e){const t=+e.dataset.x,s=+e.dataset.y;s<this.state.boardRows-1&&(e.blur(),this.state.cards[(s+1)*this.state.boardCols+t].focus())}_checkAndFocusCardLeft(e){const t=+e.dataset.x,s=+e.dataset.y;t>0&&(e.blur(),this.state.cards[s*this.state.boardCols+t-1].focus())}_checkAndFocusCardRight(e){const t=+e.dataset.x,s=+e.dataset.y;t<this.state.boardCols-1&&(e.blur(),this.state.cards[s*this.state.boardCols+t+1].focus())}customFocus(){this.dispatchEvent(new KeyboardEvent("keydown"))}_createBoard(e){switch(e){case d.TWOTWO:this._board(2,2,"49%","49%","200px","200px");break;case d.TWOFOUR:this._board(2,4,"24%","49%","400px","200px");break;case d.FOURFOUR:this._board(4,4,"24%","24%","400px","400px");break}}_board(e,t,s,a,r,l){const f=this._shuffle(this._randomDistinctCards(e*t/2));this.state.flippedCards=f.length,this.state.boardRows=e,this.state.boardCols=t;for(let h=0;h<e;h++)for(let p=0;p<t;p++){const L=this.createNode(this._memoryCardMarkup(p,h,f[p+h*t],s,a));this.board.appendChild(L)}this.changeAppWindowDimensions(r,l),this.board.style.width="inherit",this.board.style.height="inherit"}_keyDownCallBack(e){switch(e.stopPropagation(),e.key){case"ArrowUp":this._checkAndFocusCardAbove(e.target);break;case"ArrowDown":this._checkAndFocusCardBelow(e.target);break;case"ArrowLeft":this._checkAndFocusCardLeft(e.target);break;case"ArrowRight":this._checkAndFocusCardRight(e.target);break;case"Enter":this.classList.contains("out-of-game")||e.target.dispatchEvent(new Event("click"));break}}_turnCard(e){e.stopPropagation();const t=e.currentTarget;this.state.block||t===this.state.first||(t.classList.toggle("turn"),this.state.flipped?(this.state.attempts++,this.state.second=t,this.state.flipped=!1,this._checkMatch()):(this.state.first=t,this.state.flipped=!0))}_checkMatch(){this.state.first.dataset.id===this.state.second.dataset.id?(this.state.block=!0,this.state.flippedCards-=2,this.state.first.removeEventListener("click",this.state.flipCallBack),this.state.second.removeEventListener("click",this.state.flipCallBack),setTimeout(()=>{this.state.first.classList.toggle("out-of-game"),this.state.second.classList.toggle("out-of-game"),this._resetAfterCheckMatch(),this._checkGameOver()},800)):(this.state.block=!0,setTimeout(()=>{this.state.first.classList.toggle("turn"),this.state.second.classList.toggle("turn"),this._resetAfterCheckMatch()},1500))}_checkGameOver(){this.state.flippedCards===0&&(clearInterval(this.state.timer),this.shadowRoot.removeChild(this.board),this.changeAppWindowDimensions("250px","250px"),this.shadowRoot.appendChild(this.createNode(this._gameResultMarkup())),this.shadowRoot.querySelector(".play-again").addEventListener("click",e=>{e.stopPropagation(),this.shadowRoot.removeChild(this.shadowRoot.querySelector(".game-result")),this._globalReset(),this._startNewGame()}))}_resetAfterCheckMatch(){this.state.flipped=!1,this.state.block=!1,this.state.first=null,this.state.second=null}_globalReset(){this.state.flipped=!1,this.state.block=!1,this.state.first=null,this.state.second=null,this.state.flipCallBack=null,this.state.cards=null,this.state.timer=null,this.state.flippedCards=0,this.state.attempts=0,this.state.boardCols=0,this.state.seconds=0}_randomDistinctCards(e){const t=new Set;for(;t.size<e;)t.add(Math.floor(Math.random()*8));const s=Array.from(t);return[...s,...s]}_shuffle(e){e.sort();const t=e.length;for(let s=1;s<t;s++){const a=Math.floor(Math.random()*(s+1)),r=e[s];e[s]=e[a],e[a]=r}return e}_chooseBoardMarkup(){return`
    <div class="board-dimension">
      <p>Board dimensions</p>
      <button class="btn-board-dimension">${d.TWOTWO}</button>
      <button class="btn-board-dimension">${d.TWOFOUR}</button>
      <button class="btn-board-dimension">${d.FOURFOUR}</button>
    </div>
    `}_timerMarkup(){return`
    <div class="timer">
      00:00:00
    </div>
    `}_gameAreaMarkup(){return`
    <div class="memory-game"></div>
    `}_memoryCardMarkup(e,t,s,a,r){return`
    <style>
    .memory-card {
      width: calc(${a} - 14px);
      height: calc(${r} - 14px);
    }
    </style>

    <div class="memory-card" data-id="${s}" data-x="${e}" data-y="${t}" tabindex="0">
      <img class="front" src="img/memory/${s}.svg" alt="Memory Game Card Front">
      <img class="back" src="img/memory/back.svg" alt="Memory Game Card Back">
    </div>
    `}_gameResultMarkup(){return`
    <div class="game-result">
      <p>It took you ${this.state.attempts} attempts</p>
      <button class="play-again">Play again</button>
    </div>
    `}}customElements.define("memory-app",_);class O{#e;#t=0;setNickName(e){e?this.#e=e:this.#e="Incognito"}getNickName(){return this.#e}updateTime(e){this.#t+=e}getTime(){return this.#t}}async function F(i){const e=await fetch(i),t=await e.json();if(!e.ok)throw console.log(e),new Error(e.status);return t}async function D(i,e=null){const t={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)},s=await fetch(i,t),a=await s.json();if(!s.ok)throw new Error(s.status);return a}function B(i,e){if(i.innerHTML="",Object.prototype.hasOwnProperty.call(e,"alternatives"))for(const t in e.alternatives){const s=document.createElement("label");s.innerText=e.alternatives[t];const a=document.createElement("input");a.type="radio",a.name="alt",a.value=t,s.insertAdjacentElement("afterbegin",a),s.addEventListener("click",r=>r.stopPropagation()),i.appendChild(s)}else{const t=document.createElement("input");t.addEventListener("click",s=>s.stopPropagation()),t.type="text",i.appendChild(t)}}function P(i){const e=i.childNodes;if(e.length>1){for(let t=0;t<e.length;t++)if(e[t].childNodes[0].checked)return e[t].childNodes[0].value;return""}return e[0].value}const $=`.centered{width:100%;height:100%;border-radius:inherit;display:flex;flex-direction:column;gap:.9rem;font-family:sans-serif;background:linear-gradient(to top,#505285 0%,#585e92 12%,#65689f 25%,#7474b0 37%,#7e7ebb 50%,#8389c7 62%,#9795d4 75%,#a2a1dc 87%,#b5aee4 100%);font-size:.9rem}header{margin:0;margin-top:1rem;display:flex;flex-direction:column;align-items:center;gap:.5rem}.welcome-box{display:flex;flex-direction:column;gap:1.5rem}.quiz-title,h3{text-transform:capitalize;text-align:center;color:#41179d8a;font-size:1.5rem;margin:0}h3{font-size:1.1rem}h4{margin:0}.nickname-form{display:flex;justify-content:center;align-items:center;gap:.5rem}.rules{display:flex;flex-direction:column;gap:.5rem;align-self:center;margin:0;padding:0}label{font-weight:700;word-break:break-all}input{background-color:inherit;line-height:1.5rem;width:12rem;border:none;border-bottom:2px solid rgba(65,23,157,.543);outline:none;font-size:inherit;font-family:inherit;color:inherit}::placeholder{color:#353333f1;opacity:1;text-align:center}button{text-transform:uppercase;font-size:.78rem;font-weight:700;color:#333;width:fit-content;border-radius:30px;padding:.5rem;border:none;background-color:#7762622f;box-shadow:0 8px 15px #0003;align-self:center;letter-spacing:1.3px;cursor:pointer;transition:all .5s ease 0s}button:hover{transform:translateY(-5px)}.question{text-align:center}.hidden{display:none}.flex{display:flex;flex-direction:column;align-items:center;gap:.5rem}.label{color:#580000;font-weight:700}.player-input{display:flex;flex-direction:column;gap:.5rem;margin-bottom:1rem}input[type=radio]{width:3.5rem}.result li{margin:.5rem 0}.top-timings{padding:0}.result h2{text-transform:capitalize}
`;class z{#e=10;#t;#s=new Event("timeout");startTimer(e){let t=this.#e;e.textContent=t,this.#t=setInterval(()=>{t--,e.textContent=t,t<0&&(e.dispatchEvent(this.#s),this.stopTimer())},1e3)}stopTimer(){clearInterval(this.#t)}getTiming(e){return this.#e-Number(e.textContent)}}class S extends m{startURL="https://courselab.lnu.se/quiz/question/1";constructor(e){super(e),this.changeAppWindowDimensions("350px","350px"),this.createStyle($),this.shadowRoot.appendChild(this.createNode(this._quizMarkup())),this._selectShadowDOMElements(),this.timer=new z,this._toggleWelcomeArea(),this.playerNameInputField.addEventListener("click",t=>t.stopPropagation()),this.letsPlayBtn.addEventListener("click",async t=>{t.preventDefault(),t.stopPropagation(),this._initQuizData(),await this._tryCatch(async()=>{await this._getnextQuestion()}),this._toggleWelcomeArea(),this._toggleQuestionArea()}),this.nextBtn.addEventListener("click",async t=>{t.preventDefault(),t.stopPropagation(),await this._tryCatch(async()=>{const s=await this._postAnswer();Object.prototype.hasOwnProperty.call(s,"nextURL")?(this.nextURL=s.nextURL,await this._getnextQuestion()):(M(this.player.getNickName(),this.player.getTime()),this._displayResults(`${this.player.getNickName()} won in ${this.player.getTime()} seconds 🧡`,u()))})}),this.timerSpan.addEventListener("timeout",()=>{this._displayResults("Timeout! You lost 👀",u())}),this.playAgainBtn.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),this.playerNameInputField.value="",this._toggleResultArea(),this._toggleWelcomeArea()})}_selectShadowDOMElements(){this.welcomeBox=this.shadowRoot.querySelector(".welcome-box"),this.playerNameInputField=this.shadowRoot.querySelector("#name"),this.letsPlayBtn=this.shadowRoot.querySelector(".lets-play-btn"),this.playerTimer=this.shadowRoot.querySelector(".player-timer"),this.playerSpan=this.shadowRoot.querySelector(".player"),this.timerSpan=this.shadowRoot.querySelector(".timer"),this.questionBox=this.shadowRoot.querySelector(".question-box"),this.question=this.shadowRoot.querySelector(".question"),this.playerInput=this.shadowRoot.querySelector(".player-input"),this.nextBtn=this.shadowRoot.querySelector(".next"),this.result=this.shadowRoot.querySelector(".result"),this.top5=this.shadowRoot.querySelector(".top-timings"),this.playAgainBtn=this.shadowRoot.querySelector(".play-again")}_initQuizData(){this.player=new O,this.nextURL=this.startURL,this.player.setNickName(this.playerNameInputField.value),this.playerSpan.textContent=this.player.getNickName()}_toggleWelcomeArea(){this.welcomeBox.classList.toggle("hidden")}_toggleQuestionArea(){this.playerTimer.classList.toggle("hidden"),this.questionBox.classList.toggle("flex"),this.questionBox.classList.toggle("hidden")}_toggleResultArea(){this.result.classList.toggle("flex"),this.result.classList.toggle("hidden"),this.top5.innerHTML=""}async _getnextQuestion(){const e=await F(this.nextURL);this.question.innerText=`${e.question}`,this.timer.startTimer(this.timerSpan),this.nextURL=e.nextURL,B(this.playerInput,e)}async _postAnswer(){this.timer.stopTimer(),this.player.updateTime(this.timer.getTiming(this.timerSpan));const e=this._checkAnswer();return await D(this.nextURL,{answer:e})}_checkAnswer(){const e=P(this.playerInput).trim();if(!e)throw new Error("400");return e}_displayResults(e,t){this._toggleQuestionArea(),this._toggleResultArea(),this.result.querySelector(".result-header").textContent=e;for(let s=0;s<t.length;s++){const a=document.createElement("li");a.textContent=N(t[s]),this.top5.appendChild(a)}}async _tryCatch(e){try{await e()}catch(t){t.message.localeCompare("400")===0?this._displayResults("Wrong answer! You lost 👀",u()):alert(`Something went wrong. Response code ${t.message}`)}}_quizMarkup(){return`
  <div class="centered">
  <header>
    <h1 class="quiz-title">amazing quiz game</h1>
    <div class="player-timer hidden">
        <span class="label">Player: </span>
        <span class="player">Default</span>
        <span class="label">Time left: </span>
        <span class="timer"></span>
    </div>
  </header>
  <div class="welcome-box hidden">
    <ul class="rules">
      <li>You have 10 seconds to answer each question</li>
      <li>You lose if you don't answer during 10 seconds</li>
      <li>You lose if your answer is not correct</li>
    </ul>
    <form class="nickname-form" autocomplete="off">
      <input type="text" id="name" name="name" placeholder="Please enter your name here" maxlength="15" />
    </form>
    <button class="lets-play-btn">Let's Play</button>
  </div>
  <form class="question-box hidden" autocomplete="off">
    <h3 class="question">Here comes the question</h3>
    <div class="player-input"></div>
    <button class="next">Next</button>
  </form>
  <div class="result hidden">
    <h4 class="result-header"></h4>
    <div>
      <h3>top 5 timings</h3>
      <ul class="top-timings"></ul>
    </div>
    <button class="play-again">Play Again</button>
  </div>
</div>
  `}}customElements.define("quiz-app",S);const g=document.querySelector(".main-window"),w=document.querySelector(".chat-btn"),x=document.querySelector(".memo-btn"),v=document.querySelector(".quiz-btn");T();C(g);window.onerror=(i,e,t,s,a)=>(console.error(`${a} at ${e} ${t}`),alert(`Error message: ${a.message}`),!0);w.addEventListener("click",()=>{const i=new k(w.querySelector("img").src);i.isUsernameRegistered&&g.appendChild(i)});x.addEventListener("click",()=>{const i=new _(x.querySelector("img").src);g.appendChild(i)});v.addEventListener("click",()=>{const i=new S(v.querySelector("img").src);g.appendChild(i)});