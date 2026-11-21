const fs=require('node:fs');
const dir='dist/images/lesson1/cartoon';
function icon(name,x,y,size){
 const svg=fs.readFileSync(`${dir}/${name}.svg`,'utf8');
 const view=svg.match(/viewBox="([^"]+)"/)[1];
 const body=svg.slice(svg.indexOf('>')+1,svg.lastIndexOf('</svg>'));
 return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${view}">${body}</svg>`;
}
const person=(x,y,color='#92D3F5')=>`<g transform="translate(${x} ${y})" stroke="#26394A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M-35 110V70Q-35 45 0 45T35 70V110" fill="${color}"/><circle cy="13" r="28" fill="#F6D2AE"/><path d="M-27 10Q-32-22 0-20Q29-22 28 8L14-1Q0 12-27 10" fill="#775A49"/><path d="M-10 14v2m20-2v2m-17 13q7 6 14 0" fill="none"/></g>`;
const floor='<ellipse cx="160" cy="222" rx="125" ry="10" fill="#D8E8E1"/>';
const scenes={
 'play-ball':floor+'<path d="M45 203h230" stroke="#FFF" stroke-width="5"/>'+icon('basketball',53,0,230),
 'dance':floor+icon('dancing',57,0,230)+icon('notes',235,28,52),
 'watch-tv':icon('television',94,-8,142)+'<rect x="62" y="148" width="198" height="66" rx="20" fill="#C7B8E8" stroke="#26394A" stroke-width="4"/>'+[104,161,218].map((x,i)=>`<g stroke="#26394A" stroke-width="3"><path d="M${x-23} 208v-44q23-24 46 0v44" fill="${['#92D3F5','#F7AF8C','#A8D5BA'][i]}"/><circle cx="${x}" cy="139" r="20" fill="#775A49"/></g>`).join(''),
 'listen-music':floor+person(155,65)+icon('headphones',99,24,112)+icon('notes',230,36,66),
 'eat':floor+person(155,41,'#F7AF8C')+'<path d="M70 151h180v65H70z" fill="#DAB891" stroke="#26394A" stroke-width="4"/>'+icon('meal',101,103,113)+'<path d="M123 128 132 97" stroke="#26394A" stroke-width="5" stroke-linecap="round"/>',
 'walk-listen':floor+icon('walking',24,0,231)+icon('headphones',209,21,82)+icon('notes',221,116,60),
 'sing-dance':floor+icon('dancing',23,0,230)+icon('microphone',205,91,90)+icon('notes',215,14,74),
 'read-drink':floor+person(143,41,'#B9AAE8')+'<rect x="44" y="155" width="238" height="61" rx="8" fill="#DAB891" stroke="#26394A" stroke-width="4"/>'+icon('book',57,91,138)+icon('tea',204,113,76)
};
for(const [name,scene] of Object.entries(scenes))fs.writeFileSync(`${dir}/${name}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240"><!-- Adapted composition using OpenMoji, CC BY-SA 4.0. See ATTRIBUTION.md. --><rect width="320" height="240" rx="20" fill="#F1F7F4"/><circle cx="160" cy="111" r="99" fill="#E3F0EA"/>${scene}</svg>`);
