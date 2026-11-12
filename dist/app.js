'use strict';
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const menuButton = $('.menu-toggle');
const nav = $('#nav');
function closeMenu() { nav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded','false'); menuButton.textContent = 'Menu'; }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('is-open',open); menuButton.setAttribute('aria-expanded',String(open)); menuButton.textContent = open ? 'Close' : 'Menu'; });
nav.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown',(e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menuButton.focus(); } });
matchMedia('(min-width:901px)').addEventListener('change', (e) => { if(e.matches) closeMenu(); });
let boops = 0, boopTimer;
$('#boop').addEventListener('click',() => { boops++; const replies = ['One boop. Instant besties. ♥','Tail wags: activated. 🐾','Officially spoiled. 🎀','Okay, you’re my favorite. ♥']; $('#boop-status').textContent = replies[(boops-1)%replies.length]; $('#boop-status').classList.add('shown'); clearTimeout(boopTimer); boopTimer = setTimeout(()=>$('#boop-status').classList.remove('shown'),2600); });
const questions = [
 { title:'What are we going for?', options:[['🫧','Fresh & fluffy','A bath-day refresh','bath'],['🎀','The full glow-up','A fresh haircut, too','groom'],['🐾','A first little hello','New to the grooming scene','first']] },
 { title:'How much floof are we working with?', options:[['🐶','Little bestie','Under 20 lb','Small · under 20 lb'],['🐕','Medium bestie','20–50 lb','Medium · 20–50 lb'],['🦮','Big bestie','Over 50 lb','Large · over 50 lb']] },
 { title:'And their personality?', options:[['🥳','Social butterfly','Everyone is already their best friend','Social butterfly'],['🥹','A little shy','A little reassurance goes a long way','A little shy'],['👑','Main character','The world is their runway','Main character']] }
];
const services = {bath:'The Fresh & Fluffy',groom:'The Signature Spoil',first:'The Little Hello'};
let step = 0, answers = [];
function renderQuiz(focus = false) {
 const root = $('#quiz-body'); root.replaceChildren();
 $('#step-label').textContent = step < 3 ? `Question ${step+1} of 3` : 'Their spa-day mood, revealed';
 $$('.progress-dots i').forEach((d,i)=>d.classList.toggle('active',i<=step));
 $('#quiz-back').hidden = step === 0;
 $('#quiz-back').textContent = step === 3 ? 'Start again' : 'Go back';
 const heading = document.createElement('h3'); heading.tabIndex=-1;
 if(step < 3) {
  heading.textContent = questions[step].title; root.append(heading);
  const options = document.createElement('div'); options.className='quiz-options';
  questions[step].options.forEach(([emoji,title,detail,value]) => {
   const button = document.createElement('button'); button.className='quiz-option';
   const icon = document.createElement('span'); icon.className='option-emoji'; icon.setAttribute('aria-hidden','true'); icon.textContent=emoji;
   const copy = document.createElement('span'); copy.textContent=title;
   const small = document.createElement('small'); small.textContent=detail; copy.append(small); button.append(icon,copy);
   button.addEventListener('click',()=>{answers[step]=value;step++;renderQuiz(true);}); options.append(button);
  }); root.append(options);
 } else {
  const result = document.createElement('div'); result.className='quiz-result';
  const icon=document.createElement('div');icon.className='result-emoji';icon.textContent='🎀';icon.setAttribute('aria-hidden','true');result.append(icon);
  heading.textContent=services[answers[0]];result.append(heading);
  const description = document.createElement('p');description.textContent=answers[0]==='bath'?'A fresh-coat moment for your favorite little person with paws.':answers[0]==='groom'?'A new-look moment for the pet who deserves the whole pampering treatment.':'A first introduction to talk through a comfortable start for your little VIP.';result.append(description);
  const meta=document.createElement('p');meta.className='quiz-meta';meta.textContent=`${answers[1]} · ${answers[2]}`;result.append(meta);
  const button=document.createElement('button');button.className='button full';button.textContent='Plan this spa day';button.addEventListener('click',()=>{selectService(services[answers[0]]);$('#pet-size').value=answers[1];$('#pet-notes').value=`Personality: ${answers[2]}.`;});result.append(button);root.append(result);
 }
 if(focus) heading.focus({preventScroll:true});
}
$('#quiz-back').addEventListener('click',()=>{if(step===3){step=0;answers=[];}else step=Math.max(0,step-1);renderQuiz(true);});
renderQuiz();
function editPlan() {$('#plan-form').hidden=false;$('#plan-result').hidden=true;}
function selectService(service) {editPlan();$('#service').value=service;$('#plan').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});$('#pet-name').focus({preventScroll:true});}
$$('.choose-service').forEach(button=>button.addEventListener('click',()=>selectService(button.dataset.service)));
const dateInput = $('#preferred-date');
const today = new Date();
const todayString = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
dateInput.min=todayString;
let wishList='';
$('#plan-form').addEventListener('submit',(e)=>{
 e.preventDefault();const name=$('#pet-name').value.trim();const error=$('#form-error');error.hidden=true;
 if(!name){error.textContent='Please add your pet’s name to make their wish list.';error.hidden=false;$('#pet-name').focus();return;}
 if(dateInput.value && dateInput.value < todayString){error.textContent='Please choose today or a future day, then check availability by phone.';error.hidden=false;dateInput.focus();return;}
 const date=dateInput.value ? new Date(dateInput.value+'T12:00:00').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) : 'To discuss by phone';
 const rows=[['Pet',name],['Pampering idea',$('#service').value],['Breed or mix',$('#breed').value.trim()||'To discuss'],['Size',$('#pet-size').value||'To discuss'],['Preferred day',date],['Notes',$('#pet-notes').value.trim()||'None added']];
 const details=$('#result-details');details.replaceChildren();rows.forEach(([key,val])=>{const dt=document.createElement('dt');dt.textContent=key;const dd=document.createElement('dd');dd.textContent=val;details.append(dt,dd);});
 wishList=`The Spoiled Pet Parlor — Spa-day wish list\n${rows.map(([k,v])=>`${k}: ${v}`).join('\n')}\nThis is a wish list, not a confirmed appointment. Call 916-420-3244 to confirm services, pricing and availability.`;
 $('#result-title').textContent=`${name}’s little wish list.`;$('#plan-form').hidden=true;$('#plan-result').hidden=false;$('#copy-status').textContent='';$('#result-title').focus({preventScroll:true});$('#plan-result').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'center'});
});
$('#edit-plan').addEventListener('click',()=>{editPlan();$('#pet-name').focus({preventScroll:true});});
$('#copy-plan').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(wishList);$('#copy-status').textContent='Copied! Keep it handy when you call.';}catch{$('#copy-status').textContent='Your browser could not copy automatically. Select the wish-list text above to copy it.';}});
const looks=[['Do not disturb. Spa day.','A golden retriever wearing a white spa towel'],['Bow down to the fluff.','A groomed white bichon wearing a pink bow'],['Just a little extra.','A corgi wearing a pink bandana']];
const dialog=$('#look-dialog');let currentLook=0,lastLookButton;
function updateLook(){ $('#look-photo').className=`portrait portrait-${currentLook}`;$('#look-photo').setAttribute('aria-label',looks[currentLook][1]);$('#look-title').textContent=looks[currentLook][0]; }
$$('[data-look]').forEach(button=>button.addEventListener('click',()=>{currentLook=Number(button.dataset.look);lastLookButton=button;updateLook();dialog.showModal();}));
$('#close-look').addEventListener('click',()=>dialog.close());
$('#prev-look').addEventListener('click',()=>{currentLook=(currentLook+2)%3;updateLook();});
$('#next-look').addEventListener('click',()=>{currentLook=(currentLook+1)%3;updateLook();});
dialog.addEventListener('click',(e)=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('keydown',(e)=>{if(e.key==='ArrowRight'){$('#next-look').click();e.preventDefault();}if(e.key==='ArrowLeft'){$('#prev-look').click();e.preventDefault();}});
dialog.addEventListener('close',()=>lastLookButton?.focus({preventScroll:true}));
