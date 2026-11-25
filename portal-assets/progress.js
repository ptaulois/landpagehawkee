import { el, date } from './shared.js';
import { groupSteps } from './step-model.mjs';
export {groupSteps};
export async function loadProjectSteps(client,projectId){const r=await client.from('portal_project_steps').select('*').eq('project_id',projectId).order('group_position').order('position');if(r.error)throw Error('Não foi possível carregar as subetapas. Atualize a página.');return r.data;}
export function progressSummary(project){const section=el('div','','progress-summary');const total=el('p','','progress-total');total.append(el('strong',`${project.progress}%`),el('span','da obra concluída'));section.append(total,el('span',project.stage,'milestone-title'));return section;}
export function stageTrack(project,groups,onSelect){const wrapper=el('div','','stage-scroll');wrapper.tabIndex=0;wrapper.setAttribute('aria-label','Etapas da obra. Role para ver todas as etapas.');const list=el('ol','','stage-track');const next=groups.find(s=>!s.completed);for(const s of groups){const current=s.key===next?.key;const li=el('li','',s.completed?'done':current?'current':'');if(current)li.setAttribute('aria-current','step');const marker=el(onSelect?'button':'div','','stage-marker');if(onSelect){marker.type='button';marker.onclick=()=>onSelect(s.key);marker.setAttribute('aria-label',`${s.label}: ${s.earned} de ${s.weight}%. Ver subetapas`);}marker.append(el('span',s.label,'stage-label'),el('span',s.completed?'✓':`${s.earned}%`,'stage-node'),el('span',`${s.earned} de ${s.weight}%`,'stage-state'));li.append(marker);list.append(li);}wrapper.append(list);return wrapper;}
export function renderStepGroups(steps,{onComplete,onUpload,loadUpdates}={}){
 const wrapper=el('div','','work-groups');
 for(const group of groupSteps(steps)){
  const details=el('details','','work-group');details.dataset.group=group.key;
  const summary=el('summary');const title=el('span','','group-title');title.append(el('strong',group.label),el('span',`${group.steps.filter(s=>s.completed).length} de ${group.steps.length} ${group.steps.length===1?'subetapa concluída':'subetapas concluídas'}`,'small-date'));summary.append(title,el('span',`${group.earned} / ${group.weight}%`,'group-score'));
  details.append(summary);
  for(const step of group.steps){
   const item=el('details','',step.completed?'work-step completed':'work-step');item.dataset.step=step.id;
   const heading=el('summary');heading.append(el('span',step.completed?'✓':'○','step-check'),el('span',step.label,'step-name'),el('span',`${step.weight}%`,'step-weight'),el('span',step.completed?'Concluída':'Pendente','step-status'));item.append(heading);
   const body=el('div','','step-body');body.append(el('p',step.completed?`Concluída em ${date(step.completed_at)}. Contribuição: ${step.weight}% da obra.`:`Esta subetapa representa ${step.weight}% da obra.`,'muted'));
   const actions=el('div','','actions');
   if(onUpload){const b=el('button','Adicionar fotos e vídeos','quiet');b.type='button';b.onclick=()=>onUpload(step);actions.append(b);}
   if(onComplete){const b=el('button',step.completed?'Reabrir subetapa':'Marcar como concluída',step.completed?'quiet':'primary inline');b.type='button';b.onclick=async()=>{b.disabled=true;try{await onComplete(step);}finally{b.disabled=false;}};actions.append(b);}
   body.append(actions);const media=el('div','','step-updates');body.append(media);item.append(body);
   let loaded=false;
   item.addEventListener('toggle',async()=>{if(!item.open||loaded)return;loaded=true;media.replaceChildren(el('p','Carregando registros…','small'));try{if(loadUpdates)await loadUpdates(step,media);else media.replaceChildren(el('p','As fotos e os vídeos desta subetapa aparecerão aqui.','small'));}catch(err){loaded=false;media.replaceChildren(el('p',err.message,'notice'));}});
   details.append(item);
  }
  wrapper.append(details);
 }
 return wrapper;
}
export function focusGroup(container,key){const group=[...container.querySelectorAll('[data-group]')].find(n=>n.dataset.group===key);if(group){group.open=true;group.scrollIntoView({behavior:'smooth',block:'start'});group.querySelector('summary').focus();}}
export function openState(container){return [...container.querySelectorAll('details[open]')].map(n=>n.dataset.step||n.dataset.group);}
export function restoreOpen(container,keys){for(const n of container.querySelectorAll('details'))if(keys.includes(n.dataset.step||n.dataset.group))n.open=true;}
