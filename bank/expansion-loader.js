/* ALSKwela expandable bank v4.0. Foundation Sets A-C remain unchanged. */
(function(){
'use strict';
const FOUNDATION = DATA.items.slice();
const TRIAL_SIZE = /Elementary/i.test(DATA.project||'') ? 30 : 40;
const DIFFICULTY = TRIAL_SIZE===30 ? {Easy:9,Moderate:15,Challenging:6} : {Easy:12,Moderate:20,Challenging:8};
const foundationIds=new Set(FOUNDATION.map(q=>q.item_id));
const foundationLCs=new Set(FOUNDATION.map(q=>q.competency_id));
let statusElement=null, checkButton=null, currentManifest=null;
function say(message){if(statusElement)statusElement.textContent=message;}
function compactVersion(){return currentManifest?.bank_version || '1.0.0';}
function updateModeCards(sets){
  const grid=document.querySelector('.modegrid');if(!grid)return;
  const selected=document.querySelector('input[name="mode"]:checked')?.value||'random';
  grid.querySelectorAll('[data-extra-set="yes"]').forEach(n=>n.remove());
  for(const entry of sets){
    const label=document.createElement('label');label.className='mode-option';label.dataset.extraSet='yes';
    const radio=document.createElement('input');radio.type='radio';radio.name='mode';radio.value=entry.id;
    const span=document.createElement('span');const strong=document.createElement('strong');const small=document.createElement('small');
    strong.textContent=`Set ${entry.id} · ${TRIAL_SIZE} items`;
    small.textContent=`Additional question set · bank ${compactVersion()}`;
    span.append(strong,small);label.append(radio,span);grid.append(label);
  }
  const restore=Array.from(document.querySelectorAll('input[name="mode"]')).find(x=>x.value===selected);
  if(restore)restore.checked=true;
  else document.querySelector('input[name="mode"][value="random"]').checked=true;
}
function refreshLabels(sets){
  const hero=document.querySelectorAll('.hero .stat strong');
  if(hero[0])hero[0].textContent=String(BANK.length);
  if(hero[2])hero[2].textContent=String(3+sets.length);
  const randSmall=document.querySelector('.mode-option input[value="random"] + span small');
  if(randSmall)randSmall.textContent=`Draw from all ${BANK.length} items · balanced trial`;
  updateModeCards(sets);
  if(window.location.protocol==='file:')say(`Foundation ${FOUNDATION.length} questions only. Open the hosted app for expandable sets.`);
  else say(`${BANK.length} questions available · Sets A–C${sets.length?', '+sets.map(s=>s.id).join(', '):''} · bank ${compactVersion()}. Offline copies retained.`);
}
function validateEntry(item,setId,globalIds){
  if(!item || typeof item!=='object' || !item.item_id || globalIds.has(item.item_id))throw Error('Duplicate or missing question ID');
  if(item.set!==setId)throw Error(`Question ${item.item_id} has the wrong set label`);
  if(!['A','B','C','D'].includes(item.answer) || item[item.answer]!==item.correct_text)throw Error(`Incorrect answer mapping in ${item.item_id}`);
  if(!['Easy','Moderate','Challenging'].includes(item.difficulty))throw Error(`Invalid difficulty for ${item.item_id}`);
  if(!item.question || !item.competency_id || !item.focus || !item.explanation || !item.feedback_correct || !item.feedback_incorrect)throw Error(`Incomplete question ${item.item_id}`);
  const unique=new Set(['A','B','C','D'].map(l=>String(item[l]||'').trim().toLowerCase()));
  if(unique.size!==4 || unique.has(''))throw Error(`Repeated or empty options in ${item.item_id}`);
  globalIds.add(item.item_id);
}
function validateSet(entry,body,globalIds){
  if(!Array.isArray(body.items)||body.set!==entry.id||body.items.length!==TRIAL_SIZE)throw Error(`Set ${entry.id} must contain ${TRIAL_SIZE} items`);
  const counter={Easy:0,Moderate:0,Challenging:0};
  for(const item of body.items){validateEntry(item,entry.id,globalIds);counter[item.difficulty]++;}
  for(const difficulty of Object.keys(DIFFICULTY))if(counter[difficulty]!==DIFFICULTY[difficulty])throw Error(`Set ${entry.id}: wrong ${difficulty} count`);
  return body.items;
}
async function getJson(path){
 const r=await fetch(path,{cache:'no-store'});
 if(!r.ok)throw Error(`${path} HTTP ${r.status}`);
 return r.json();
}
async function loadExpansion(manual=false){
  if(checkButton)checkButton.disabled=true;
  if(manual)say('Checking for additional question sets...');
  try{
    const manifest=await getJson('./bank/manifest.json');
    if(manifest.schema_version!==1||manifest.foundation_count!==FOUNDATION.length||!Array.isArray(manifest.sets))throw Error('Invalid bank manifest or foundation count');
    const seenSet=new Set(),globalIds=new Set(foundationIds),additions=[];
    for(const entry of manifest.sets){
      if(!/^[D-Z][A-Z]?$/.test(entry.id)||seenSet.has(entry.id)||typeof entry.file!=='string'||!/^bank\/sets\/[a-zA-Z0-9_-]+\.json$/.test(entry.file))throw Error('Invalid or duplicate set entry in manifest');
      seenSet.add(entry.id);
      const body=await getJson('./'+entry.file);
      additions.push(...validateSet(entry,body,globalIds));
    }
    // Changes are atomic: reject an incomplete update rather than displaying partial sets.
    BANK=FOUNDATION.concat(additions);
    INDEX=Object.fromEntries(BANK.map(q=>[q.item_id,q]));
    // A trial retains its original questions and answer explanations when the bank changes.
    if(trial&&Array.isArray(trial.questions))for(const question of trial.questions){if(question.snapshot)INDEX[question.id]=question.snapshot;}
    currentManifest=manifest;
    refreshLabels(manifest.sets);
    if(manual) say(`Update complete: ${BANK.length} questions available, bank ${compactVersion()}. Reopen in airplane mode to confirm offline access.`);
  }catch(error){
    if(!currentManifest) refreshLabels([]);
    say(`Foundation bank ready (${FOUNDATION.length} questions). Additional sets unavailable: ${error.message}. ${navigator.onLine?'Retry online.':'Reconnect to download new sets.'}`);
  }finally{if(checkButton)checkButton.disabled=false;}
}
function init(){
 const home=document.getElementById('home-view');
 if(!home)return;
 const section=document.createElement('section');section.className='panel';section.id='expandable-bank-panel';
 const title=document.createElement('h2');title.textContent='Expandable Question Bank';
 const intro=document.createElement('p');intro.textContent=`Original Sets A–C are protected (${FOUNDATION.length} questions). New sets can be downloaded while online and used later offline.`;
 statusElement=document.createElement('p');statusElement.setAttribute('aria-live','polite');statusElement.className='small';statusElement.textContent='Checking question-bank version...';
 checkButton=document.createElement('button');checkButton.type='button';checkButton.className='btn outline';checkButton.textContent='Check for new question sets';
 checkButton.addEventListener('click',()=>loadExpansion(true));
 section.append(title,intro,statusElement,checkButton);home.append(section);
 refreshLabels([]);
 loadExpansion(false);
 window.addEventListener('online',()=>loadExpansion(false));
}
init();
})();