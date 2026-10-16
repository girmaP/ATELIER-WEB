'use strict';
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle){toggle.setAttribute('aria-expanded','false');nav.classList.remove('open')}});
const quote=document.querySelector('#quote');
quote?.addEventListener('submit',async e=>{
 e.preventDefault();if(!quote.reportValidity())return;const d=new FormData(quote),b=quote.querySelector('[type="submit"]');
 if(quote.dataset.serverContact==='true'){
  const status=document.querySelector('#quote-status');if(!d.get('phone')?.trim()&&!d.get('email')?.trim()){status.textContent='Indica un teléfono o correo para poder responderte.';return}
  b.disabled=true;status.textContent='Enviando consulta…';try{const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...Object.fromEntries(d),consent:true}),signal:AbortSignal.timeout(15000)});const result=await r.json();if(!r.ok)throw Error(result.error||'No se ha podido enviar.');status.textContent='Consulta recibida. El equipo se pondrá en contacto contigo.';quote.reset()}catch(error){status.textContent=error.name==='TimeoutError'?'La conexión está tardando. Comprueba con el equipo antes de volver a enviar.':error.message}finally{b.disabled=false}return
 }
 const text=`Hola, Fontanería Alborán. Soy ${d.get('name')}.\nNecesito: ${d.get('service')}.\nLocalidad: ${d.get('town')}.\n${d.get('message')}\n¿Podéis orientarme sobre disponibilidad y presupuesto?`;
 const phone=(window.alboranBusiness?.phone||'+34624223069').replace(/\D/g,'');window.location.href='https://wa.me/'+phone+'?text='+encodeURIComponent(text)
});
const service=new URLSearchParams(location.search).get('servicio');if(service&&quote){const map={'Reparaciones':'Una reparación','Instalaciones':'Una instalación','Baños y cocinas':'Baño o cocina','Mantenimiento':'Mantenimiento'};for(const el of quote.elements)if(el.name==='service'&&el.value===map[service])el.checked=true}
