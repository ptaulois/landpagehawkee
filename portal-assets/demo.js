import {loadCatalog,projectCard} from './catalog.js';
import {el} from './shared.js';
import {groupSteps,progressSummary,stageTrack,renderStepGroups,focusGroup,openState,restoreOpen} from './progress.js';
import {sumCompleted} from './step-model.mjs';
const $=id=>document.getElementById(id);
let steps=[],admin=true;
function render(){
 const opened=openState($('demo-groups'));
 const last=steps.filter(s=>s.completed).sort((a,b)=>b.completed_at.localeCompare(a.completed_at))[0];
 const project={progress:sumCompleted(steps),stage:last?`Concluído: ${last.label}`:'Planejamento'};
 const groups=renderStepGroups(steps,{
  onComplete:admin?async step=>{step.completed=!step.completed;step.completed_at=step.completed?new Date().toISOString():null;render();$('demo-message').textContent=step.completed?`Subetapa concluída. Agora a obra está em ${sumCompleted(steps)}%.`:`Subetapa reaberta. Agora a obra está em ${sumCompleted(steps)}%.`;}:null,
  onUpload:admin?step=>{$('demo-message').textContent=`No administrador, “Adicionar fotos e vídeos” abre o envio vinculado a “${step.label}”. Esta demonstração não envia arquivos.`;}:null,
  loadUpdates:async(step,target)=>{target.replaceChildren(el('p','As fotos e os vídeos publicados desta subetapa aparecerão aqui.','small'));}
 });
 $('demo-groups').replaceChildren(groups);restoreOpen(groups,opened);
 $('demo-progress').replaceChildren(progressSummary(project),stageTrack(project,groupSteps(steps),key=>focusGroup(groups,key)));
 $('demo-admin').setAttribute('aria-pressed',String(admin));$('demo-client').setAttribute('aria-pressed',String(!admin));
}
$('demo-admin').onclick=()=>{admin=true;render();};$('demo-client').onclick=()=>{admin=false;render();};$('demo-reset').onclick=()=>{for(const s of steps){s.completed=false;s.completed_at=null;}$('demo-message').textContent='Demonstração reiniciada.';render();};
try{const r=await fetch('/portal-assets/step-template.json');if(!r.ok)throw Error();steps=(await r.json()).map(s=>({...s,id:s.key,completed:false,completed_at:null}));render();}catch{$('demo-message').textContent='Não foi possível abrir a demonstração. Atualize a página.';}

const demoCards=el('section');demoCards.id='projects';document.querySelector('main').prepend(demoCards);
loadCatalog().then(models=>{for(const [i,m] of models.entries()){demoCards.append(projectCard({id:m.key,title:m.title,cover_image:m.image,progress:[17,5,30][i]||0,stage:'Exemplo de andamento'},()=>{$('demo-message').textContent='Demonstração do diário: '+m.title;document.getElementById('demo-groups').scrollIntoView({behavior:'smooth'});}));}}).catch(err=>demoCards.append(el('p',err.message)));
