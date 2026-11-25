import { el } from './shared.js';
import { progressSummary } from './progress.js';
export async function loadCatalog(){
 const response=await fetch('/projetos.html',{cache:'no-store'});if(!response.ok)throw Error('Não foi possível carregar o portfólio. Tente novamente.');
 const doc=new DOMParser().parseFromString(await response.text(),'text/html');
 const safe=value=>{try{const u=new URL(value,location.origin);return u.origin===location.origin&&/^https?:$/.test(u.protocol)?u.pathname:null;}catch{return null;}};
 const models=[...doc.querySelectorAll('.projetos-grid .projeto-card')].map(card=>({title:card.querySelector('h3')?.textContent.trim(),key:safe(card.querySelector('a.btn-detalhes')?.getAttribute('href')),image:safe(card.querySelector('.projeto-card-img')?.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1])})).filter(m=>m.title&&m.key&&m.image);
 if(!models.length)throw Error('O portfólio não contém modelos disponíveis.');return models;
}
export function projectCard(p,open){
 const card=el('article','','project photo-project');card.dataset.id=p.id;
 const button=el('button','','project-open');button.type='button';button.setAttribute('aria-label',`Abrir diário de ${p.title}`);
 const cover=el('div','','project-cover');
 if(p.cover_image&&p.cover_image.startsWith('/')&&!p.cover_image.startsWith('//')){const img=el('img');img.src=p.cover_image;img.alt=p.title;img.loading='lazy';img.onerror=()=>{img.remove();cover.textContent='Imagem do projeto indisponível';};cover.append(img);}else cover.append(el('span','Hawkee • Projeto personalizado'));
 const body=el('div','','project-card-body');const bar=el('progress');bar.max=100;bar.value=p.progress;bar.setAttribute('aria-label',`Andamento de ${p.title}`);
 body.append(el('h3',p.title),progressSummary(p),bar,el('span','Abrir diário da obra','card-action'));button.append(cover,body);button.onclick=()=>open(p);card.append(button);return card;
}
