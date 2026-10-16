const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle){toggle.setAttribute('aria-expanded','false');nav.classList.remove('open')}});
const quote=document.querySelector('#quote');
quote?.addEventListener('submit',e=>{e.preventDefault();if(!quote.reportValidity())return;const d=new FormData(quote);const text=`Hola, Fontanería Alborán. Soy ${d.get('name')}.\nNecesito: ${d.get('service')}.\nLocalidad: ${d.get('town')}.\n${d.get('message')}\n¿Podéis orientarme sobre disponibilidad y presupuesto?`;window.location.href='https://wa.me/34624223069?text='+encodeURIComponent(text)});
const service=new URLSearchParams(location.search).get('servicio');if(service&&quote){const map={'Reparaciones':'Una reparación','Instalaciones':'Una instalación','Baños y cocinas':'Baño o cocina','Mantenimiento':'Mantenimiento'};for(const el of quote.elements)if(el.name==='service'&&el.value===map[service])el.checked=true}
