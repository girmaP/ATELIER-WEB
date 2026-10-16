window.alboranReady=(async()=>{
 if(location.pathname.replace(/\/$/,'')==='/admin'&&new URLSearchParams(location.search).get('demo')==='1'&&window.createAlboranDemo)return window.createAlboranDemo();
 const r=await fetch('/api/config',{cache:'no-store'});if(!r.ok)throw Error('No se ha podido conectar con el servidor.');
 const config=await r.json();if(!config.configured)return {config,db:null};
 const db=window.supabase.createClient(config.url,config.key,{auth:{storage:sessionStorage,storageKey:'alboran-auth',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'pkce'}});
 return {config,db};
})();
