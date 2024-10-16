// ดึงองค์ประกอบจาก DOM
const app = document.querySelector('.app'),
    mode = document.querySelector('#mode'),
    chats = document.querySelector('.chats'),
    add_chat = document.querySelector('#add-chat',)
    clear = document.querySelector('#delete'),
    result= document.querySelector('.qna'),
    input= document.querySelector('#input-message'),
    send= document.querySelector('#send');
    chatContainer = document.querySelector('.qna'); 
    // ======API===== //
    OPENAI_API_KEY = " ?",
    url = "https://api.openai.com/v1/chat/completions";
// Event Listeners  
    mode.addEventListener('click',toggleMode);
    add_chat.addEventListener('click',addNewChat);
    
    send.addEventListener('click', getAnswer);
    clear.addEventListener('click', () => chats.innerHTML = ''); // ล้างการแสดงผลของแชท
    input.addEventListener('keyup', (e)=>{
        if(e.key === 'Enter'){
            getAnswer();
        }
    });
    

// update light mode & dark mode
function toggleMode() {
    const light_mode = app.classList.contains('light'); // ตรวจสอบว่าเป็น Light Mode หรือไม่
    app.classList.toggle('light', !light_mode); // ถ้าเป็น Light Mode ให้ปิด หรือถ้าเป็น Dark Mode ให้เปิด

    // อัปเดตไอคอนและข้อความตามโหมด
    mode.innerHTML = light_mode
        ? `<i class="bi bi-moon"></i> Dark Mode`  // ถ้าเป็น Light Mode ให้เปลี่ยนเป็น Dark Mode
        : `<i class="bi bi-brightness-high"></i> Light Mode`;  // ถ้าเป็น Dark Mode ให้เปลี่ยนเป็น Light Mode
}



// create tab for new chat
function addNewChat() {
    chats.innerHTML += `
    <li>
        <div>
            <i class="bi bi-chat-left" ></i>
            <span class="chat-title" contenteditable="">New Chat</span>
        </div>
        <div>
            <i class="bi bi-trash3"  onclick="removeChat(this)"></i>
            <i class="bi bi-pen"  onclick="updateChatTitle(this)"></i>
        </div>
    </li>
    `;
}
// Remove chat function
const removeChat = (el)=> el.parentElement.parentElement.remove();
//update chat title function
const updateChatTitle = (el)=> {
    const chatTitle = el.parentElement.previousElementSibling.querySelector('.chat-title');
    chatTitle.focus();  // Focus on the chat title element
};

// Displaying user Question & bot Answer
async function getAnswer() {
    const option = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${OPENAI_API_KEY}` 
        },
        body : JSON.stringify({
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": "Say this is a test!"}],
            "temperature": 0
        })
    }
    try {
        if (input.value.length >= 3){
            const id = generateId();
            const question =input.value
            app.querySelector('.hints p').innerHTML = question;

            qna.innerHTML +=createChat(question, id);
            qna.scrollTop = qna.scrollHeight;

            const p = document.getElementById(id);
            input.setAttribute('readonly',true);
            send.setAttribute('disabled,true');

            const res = await fetch(url, options);

            if(res.ok){
                p.innerHTML = "";
                input.value = "";
                
                input.removeAttribute('readonly');
                send.removeAttribute('disabled');

                const data = await res.json();
                const msg = data.choices[0].messages.content;

                typeWriter(p, msg);
            }
        }
        
        const question = input.value.trim();  // ตัดช่องว่างออกจากข้อความของผู้ใช้
         {
            return;  // ถ้า input ว่าง ให้หยุดการทำงาน
        }

        app.querySelector('.hints p').innerHTML = question;
        chatContainer.innerHTML += createChat(question);

        const answer = await fetchBotAnswer(question);
        updateChatAnswer(answer);
        input.value = '';  // ล้างข้อความใน input หลังจากส่งคำถาม
    } catch (err) {
        console.error(err);
    }
}

// Create chat function to display question
function createChat(question) {
    return (`
    <div class="result">
        <div class="question">
            <i class="bi bi-person-fill-gear icon blue"></i>
            <h3>${question}</h3>
        </div>
    
        <div class="answer">
            <i class="bi bi-robot icon green"></i>
            <p><img src="img/Loading1.gif" class="loading" /></p>
        </div>
    </div>
    `);
}

// Update answer function after fetching from bot
function updateChatAnswer(answer) {
    const answerElements = document.querySelectorAll('.answer p');
    const lastAnswerElement = answerElements[answerElements.length - 1];  // นำคำตอบสุดท้ายที่เพิ่งเพิ่ม
    lastAnswerElement.innerHTML = answer;
}

// Fetch bot answer (mock API call)
async function fetchBotAnswer(question) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("This is the bot's answer to your question.");
        }, 2000);  // หน่วงเวลา 2 วินาที เพื่อจำลองการรอคำตอบ
    });
}