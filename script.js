import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

/* ── STAR FIELD ── */
(function(){
  const sf = document.getElementById('starfield');
  if(!sf) return;
  for(let i=0;i<90;i++){
    const s=document.createElement('div');
    s.className='star';
    const sz=Math.random()*2+.5;
    Object.assign(s.style,{
      width:sz+'px',height:sz+'px',
      top:Math.random()*60+'%',
      left:Math.random()*100+'%',
      animationDuration:(2+Math.random()*3)+'s',
      animationDelay:(Math.random()*3)+'s',
      opacity:Math.random()*.6+.1
    });
    sf.appendChild(s);
  }
})();

/* ── SCROLL REVEAL ── */
const ro = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('on') });
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

/* ── SMOOTH SCROLL (exposed globally for onclick) ── */
window.jump = function(sel){ document.querySelector(sel).scrollIntoView({behavior:'smooth'}); };

/* ── COPY IP (exposed globally for onclick) ── */
window.copyIP = function(){
  const ip = document.getElementById('ipval').textContent;
  navigator.clipboard.writeText(ip).catch(()=>{});
  const t=document.getElementById('toast');
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2200);
};

/* ── SUPPORT PANEL (exposed globally for onclick) ── */
window.toggleSupport = function(){
  document.getElementById('supportPanel').classList.toggle('open');
};

/* ── RANDOM CÂU HỎI ── */
/* ── RANDOM CÂU HỎI SMP ── */

const questions = [
  "IC và OOC là gì",
  "Nếu phát hiện một lỗi (bug/duplication), bạn sẽ làm gì?",
  "Nếu thấy người khác hack hoặc cheat, bạn sẽ xử lý như thế nào?",
  "Tình huống:\n\nBạn đi khám phá và thấy một căn nhà không khóa cửa, bên trong có rất nhiều kim cương.\n\nBạn sẽ làm gì?",
  "FailRP là gì?",
  "Bạn có thích tham gia event cộng đồng không?",
  "Bạn thường làm gì đầu tiên khi vào server SMP?",
  "Bạn có được phép phá công trình của người khác khi chưa xin phép không? Vì sao?",
  "Theo bạn, mục tiêu của một server SMP là gì?",
  "Metagaming là gì?",
  "Nếu bạn biết thông tin qua Discord nhưng nhân vật của bạn không biết, bạn có được sử dụng trong RP không?",
  "Tình huống\n\nMột người chơi mới vào server và xin bạn đồ.\n\nBạn sẽ phản ứng như thế nào?",
  "Tình huống\n\nBạn bị cướp trong RP.\n\nBạn sẽ xử lý như thế nào để vẫn đúng tinh thần RP?"
];

const box = document.getElementById("questionBox");

/* Lưu lại 3 câu random */
const selectedQuestions = [...questions]
  .sort(() => 0.5 - Math.random())
  .slice(0, 3);

if(box){

  selectedQuestions.forEach((q, i) => {

    box.innerHTML += `
      <div class="fgroup">
        <label>${q}</label>
        <input type="text" name="Q${i+1}" required>
      </div>
    `;

  });

}

/* ── EMAILJS CONFIG ── */
/*
⚠ CHỖ BẮT BUỘC BOSS PHẢI THAY:
1. YOUR_PUBLIC_KEY
2. YOUR_SERVICE_ID
3. YOUR_TEMPLATE_ID

Tạo tại: https://www.emailjs.com/
*/
// ===== GỬI MAIL =====



// =====================

emailjs.init("OYzepA4eyy_zmBlmg"); // ← THAY PUBLIC KEY

/* ── FIREBASE + EMAILJS ── */
const firebaseConfig = {
  apiKey: "AIzaSyBf8-Nx6afONi9JN3RPJK1_aVGK74Lcgxo",
  authDomain: "tnasmp-4a7eb.firebaseapp.com",
  projectId: "tnasmp-4a7eb",
  storageBucket: "tnasmp-4a7eb.appspot.com",
  messagingSenderId: "460299658998",
  appId: "1:460299658998:web:e44b3b1f1d9c0329a5aed7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("registerForm");
if(form){
  form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const btn = form.querySelector(".submit-btn");
    btn.disabled = true;

    const emailVal = document.getElementById("email").value.trim();
    const dobVal = document.getElementById("dob").value;
    const ignVal = document.getElementById("ign").value.trim();
    const discordVal = document.getElementById("discord").value.trim();
    const expVal = document.getElementById("exp").value;
    const reasonVal = document.getElementById("reason").value.trim();
    const agreeVal = document.getElementById("agree").checked;

    const q1 = form.querySelector('[name="Q1"]').value;
    const q2 = form.querySelector('[name="Q2"]').value;
    const q3 = form.querySelector('[name="Q3"]').value;

    if(!emailVal || !dobVal || !ignVal || !discordVal || !expVal || !reasonVal){
      alert("Điền đầy đủ!");
      btn.disabled = false;
      return;
    }

    if(!agreeVal){
      alert("Bạn chưa đồng ý nội quy");
      btn.disabled = false;
      return;
    }

    let user;

    try{
      const password = Math.random().toString(36).slice(-8);
      const cred = await createUserWithEmailAndPassword(auth, emailVal, password);
      user = cred.user;
    }catch(err){
      alert("Lỗi tạo tài khoản: " + err.message);
      btn.disabled = false;
      return;
    }

    try{
      await sendEmailVerification(user);
      alert("📩 Đã gửi email xác minh! (check cả spam / hòm thư rác)");
    }catch(err){
      alert("Lỗi gửi mail: " + err.message);
      btn.disabled = false;
      return;
    }

    const interval = setInterval(async ()=>{

    await user.reload();

    if(user.emailVerified){
        clearInterval(interval);
        alert("✔ Email đã xác minh!");
        document.getElementById("wl-form").style.display="none";
        document.getElementById("success-panel").style.display="flex";
        setTimeout(async ()=>{

          try{
            await emailjs.send(
              "service_3bmewbg",
              "template_p34ursd",
              {
                email: emailVal,
                dob: dobVal,
                ign: ignVal,
                discord: discordVal,
                exp: expVal,
                reason: reasonVal,
                  
                q1:q1,
                q2:q2,
                q3:q3,

                question1: selectedQuestions[0],

                question2: selectedQuestions[1],

                question3: selectedQuestions[2]
              }
            );

            console.log("Whitelist sent via EmailJS");
          }catch(err){
            console.error("EmailJS Error:", err);
            alert("Gửi whitelist thất bại!");
          }

        },1000);
      }
    },3000);
  });
}
