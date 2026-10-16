module.exports = async function(req,res) {
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET')return res.status(405).json({error:'Método no permitido'});
 const url=process.env.ALBORAN_SUPABASE_URL||'',key=process.env.ALBORAN_SUPABASE_PUBLISHABLE_KEY||'';
 const configured=/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url)&&!!key;
 res.json({configured,url:configured?url:'',key:configured?key:'',contactEnabled:configured&&!!process.env.ALBORAN_CONTACT_SECRET,siteUrl:'https://fontaneria-alboran.vercel.app'});
};
