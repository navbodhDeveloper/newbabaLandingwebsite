// ── Custom cursor
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
function animateRing(){
  rx+=(mx-rx)*.12;ry+=(my-ry)*.12;
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(animateRing);
}
animateRing();
document.querySelectorAll('a,button,[onclick]').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.width='20px';cur.style.height='20px';ring.style.width='52px';ring.style.height='52px';});
  el.addEventListener('mouseleave',()=>{cur.style.width='12px';cur.style.height='12px';ring.style.width='36px';ring.style.height='36px';});
});

// ── Nav scroll
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled',window.scrollY>50);
  const sctop=document.getElementById('sctop');
  sctop.style.display=window.scrollY>500?'flex':'none';
},{passive:true});

// ── Mobile menu
function toggleMenu(){
  const m=document.getElementById('mobileMenu');
  const h=document.querySelector('.hamburger');
  m.classList.toggle('open');h.textContent=m.classList.contains('open')?'✕':'☰';
}
function closeMenu(){document.getElementById('mobileMenu').classList.remove('open');document.querySelector('.hamburger').textContent='☰';}

// ── Scroll reveal
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el=>observer.observe(el));

// ── Gallery auto-scroll
const strip=document.getElementById('galleryStrip');
let autoScroll=true,scrollPos=0;
function doAutoScroll(){
  if(autoScroll&&strip){
    scrollPos+=.6;
    if(scrollPos>=strip.scrollWidth-strip.clientWidth)scrollPos=0;
    strip.scrollLeft=scrollPos;
  }
  requestAnimationFrame(doAutoScroll);
}
doAutoScroll();
strip.addEventListener('mouseenter',()=>autoScroll=false);
strip.addEventListener('mouseleave',()=>autoScroll=true);

// ── Counter animation
function animateCounter(el,target,suffix=''){
  let current=0;
  const isText=isNaN(parseInt(target));
  if(isText){el.textContent=target;return;}
  const num=parseInt(target);
  const duration=1400;const steps=60;const inc=num/steps;
  const t=setInterval(()=>{
    current=Math.min(current+inc,num);
    el.textContent=Math.floor(current).toLocaleString()+(current>=num?suffix:'');
    if(current>=num)clearInterval(t);
  },duration/steps);
}
const statObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const nums=e.target.querySelectorAll('.stat-num');
      nums.forEach(n=>{
        const raw=n.textContent;
        const hasPlus=raw.includes('+');
        const hasGold=raw==='Gold';
        if(!hasGold&&!n.dataset.animated){
          n.dataset.animated='1';
          animateCounter(n,parseInt(raw.replace(/[^0-9]/g,'')),hasPlus?'+':'');
        }
      });
    }
  });
},{threshold:.5});
document.getElementById('stats')&&statObserver.observe(document.getElementById('stats'));

// ── Form validation
function submitForm(){
  const name=document.getElementById('fname').value.trim();
  const email=document.getElementById('femail').value.trim();
  const subject=document.getElementById('fsubject').value.trim();
  const msg=document.getElementById('fmessage').value.trim();
  const err=document.getElementById('ferr');
  if(!name||name.length<2){err.textContent='Please enter your full name.';err.style.display='block';return;}
  if(!email||!email.includes('@')){err.textContent='Please enter a valid email address.';err.style.display='block';return;}
  if(!subject||subject.length<3){err.textContent='Please enter a subject.';err.style.display='block';return;}
  if(!msg||msg.length<20){err.textContent='Message must be at least 20 characters.';err.style.display='block';return;}
  err.style.display='none';
  document.getElementById('formArea').style.display='none';
  document.getElementById('formSuccess').style.display='block';
}


const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursor-ring");

function moveCursor(x, y) {
  cursor.style.left = x + "px";
  cursor.style.top = y + "px";
  cursorRing.style.left = x + "px";
  cursorRing.style.top = y + "px";
}

// Mouse
document.addEventListener("mousemove", (e) => {
  moveCursor(e.clientX, e.clientY);
});

// Touch
document.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  moveCursor(touch.clientX, touch.clientY);
});