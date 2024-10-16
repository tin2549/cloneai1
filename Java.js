// ดึงองค์ประกอบจาก DOM
const app = document.querySelector('.app'),
    mode = document.querySelector('#mode'),
    chats = document.querySelector('.chats'),
    add_chat = document.querySelector('#add-chat'),
    clear = document.querySelector('#delete'),
    input = document.querySelector('#input-message'),
    send = document.querySelector('#send');
const chatContainer = document.querySelector('.qna');
// ======API===== //
const OPENAI_API_KEY = "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"; // ใส่ API key ของคุณที่นี่
const url = "https://api.openai.com/v1/chat/completions";

// Event Listeners
mode.addEventListener('click', toggleMode);
add_chat.addEventListener('click', addNewChat);
send.addEventListener('click', getAnswer);
clear.addEventListener('click', () => chats.innerHTML = ''); // ล้างการแสดงผลของแชท
input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        getAnswer();
    }
});

// ฟังก์ชันสำหรับการเปลี่ยนโหมด Light Mode และ Dark Mode
function toggleMode() {
    const light_mode = app.classList.contains('light');
    app.classList.toggle('light', !light_mode);

    // อัปเดตไอคอนและข้อความตามโหมด
    mode.innerHTML = light_mode
        ? `<i class="bi bi-moon"></i> Dark Mode`
        : `<i class="bi bi-brightness-high"></i> Light Mode`;
}

// ฟังก์ชันสำหรับสร้างแชทใหม่
function addNewChat() {
    chats.innerHTML += `
    <li>
        <div>
            <i class="bi bi-chat-left"></i>
            <span class="chat-title" contenteditable="">New Chat</span>
        </div>
        <div>
            <i class="bi bi-trash3" onclick="removeChat(this)"></i>
            <i class="bi bi-pen" onclick="updateChatTitle(this)"></i>
        </div>
    </li>
    `;
}

// ฟังก์ชันสำหรับลบแชท
const removeChat = (el) => el.parentElement.parentElement.remove();

// ฟังก์ชันสำหรับอัปเดตชื่อแชท
const updateChatTitle = (el) => {
    const chatTitle = el.parentElement.previousElementSibling.querySelector('.chat-title');
    chatTitle.focus();
};

// ฟังก์ชันสำหรับดึงคำถามและคำตอบจาก OpenAI API
async function getAnswer() {
    const question = input.value.trim();
    if (!question) return;

    // หน่วงเวลา 1 วินาทีก่อนส่งคำขอ
    await new Promise(resolve => setTimeout(resolve, 1000));

    const option = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{ "role": "user", "content": question }],
            "temperature": 0.7
        })
    };

    try {
        app.querySelector('.hints p').innerHTML = question;
        chatContainer.innerHTML += createChat(question);

        const res = await fetch(url, option);
        const data = await res.json();

        if (data.choices && data.choices.length > 0) {
            const answer = data.choices[0].message.content;
            updateChatAnswer(answer);
        } else {
            updateChatAnswer("No response from the bot.");
        }

        input.value = '';
    } catch (error) {
        console.error('Error:', error);
    } finally {
        input.removeAttribute('readonly');
        send.removeAttribute('disabled');
    }
}


// ฟังก์ชันสำหรับแสดงผลคำถาม
function createChat(question) {
    return `
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
    `;
}

// ฟังก์ชันสำหรับอัปเดตคำตอบ
function updateChatAnswer(answer) {
    const answerElements = document.querySelectorAll('.answer p');
    const lastAnswerElement = answerElements[answerElements.length - 1];  // นำคำตอบสุดท้ายที่เพิ่งเพิ่ม
    lastAnswerElement.innerHTML = answer;
}