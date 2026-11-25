export function groupSteps(steps){
 const groups=new Map();
 for(const s of steps){let g=groups.get(s.group_key);if(!g){g={key:s.group_key,label:s.group_label,position:s.group_position,weight:0,earned:0,steps:[]};groups.set(s.group_key,g);}g.weight+=s.weight;g.earned+=s.completed?s.weight:0;g.steps.push(s);}
 return [...groups.values()].sort((a,b)=>a.position-b.position).map(g=>({...g,completed:g.steps.every(s=>s.completed),steps:g.steps.sort((a,b)=>a.position-b.position)}));
}
export function sumCompleted(steps){return steps.reduce((n,s)=>n+(s.completed?s.weight:0),0);}
