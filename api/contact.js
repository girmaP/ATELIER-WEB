const {createHmac}=require('node:crypto');
module.exports=async function(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Método no permitido'});
 const origin=req.headers.origin;
 if(origin!=='https://fontaneria-alboran.vercel.app')return res.status(403).json({error:'Solicitud no permitida'});
 const url=process.env.ALBORAN_SUPABASE_URL,key=process.env.ALBORAN_SUPABASE_PUBLISHABLE_KEY,secret=process.env.ALBORAN_CONTACT_SECRET;
 if(!url||!key||!secret)return res.status(503).json({error:'El formulario no está disponible. Contacta por WhatsApp o teléfono.'});
 let b;try{b=typeof req.body==='string'?JSON.parse(req.body):req.body;if(!b||JSON.stringify(b).length>12000)throw Error()}catch{return res.status(400).json({error:'Revisa los datos de la consulta.'})}
 if(b.website)return res.status(400).json({error:'No se ha podido enviar la consulta.'});
 const valid=(s,min,max)=>typeof s==='string'&&s.trim().length>=min&&s.trim().length<=max;
 if(!valid(b.name,1,100)||!valid(b.town,1,150)||!valid(b.service,1,120)||!valid(b.message,1,3000)||!valid(b.phone||'',0,40)||!valid(b.email||'',0,253)||!b.consent||(!b.phone?.trim()&&!b.email?.trim()))return res.status(400).json({error:'Indica tu nombre, localidad, consulta y un teléfono o correo para responderte.'});
 if(b.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email))return res.status(400).json({error:'Revisa tu correo electrónico.'});
 const ip=req.headers['x-vercel-forwarded-for']||req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown';
 const clientHash=createHmac('sha256',secret).update(String(ip).split(',')[0].trim()).digest('hex');
 try{
  const r=await fetch(url+'/rest/v1/rpc/alboran_submit_lead',{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({p_secret:secret,p_client_hash:clientHash,p_name:b.name,p_email:b.email||'',p_phone:b.phone||'',p_town:b.town,p_service:b.service,p_message:b.message}),signal:AbortSignal.timeout(10000)});
  if(!r.ok)throw Error();const id=await r.json();if(!id)return res.status(429).json({error:'Has enviado varias consultas. Espera un poco o contacta por teléfono.'});
  return res.status(201).json({ok:true,id});
 }catch{return res.status(502).json({error:'No hemos podido guardar la consulta. Inténtalo de nuevo o usa WhatsApp.'})}
};
