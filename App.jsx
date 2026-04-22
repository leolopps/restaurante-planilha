import { useState, useRef, useEffect } from "react";

/* ══════════════════════════════════════════════════════════════
   DADOS HISTÓRICOS REAIS (extraídos da planilha CMV)
══════════════════════════════════════════════════════════════ */
const HISTORY = [
  { mes:"Jul/2024", fat:134137, cmv:44683, cmv_pct:33.3, pessoal_pct:10.7, motoboy_pct:4.0, marketing_pct:0.9,  agua_luz_pct:4.4, lucro_pct:14.6 },
  { mes:"Ago/2024", fat:136659, cmv:59999, cmv_pct:43.9, pessoal_pct:10.6, motoboy_pct:4.6, marketing_pct:0.9,  agua_luz_pct:6.0, lucro_pct:6.5  },
  { mes:"Set/2024", fat:131871, cmv:45918, cmv_pct:34.8, pessoal_pct:9.4,  motoboy_pct:4.2, marketing_pct:4.2,  agua_luz_pct:4.4, lucro_pct:13.1 },
  { mes:"Out/2024", fat:154523, cmv:47090, cmv_pct:30.5, pessoal_pct:13.3, motoboy_pct:3.8, marketing_pct:2.3,  agua_luz_pct:3.8, lucro_pct:20.1 },
  { mes:"Nov/2024", fat:153008, cmv:52460, cmv_pct:34.3, pessoal_pct:8.0,  motoboy_pct:3.9, marketing_pct:3.2,  agua_luz_pct:4.2, lucro_pct:20.6 },
  { mes:"Dez/2024", fat:187060, cmv:69426, cmv_pct:37.1, pessoal_pct:15.2, motoboy_pct:4.0, marketing_pct:3.2,  agua_luz_pct:4.4, lucro_pct:10.6 },
  { mes:"Jan/2025", fat:156054, cmv:59148, cmv_pct:37.9, pessoal_pct:11.5, motoboy_pct:0,   marketing_pct:5.2,  agua_luz_pct:4.2, lucro_pct:8.8  },
  { mes:"Fev/2025", fat:171215, cmv:67977, cmv_pct:39.7, pessoal_pct:7.3,  motoboy_pct:3.2, marketing_pct:3.9,  agua_luz_pct:4.3, lucro_pct:16.6 },
  { mes:"Mar/2025", fat:203826, cmv:74220, cmv_pct:36.4, pessoal_pct:7.9,  motoboy_pct:2.5, marketing_pct:3.3,  agua_luz_pct:1.3, lucro_pct:18.1 },
  { mes:"Abr/2025", fat:203586, cmv:92971, cmv_pct:45.7, pessoal_pct:11.8, motoboy_pct:2.4, marketing_pct:6.7,  agua_luz_pct:2.6, lucro_pct:6.9  },
  { mes:"Mai/2025", fat:180357, cmv:63637, cmv_pct:35.3, pessoal_pct:8.8,  motoboy_pct:3.0, marketing_pct:5.2,  agua_luz_pct:4.9, lucro_pct:16.3 },
  { mes:"Jun/2025", fat:65820,  cmv:23526, cmv_pct:35.7, pessoal_pct:25.4, motoboy_pct:0,   marketing_pct:11.0, agua_luz_pct:7.2, lucro_pct:-17.5},
  { mes:"Jul/2025", fat:189450, cmv:60538, cmv_pct:32.0, pessoal_pct:7.4,  motoboy_pct:3.0, marketing_pct:3.4,  agua_luz_pct:3.9, lucro_pct:15.7 },
  { mes:"Ago/2025", fat:200527, cmv:89346, cmv_pct:44.6, pessoal_pct:10.9, motoboy_pct:3.2, marketing_pct:3.1,  agua_luz_pct:2.5, lucro_pct:13.5 },
  { mes:"Set/2025", fat:174169, cmv:82855, cmv_pct:47.6, pessoal_pct:9.2,  motoboy_pct:0.8, marketing_pct:4.9,  agua_luz_pct:3.3, lucro_pct:8.4  },
  { mes:"Out/2025", fat:179835, cmv:75192, cmv_pct:41.8, pessoal_pct:6.4,  motoboy_pct:2.6, marketing_pct:6.4,  agua_luz_pct:3.3, lucro_pct:13.5 },
  { mes:"Nov/2025", fat:188828, cmv:61365, cmv_pct:32.5, pessoal_pct:7.2,  motoboy_pct:2.8, marketing_pct:11.1, agua_luz_pct:4.5, lucro_pct:15.0 },
  { mes:"Dez/2025", fat:166866, cmv:67751, cmv_pct:40.6, pessoal_pct:15.0, motoboy_pct:1.0, marketing_pct:1.3,  agua_luz_pct:4.7, lucro_pct:21.6 },
  { mes:"Jan/2026", fat:182003, cmv:72187, cmv_pct:39.7, pessoal_pct:10.7, motoboy_pct:1.9, marketing_pct:0.8,  agua_luz_pct:3.2, lucro_pct:18.8 },
  { mes:"Fev/2026", fat:184121, cmv:79067, cmv_pct:42.9, pessoal_pct:8.6,  motoboy_pct:1.7, marketing_pct:4.4,  agua_luz_pct:1.0, lucro_pct:15.2 },
  { mes:"Mar/2026", fat:204000, cmv:73187, cmv_pct:35.9, pessoal_pct:10.0, motoboy_pct:2.9, marketing_pct:5.3,  agua_luz_pct:3.8, lucro_pct:20.0 },
];

const last6 = HISTORY.slice(-6);
const avg6 = k => +(last6.reduce((s,m)=>s+(m[k]||0),0)/last6.filter(m=>m[k]!=null).length).toFixed(1);
const BASELINE = {
  cmv_pct:avg6("cmv_pct"), pessoal_pct:avg6("pessoal_pct"),
  motoboy_pct:avg6("motoboy_pct"), marketing_pct:avg6("marketing_pct"),
  agua_luz_pct:avg6("agua_luz_pct"), lucro_pct:avg6("lucro_pct"),
};

const CMV_ITEMS = [
  { id:"carne",      label:"Carne Bovina",    emoji:"🥩", color:"#ef4444" },
  { id:"frango",     label:"Frango",           emoji:"🍗", color:"#f59e0b" },
  { id:"peixe",      label:"Peixe/Frutos Mar", emoji:"🐟", color:"#06b6d4" },
  { id:"hortifruti", label:"Hortifrúti",        emoji:"🥦", color:"#22c55e" },
  { id:"laticinios", label:"Laticínios",        emoji:"🧀", color:"#a78bfa" },
  { id:"bebidas",    label:"Bebidas",           emoji:"🥤", color:"#38bdf8" },
  { id:"embalagem",  label:"Embalagens",        emoji:"📦", color:"#94a3b8" },
  { id:"outros",     label:"Outros",            emoji:"🔖", color:"#6b7280" },
];

const DEFAULT_TH = {
  cmv:       { label:"CMV Total",     key:"cmv_pct",       warn:38, crit:42, rev:false },
  pessoal:   { label:"Pessoal",       key:"pessoal_pct",   warn:11, crit:14, rev:false },
  motoboy:   { label:"Motoboy",       key:"motoboy_pct",   warn:4,  crit:5,  rev:false },
  marketing: { label:"Marketing",     key:"marketing_pct", warn:6,  crit:10, rev:false },
  agua_luz:  { label:"Água+Luz+Gás",  key:"agua_luz_pct",  warn:5,  crit:6,  rev:false },
  lucro:     { label:"Lucro Líquido", key:"lucro_pct",     warn:10, crit:8,  rev:true  },
};

/* ══════════════════════════════════════════════════════════════
   PROMPTS IA
══════════════════════════════════════════════════════════════ */
const EXTRACT_PROMPT = `Você extrai dados financeiros de mensagens em português de um restaurante.
Retorne SOMENTE JSON válido, sem markdown.
Campos: data (dia do mês int ou null), faturamento (número ou null), cmv (número ou null), despesas (número ou null), motoboy (número ou null), resumo (string curta).
Exemplos:
"hoje faturei 5200 cmv 1400 motoboy 180" → {"data":null,"faturamento":5200,"cmv":1400,"despesas":null,"motoboy":180,"resumo":"Fat R$5.200, CMV R$1.400, Motoboy R$180"}
"dia 22: vendas 4800 compras carne 1200 conta luz 300" → {"data":22,"faturamento":4800,"cmv":1200,"despesas":300,"motoboy":null,"resumo":"Dia 22 — Fat R$4.800, CMV R$1.200, Desp R$300"}`;

const CHAT_PROMPT = `Você é um assistente financeiro especializado para um restaurante self-service.
Tem acesso ao histórico completo de 21 meses (Jul/2024–Mar/2026).

DADOS HISTÓRICOS RESUMIDOS:
- Melhor mês: Nov/2024 (Lucro 20.6%) e Out/2024 (CMV 30.5%, Lucro 20.1%)
- Pior mês: Jun/2025 (Lucro -17.5%, faturamento baixo R$65k)
- CMV médio últimos 6 meses: ~39.6%
- Faturamento médio mensal: ~R$185k
- Funcionários fixos: MEL (cozinheiro R$2.297), KEILA (saladeira R$2.097), SEVERINO/VANESSA (garçons R$1.797 cada), ANTONIO (auxiliar R$1.990), JOAO (chapeiro R$2.120), JESSICA (caixa R$1.600), LEATRIZ (gerente R$1.500). Folha ~R$15.198/mês.
- Motoboys: REINALDO, WILLIAN, MOTOBOY3 (~R$3.624/mês)
- Despesas fixas: Aluguel ~R$7.333, Água+Luz+Gás ~R$5-9k, Sistema R$186, Anota Aí R$159, Contador R$450

Responda sempre em português, de forma direta e objetiva. O dono tem 28 anos, é casado e tem pouco tempo.
Quando detectar CMV acima de 40%, alerte. Quando lucro abaixo de 10%, alerte.`;

/* ══════════════════════════════════════════════════════════════
   UTILITÁRIOS
══════════════════════════════════════════════════════════════ */
const Br = n => "R$ " + Number(n||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
const Pct = n => (+(n||0)).toFixed(1)+"%";
const Clk = () => new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
const DateFmt = () => new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"short"});

function alertLevel(val, th) {
  if (val == null) return "ok";
  if (th.rev) return val<=th.crit?"crit":val<=th.warn?"warn":"ok";
  return val>=th.crit?"crit":val>=th.warn?"warn":"ok";
}

const LS = {
  ok:   { bg:"rgba(16,185,129,.1)",  bd:"rgba(16,185,129,.3)",  tx:"#34d399", dt:"#10b981" },
  warn: { bg:"rgba(245,158,11,.1)",  bd:"rgba(245,158,11,.3)",  tx:"#fbbf24", dt:"#f59e0b" },
  crit: { bg:"rgba(239,68,68,.12)",  bd:"rgba(239,68,68,.35)",  tx:"#f87171", dt:"#ef4444" },
};

async function callAI(system, user, max=600) {
  const r = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:max,system,messages:[{role:"user",content:user}]})
  });
  const d = await r.json();
  return d.content?.map(b=>b.text||"").join("")||"";
}

/* ══════════════════════════════════════════════════════════════
   MICRO COMPONENTES
══════════════════════════════════════════════════════════════ */
function Dots() {
  return (
    <div style={{display:"flex",gap:5,padding:"4px 0",alignItems:"center"}}>
      {[0,1,2].map(i=>(
        <div key={i} style={{width:7,height:7,borderRadius:"50%",background:"#10b981",animation:`bounce 1.2s ease-in-out ${i*.2}s infinite`}}/>
      ))}
    </div>
  );
}

function Badge({children, color="#10b981"}) {
  return (
    <span style={{background:color+"20",border:`1px solid ${color}40`,borderRadius:20,padding:"2px 9px",fontSize:11,color:"#fff",whiteSpace:"nowrap"}}>
      {children}
    </span>
  );
}

function Spark({data, color, h=36}) {
  if(!data||data.length<2) return null;
  const mn=Math.min(...data), mx=Math.max(...data), rng=mx-mn||1;
  const W=72;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*W},${h-((v-mn)/rng)*(h-6)-3}`).join(" ");
  const last=pts.split(" ").at(-1).split(",");
  return (
    <svg width={W} height={h} style={{overflow:"visible",flexShrink:0}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity=".7"/>
      <circle cx={last[0]} cy={last[1]} r="3" fill={color}/>
    </svg>
  );
}

function ProgressBar({pct, warn, crit}) {
  const col = pct>=crit?"#ef4444":pct>=warn?"#f59e0b":"#10b981";
  return (
    <div style={{background:"rgba(255,255,255,.08)",borderRadius:4,height:5,overflow:"hidden",marginTop:6}}>
      <div style={{height:"100%",width:`${Math.min(pct/60*100,100)}%`,background:col,borderRadius:4,transition:"width .5s"}}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TELA 1 — DASHBOARD
══════════════════════════════════════════════════════════════ */
function Dashboard({ thresholds, dayLogs, onNav }) {
  const current = HISTORY[HISTORY.length-1];
  const prev    = HISTORY[HISTORY.length-2];

  const alerts = Object.entries(thresholds).map(([k,th])=>({k,th,val:current[th.key],level:alertLevel(current[th.key],th)}));
  const crits = alerts.filter(a=>a.level==="crit");
  const warns = alerts.filter(a=>a.level==="warn");

  return (
    <div style={{animation:"fadeUp .3s ease"}}>
      {(crits.length>0||warns.length>0) && (
        <div style={{background:crits.length>0?"rgba(239,68,68,.12)":"rgba(245,158,11,.1)",border:`1px solid ${crits.length>0?"rgba(239,68,68,.35)":"rgba(245,158,11,.3)"}`,borderRadius:14,padding:"12px 14px",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{color:crits.length>0?"#f87171":"#fbbf24",fontWeight:700,fontSize:13,marginBottom:4}}>
                {crits.length>0?`🚨 ${crits.length} alerta${crits.length>1?"s":""} crítico${crits.length>1?"s":""}`:`⚠️ ${warns.length} atenção`}
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {[...crits,...warns].map(a=>(
                  <Badge key={a.k} color={a.level==="crit"?"#ef4444":"#f59e0b"}>{a.th.label} {Pct(a.val)}</Badge>
                ))}
              </div>
            </div>
            <button onClick={()=>onNav("alertas")} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:10,color:"#fff",padding:"8px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0,marginLeft:10}}>
              Ver →
            </button>
          </div>
        </div>
      )}

      <div style={{marginBottom:14}}>
        <div style={{color:"rgba(255,255,255,.4)",fontSize:11,fontWeight:600,letterSpacing:".5px",marginBottom:2}}>MÊS ATUAL</div>
        <div style={{display:"flex",alignItems:"baseline",gap:10}}>
          <span style={{color:"#fff",fontSize:20,fontWeight:800}}>{current.mes}</span>
          <span style={{color:"rgba(255,255,255,.3)",fontSize:13}}>{Br(current.fat)}</span>
        </div>
      </div>

      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
        {[
          {label:"CMV",   cur:current.cmv_pct,   prev:prev.cmv_pct,   inv:true},
          {label:"Lucro", cur:current.lucro_pct, prev:prev.lucro_pct, inv:false},
          {label:"Pessoal",cur:current.pessoal_pct,prev:prev.pessoal_pct,inv:true},
        ].map(({label,cur,prev:pv,inv})=>{
          const delta=+(cur-pv).toFixed(1);
          const good=inv?delta<=0:delta>=0;
          return(
            <div key={label} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:14,padding:"12px 14px",flex:"1 1 130px"}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:600,letterSpacing:".4px",marginBottom:4}}>{label.toUpperCase()}</div>
              <div style={{fontSize:22,fontWeight:800,color:"#fff"}}>{cur.toFixed(1)}%</div>
              <div style={{fontSize:11,marginTop:4,color:good?"#34d399":"#f87171",fontWeight:600}}>{delta>=0?"+":""}{delta}% vs ant.</div>
            </div>
          );
        })}
      </div>

      <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:14,padding:"12px 14px",marginBottom:14}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:600,letterSpacing:".4px",marginBottom:10}}>CMV % — ÚLTIMOS 6 MESES</div>
        <div style={{display:"flex",gap:5,alignItems:"flex-end",height:56}}>
          {HISTORY.slice(-6).map((m,i)=>{
            const h=Math.max((m.cmv_pct/55)*48,3);
            const c=m.cmv_pct>=42?"#ef4444":m.cmv_pct>=38?"#f59e0b":"#10b981";
            const isLast=i===5;
            return(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <span style={{fontSize:9,color:c,fontWeight:700}}>{m.cmv_pct}%</span>
                <div style={{width:"100%",height:h,background:c,borderRadius:"3px 3px 0 0",opacity:isLast?1:.6,border:isLast?`1px solid ${c}`:""}}/>
                <span style={{fontSize:8,color:"rgba(255,255,255,.3)",textAlign:"center"}}>{m.mes.split("/")[0]}</span>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:12,marginTop:8,justifyContent:"flex-end"}}>
          <span style={{fontSize:10,color:"rgba(245,158,11,.7)"}}>⚠️ aviso 38%</span>
          <span style={{fontSize:10,color:"rgba(239,68,68,.7)"}}>🚨 crítico 42%</span>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {[
          {icon:"💬",label:"Assistente IA",sub:"Pergunte sobre os dados",nav:"chat"},
          {icon:"📝",label:"Lançar Hoje",  sub:"Registrar dados do dia",nav:"lancamento"},
          {icon:"🔔",label:"Alertas",      sub:`${crits.length+warns.length} indicador(es)`,nav:"alertas"},
          {icon:"📊",label:"Histórico",    sub:"21 meses de dados",nav:"historico"},
        ].map(b=>(
          <button key={b.nav} onClick={()=>onNav(b.nav)} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:14,padding:"12px 14px",textAlign:"left",cursor:"pointer",transition:"all .2s",fontFamily:"inherit"}}>
            <div style={{fontSize:20,marginBottom:4}}>{b.icon}</div>
            <div style={{color:"#fff",fontWeight:700,fontSize:13}}>{b.label}</div>
            <div style={{color:"rgba(255,255,255,.4)",fontSize:11,marginTop:2}}>{b.sub}</div>
          </button>
        ))}
      </div>

      {dayLogs.length>0 && (
        <div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.3)",fontWeight:600,letterSpacing:".5px",marginBottom:8}}>LANÇAMENTOS RECENTES</div>
          {dayLogs.slice(0,3).map((log,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:12,padding:"10px 13px",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{color:"rgba(255,255,255,.5)",fontSize:11}}>{log.ts}</div>
                <div style={{color:"#fff",fontWeight:600,fontSize:13,marginTop:2}}>{Br(log.faturamento)} · CMV {Pct(log.cmv_pct)}</div>
              </div>
              <div style={{color:log.cmv_pct>42?"#f87171":log.cmv_pct>38?"#fbbf24":"#34d399",fontWeight:800,fontSize:16}}>{Pct(log.cmv_pct)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TELA 2 — CHAT IA
══════════════════════════════════════════════════════════════ */
function ChatIA() {
  const [msgs, setMsgs] = useState([{role:"assistant",time:Clk(),content:"Olá! Sou seu assistente financeiro com acesso a 21 meses de dados.\n\nExemplos:\n• \"Como foi março 2026?\"\n• \"Qual mês tive mais lucro?\"\n• \"CMV de agosto 2025 estava normal?\"\n• \"Compare 2024 vs 2025\""}]);
  const [hist, setHist] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const botRef = useRef(null);
  const taRef = useRef(null);

  useEffect(()=>{botRef.current?.scrollIntoView({behavior:"smooth"})},[msgs]);

  const resize = ()=>{
    if(taRef.current){taRef.current.style.height="auto";taRef.current.style.height=Math.min(taRef.current.scrollHeight,110)+"px";}
  };

  const QUICK=["Como foi março 2026?","Qual mês com maior lucro?","CMV acima de 40%: quando?","Compare 2024 vs 2025","Projeção abril 2026"];

  async function send(txt) {
    const text=txt||input.trim();
    if(!text||loading) return;
    setInput(""); if(taRef.current) taRef.current.style.height="auto";
    setMsgs(m=>[...m,{role:"user",content:text,time:Clk()},{role:"assistant",loading:true}]);
    setLoading(true);
    const newHist=[...hist,{role:"user",content:text}];
    try {
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:700,system:CHAT_PROMPT,messages:newHist})});
      const d=await r.json();
      const reply=d.content?.map(b=>b.text||"").join("")||"Erro.";
      setHist([...newHist,{role:"assistant",content:reply}]);
      setMsgs(m=>[...m.slice(0,-1),{role:"assistant",content:reply,time:Clk()}]);
    } catch {
      setMsgs(m=>[...m.slice(0,-1),{role:"assistant",content:"Erro de conexão.",time:Clk()}]);
    }
    setLoading(false);
  }

  const renderMsg = txt => txt.split("\n").map((line,i)=>{
    const html=line.replace(/\*\*(.*?)\*\*/g,"<b>$1</b>").replace(/_(.*?)_/g,"<em>$1</em>");
    return <p key={i} style={{margin:"2px 0",lineHeight:1.55}} dangerouslySetInnerHTML={{__html:html||"&nbsp;"}}/>
  });

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 140px)"}}>
      <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:10,scrollbarWidth:"none",flexShrink:0}}>
        {QUICK.map((q,i)=>(
          <button key={i} onClick={()=>send(q)} style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",borderRadius:20,color:"rgba(255,255,255,.75)",padding:"5px 13px",fontSize:12,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",flexShrink:0}}>
            {q}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>
        {msgs.map((m,i)=>{
          const u=m.role==="user";
          return(
            <div key={i} style={{display:"flex",justifyContent:u?"flex-end":"flex-start",marginBottom:8,paddingLeft:u?40:0,paddingRight:u?0:40,animation:"fadeUp .2s ease"}}>
              {!u&&<div style={{width:29,height:29,borderRadius:8,marginRight:8,flexShrink:0,background:"linear-gradient(135deg,#059669,#0d9488)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>}
              <div style={{background:u?"linear-gradient(135deg,#059669,#047857)":"rgba(255,255,255,.06)",border:u?"none":"1px solid rgba(255,255,255,.1)",borderRadius:u?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"9px 13px",color:"#ecfdf5",maxWidth:"100%",boxShadow:u?"0 3px 14px rgba(5,150,105,.3)":"none"}}>
                {m.loading?<Dots/>:renderMsg(m.content)}
                {m.time&&<div style={{fontSize:10,color:"rgba(255,255,255,.25)",marginTop:4}}>{m.time}</div>}
              </div>
            </div>
          );
        })}
        <div ref={botRef}/>
      </div>
      <div style={{paddingTop:10,flexShrink:0}}>
        <div style={{display:"flex",gap:9,alignItems:"flex-end",background:"rgba(255,255,255,.05)",border:"1px solid rgba(16,185,129,.2)",borderRadius:18,padding:"9px 13px"}}>
          <textarea ref={taRef} value={input} onChange={e=>{setInput(e.target.value);resize();}} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Pergunte sobre seus dados..." rows={1} style={{flex:1,background:"transparent",border:"none",color:"#ecfdf5",fontSize:14,fontFamily:"inherit",lineHeight:1.5,resize:"none",outline:"none"}}/>
          <button onClick={()=>send()} disabled={loading||!input.trim()} style={{width:34,height:34,borderRadius:"50%",flexShrink:0,border:"none",cursor:"pointer",background:(!loading&&input.trim())?"linear-gradient(135deg,#059669,#0d9488)":"rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TELA 3 — LANÇAMENTO DIÁRIO
══════════════════════════════════════════════════════════════ */
function Lancamento({ onSave }) {
  const [step, setStep] = useState("input");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [itemVals, setItemVals] = useState({});
  const [fat, setFat] = useState("");
  const [mode, setMode] = useState("chat");
  const [saved, setSaved] = useState(false);
  const taRef = useRef(null);

  const resize = ()=>{if(taRef.current){taRef.current.style.height="auto";taRef.current.style.height=Math.min(taRef.current.scrollHeight,100)+"px";}};

  async function handleExtract() {
    if(!input.trim()||loading) return;
    setLoading(true);
    try {
      const raw=await callAI(EXTRACT_PROMPT,input);
      let p;
      try{ p=JSON.parse(raw.replace(/```json|```/g,"").trim()); }
      catch{ alert("Não entendi. Tente: \"faturamento 5200, CMV 1400\""); setLoading(false); return; }
      const has=["faturamento","cmv","despesas","motoboy"].some(k=>p[k]!=null);
      if(!has){ alert("Não encontrei valores numéricos."); setLoading(false); return; }
      setParsed(p); setStep("confirm");
    } catch { alert("Erro de conexão."); }
    setLoading(false);
  }

  function handleManualSave() {
    const fatN=parseFloat(fat)||0;
    const total=Object.values(itemVals).reduce((s,v)=>s+(parseFloat(v)||0),0);
    if(!fatN) return;
    onSave({faturamento:fatN,cmv:total,despesas:0,motoboy:0,data:null,resumo:`Fat ${Br(fatN)}, CMV ${Br(total)} (${(total/fatN*100).toFixed(1)}%)`,items:itemVals});
    setSaved(true);
    setTimeout(()=>{setSaved(false);setFat("");setItemVals({});},3000);
  }

  function confirmAndSave() {
    if(parsed){onSave(parsed);setStep("done");}
  }

  const totalItems=Object.values(itemVals).reduce((s,v)=>s+(parseFloat(v)||0),0);
  const fatN=parseFloat(fat)||0;
  const itemPct=fatN>0?(totalItems/fatN*100).toFixed(1):null;

  return (
    <div style={{animation:"fadeUp .3s ease"}}>
      <div style={{color:"rgba(255,255,255,.4)",fontSize:11,fontWeight:600,letterSpacing:".5px",marginBottom:10}}>{DateFmt()} — LANÇAMENTO DO DIA</div>
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[["chat","💬 Falar naturalmente"],["manual","📋 Por item"]].map(([m,l])=>(
          <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:"9px",borderRadius:12,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:mode===m?"linear-gradient(135deg,#059669,#047857)":"rgba(255,255,255,.06)",color:mode===m?"#fff":"rgba(255,255,255,.5)"}}>
            {l}
          </button>
        ))}
      </div>

      {mode==="chat"&&step==="input"&&(
        <div>
          <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:14,padding:"10px 13px",marginBottom:10}}>
            <div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:8}}>Ex: <em>"Hoje faturei R$ 5.200, CMV R$ 1.800, motoboy R$ 200"</em></div>
            <textarea ref={taRef} value={input} onChange={e=>{setInput(e.target.value);resize();}} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleExtract();}}} placeholder="Descreva os dados do dia..." rows={3} style={{width:"100%",background:"transparent",border:"none",color:"#ecfdf5",fontSize:14,fontFamily:"inherit",lineHeight:1.5,resize:"none",outline:"none",boxSizing:"border-box"}}/>
          </div>
          <button onClick={handleExtract} disabled={loading||!input.trim()} style={{width:"100%",padding:"12px",background:(!loading&&input.trim())?"linear-gradient(135deg,#059669,#047857)":"rgba(255,255,255,.06)",border:"none",borderRadius:13,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>
            {loading?"⏳ Processando...":"🤖 Interpretar com IA"}
          </button>
        </div>
      )}

      {mode==="chat"&&step==="confirm"&&parsed&&(
        <div style={{animation:"fadeUp .2s ease"}}>
          <div style={{background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.25)",borderRadius:14,padding:"14px 15px",marginBottom:12}}>
            <div style={{color:"#34d399",fontWeight:700,fontSize:13,marginBottom:10}}>✅ Confirme os dados:</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[["📅 Data",parsed.data?`Dia ${parsed.data}`:"Hoje"],["💰 Faturamento",parsed.faturamento!=null?Br(parsed.faturamento):"—"],["🛒 CMV",parsed.cmv!=null?Br(parsed.cmv):"—"],["💸 Despesas",parsed.despesas!=null?Br(parsed.despesas):"—"],["🛵 Motoboy",parsed.motoboy!=null?Br(parsed.motoboy):"—"],parsed.faturamento&&parsed.cmv?["📊 CMV%",Pct(parsed.cmv/parsed.faturamento*100)]:null].filter(Boolean).map(([l,v])=>(
                <div key={l} style={{background:"rgba(255,255,255,.05)",borderRadius:10,padding:"8px 10px"}}>
                  <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:2}}>{l}</div>
                  <div style={{color:"#fff",fontWeight:700,fontSize:13}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setStep("input")} style={{flex:1,padding:"11px",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,color:"rgba(255,255,255,.6)",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>← Corrigir</button>
            <button onClick={confirmAndSave} style={{flex:2,padding:"11px",background:"linear-gradient(135deg,#059669,#047857)",border:"none",borderRadius:12,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>💾 Confirmar</button>
          </div>
        </div>
      )}

      {mode==="chat"&&step==="done"&&(
        <div style={{textAlign:"center",padding:"24px 0",animation:"fadeUp .2s ease"}}>
          <div style={{fontSize:40,marginBottom:12}}>✅</div>
          <div style={{color:"#34d399",fontWeight:700,fontSize:16,marginBottom:6}}>Lançamento salvo!</div>
          <div style={{color:"rgba(255,255,255,.5)",fontSize:13,marginBottom:20}}>{parsed?.resumo}</div>
          <button onClick={()=>{setStep("input");setParsed(null);setInput("");}} style={{padding:"10px 24px",background:"rgba(16,185,129,.15)",border:"1px solid rgba(16,185,129,.3)",borderRadius:12,color:"#34d399",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
            ➕ Novo lançamento
          </button>
        </div>
      )}

      {mode==="manual"&&(
        <div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:11,color:"rgba(255,255,255,.4)",display:"block",marginBottom:5,fontWeight:600,letterSpacing:".4px"}}>FATURAMENTO DO DIA (R$)</label>
            <input value={fat} onChange={e=>setFat(e.target.value)} placeholder="Ex: 5200" style={{width:"100%",background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.15)",borderRadius:10,padding:"10px 13px",color:"#fff",fontSize:15,fontWeight:600,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:600,letterSpacing:".4px",marginBottom:8}}>CMV POR ITEM</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {CMV_ITEMS.map(item=>{
              const v=parseFloat(itemVals[item.id])||0;
              const pct=fatN>0?(v/fatN*100).toFixed(1):null;
              return(
                <div key={item.id} style={{background:"rgba(255,255,255,.04)",border:`1px solid ${item.color}25`,borderRadius:10,padding:"9px 10px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:11,color:item.color,fontWeight:600}}>{item.emoji} {item.label}</span>
                    {pct&&<span style={{fontSize:11,color:item.color,fontWeight:700}}>{pct}%</span>}
                  </div>
                  <input value={itemVals[item.id]||""} onChange={e=>setItemVals({...itemVals,[item.id]:e.target.value})} placeholder="R$" style={{width:"100%",background:"transparent",border:"1px solid rgba(255,255,255,.1)",borderRadius:7,padding:"6px 9px",color:"#fff",fontSize:13,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
                </div>
              );
            })}
          </div>
          {totalItems>0&&(
            <div style={{background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.2)",borderRadius:12,padding:"10px 13px",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:"rgba(255,255,255,.6)",fontSize:13}}>Total CMV</span>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{color:"#34d399",fontWeight:800,fontSize:16}}>{Br(totalItems)}</span>
                  {itemPct&&<span style={{color:parseFloat(itemPct)>42?"#f87171":parseFloat(itemPct)>38?"#fbbf24":"#34d399",fontWeight:700,fontSize:14}}>{itemPct}%</span>}
                </div>
              </div>
              {fatN>0&&<ProgressBar pct={parseFloat(itemPct)||0} warn={38} crit={42}/>}
            </div>
          )}
          <button onClick={handleManualSave} disabled={!fatN} style={{width:"100%",padding:"12px",background:fatN?"linear-gradient(135deg,#059669,#047857)":"rgba(255,255,255,.06)",border:"none",borderRadius:13,color:fatN?"#fff":"rgba(255,255,255,.3)",fontWeight:700,fontSize:14,cursor:fatN?"pointer":"default",fontFamily:"inherit"}}>
            {saved?"✅ Lançado com sucesso!":"💾 Salvar lançamento"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TELA 4 — ALERTAS
══════════════════════════════════════════════════════════════ */
function Alertas({ thresholds, setThresholds }) {
  const [subTab, setSubTab] = useState("status");
  const current = HISTORY[HISTORY.length-1];
  const alerts = Object.entries(thresholds).map(([k,th])=>({k,th,val:current[th.key],level:alertLevel(current[th.key],th)}));

  return (
    <div style={{animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[["status","Status"],["config","Configurar"],["historico","Histórico"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setSubTab(id)} style={{padding:"7px 16px",borderRadius:20,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:subTab===id?"linear-gradient(135deg,#059669,#0d9488)":"rgba(255,255,255,.06)",color:subTab===id?"#fff":"rgba(255,255,255,.4)"}}>
            {lbl}
          </button>
        ))}
      </div>

      {subTab==="status"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
            {alerts.map(({k,th,val,level})=>{
              const s=LS[level];
              return(
                <div key={k} style={{background:s.bg,border:`1px solid ${s.bd}`,borderRadius:12,padding:"10px 12px",textAlign:"center"}}>
                  <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginBottom:3}}>{th.label}</div>
                  <div style={{fontSize:20,fontWeight:800,color:s.tx}}>{Pct(val)}</div>
                  <div style={{width:7,height:7,borderRadius:"50%",background:s.dt,margin:"5px auto 0",animation:level!=="ok"?"pulse 1.5s infinite":"none"}}/>
                </div>
              );
            })}
          </div>
          {alerts.filter(a=>a.level!=="ok").map(({k,th,val,level})=>{
            const s=LS[level];
            const base=BASELINE[th.key];
            const diff=+(val-base).toFixed(1);
            const spark=HISTORY.map(m=>m[th.key]).filter(v=>v!=null);
            return(
              <div key={k} style={{background:s.bg,border:`1px solid ${s.bd}`,borderRadius:14,padding:"12px 14px",marginBottom:9}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{color:"#fff",fontWeight:700,fontSize:13,marginBottom:2}}>{th.label}</div>
                    <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                      <span style={{color:s.tx,fontSize:22,fontWeight:800}}>{Pct(val)}</span>
                      <span style={{fontSize:11,color:diff>=0&&!th.rev?"#f87171":"#34d399",fontWeight:600}}>{diff>=0?"+":""}{diff}% vs média 6m</span>
                    </div>
                    <div style={{display:"flex",gap:6,marginTop:7,flexWrap:"wrap"}}>
                      <Badge color={level==="crit"?"#ef4444":"#f59e0b"}>{level==="crit"?"🚨 Crítico":"⚠️ Atenção"}</Badge>
                      <Badge color="#6b7280">Limite: {th.warn}% / {th.crit}%</Badge>
                      <Badge color="#6b7280">Média 6m: {Pct(base)}</Badge>
                    </div>
                  </div>
                  <Spark data={spark} color={s.dt} h={42}/>
                </div>
              </div>
            );
          })}
          {alerts.filter(a=>a.level==="ok").map(({k,th,val})=>{
            const spark=HISTORY.map(m=>m[th.key]).filter(v=>v!=null);
            return(
              <div key={k} style={{background:"rgba(16,185,129,.07)",border:"1px solid rgba(16,185,129,.2)",borderRadius:13,padding:"10px 13px",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{color:"rgba(255,255,255,.7)",fontWeight:600,fontSize:12}}>{th.label}</div>
                  <div style={{color:"#34d399",fontWeight:800,fontSize:17,marginTop:2}}>{Pct(val)}</div>
                </div>
                <Spark data={spark} color="#10b981" h={32}/>
              </div>
            );
          })}
        </div>
      )}

      {subTab==="config"&&(
        <div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginBottom:14,lineHeight:1.6}}>Ajuste os limites. Atenção = amarelo, Crítico = vermelho.</div>
          {Object.entries(thresholds).map(([k,th])=>(
            <div key={k} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:14,padding:"12px 14px",marginBottom:10}}>
              <div style={{marginBottom:10}}>
                <div style={{color:"#fff",fontWeight:700,fontSize:13}}>{th.label}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginTop:1}}>Média 6m: {Pct(BASELINE[th.key])} · Atual: {Pct(current[th.key])}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <label style={{fontSize:10,color:"#fbbf24",display:"block",marginBottom:4,fontWeight:600,letterSpacing:".4px"}}>⚠️ ATENÇÃO (%)</label>
                  <input type="number" step="0.5" value={th.warn} onChange={e=>setThresholds(t=>({...t,[k]:{...t[k],warn:parseFloat(e.target.value)||t[k].warn}}))} style={{width:"100%",background:"rgba(245,158,11,.1)",border:"1px solid rgba(245,158,11,.3)",borderRadius:8,padding:"8px 10px",color:"#fbbf24",fontSize:14,fontWeight:700,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:10,color:"#f87171",display:"block",marginBottom:4,fontWeight:600,letterSpacing:".4px"}}>🚨 CRÍTICO (%)</label>
                  <input type="number" step="0.5" value={th.crit} onChange={e=>setThresholds(t=>({...t,[k]:{...t[k],crit:parseFloat(e.target.value)||t[k].crit}}))} style={{width:"100%",background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:8,padding:"8px 10px",color:"#f87171",fontSize:14,fontWeight:700,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
                </div>
              </div>
              {th.rev&&<div style={{fontSize:10,color:"rgba(255,255,255,.3)",marginTop:5}}>* Alerta quando o valor CAI abaixo do limite</div>}
            </div>
          ))}
          <button onClick={()=>setThresholds(DEFAULT_TH)} style={{width:"100%",padding:"10px",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,color:"rgba(255,255,255,.4)",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
            ↩ Restaurar padrões
          </button>
        </div>
      )}

      {subTab==="historico"&&(
        <div>
          {[{label:"🛒 CMV TOTAL",keyName:"cmv_pct",warn:38,crit:42},{label:"👥 PESSOAL",keyName:"pessoal_pct",warn:11,crit:14},{label:"📢 MARKETING",keyName:"marketing_pct",warn:6,crit:10}].map(({label,keyName,warn,crit})=>{
            const data=HISTORY.slice(-6);
            const max=Math.max(...data.map(d=>d[keyName]||0),crit*1.1);
            return(
              <div key={keyName} style={{marginBottom:20}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:600,letterSpacing:".5px",marginBottom:8}}>{label} — 6 MESES</div>
                <div style={{display:"flex",gap:5,alignItems:"flex-end",height:56}}>
                  {data.map((m,i)=>{
                    const v=m[keyName]||0;
                    const h=Math.max((v/max)*48,3);
                    const c=v>=crit?"#ef4444":v>=warn?"#f59e0b":"#10b981";
                    return(
                      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                        <span style={{fontSize:9,color:c,fontWeight:700}}>{v}%</span>
                        <div style={{width:"100%",height:h,background:c,borderRadius:"3px 3px 0 0",opacity:.8}}/>
                        <span style={{fontSize:8,color:"rgba(255,255,255,.3)",textAlign:"center"}}>{m.mes.split("/")[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TELA 5 — HISTÓRICO
══════════════════════════════════════════════════════════════ */
function Historico() {
  const [filter, setFilter] = useState("todos");
  const filtered=filter==="todos"?HISTORY:filter==="bom"?HISTORY.filter(m=>m.lucro_pct>=15):HISTORY.filter(m=>m.lucro_pct<10);

  return (
    <div style={{animation:"fadeUp .3s ease"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {[
          {label:"Melhor lucro",val:`${Math.max(...HISTORY.map(m=>m.lucro_pct)).toFixed(1)}%`,sub:HISTORY.find(m=>m.lucro_pct===Math.max(...HISTORY.map(h=>h.lucro_pct)))?.mes,color:"#34d399"},
          {label:"Pior CMV",val:`${Math.max(...HISTORY.map(m=>m.cmv_pct)).toFixed(1)}%`,sub:HISTORY.find(m=>m.cmv_pct===Math.max(...HISTORY.map(h=>h.cmv_pct)))?.mes,color:"#f87171"},
          {label:"Maior fat.",val:`${(Math.max(...HISTORY.map(m=>m.fat))/1000).toFixed(0)}k`,sub:HISTORY.find(m=>m.fat===Math.max(...HISTORY.map(h=>h.fat)))?.mes,color:"#60a5fa"},
          {label:"Média CMV",val:Pct(avg6("cmv_pct")),sub:"últimos 6m",color:"#fbbf24"},
        ].map((c,i)=>(
          <div key={i} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,padding:"10px 13px"}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:3}}>{c.label}</div>
            <div style={{fontSize:20,fontWeight:800,color:c.color}}>{c.val}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginTop:2}}>{c.sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {[["todos","Todos"],["bom","Lucro ≥15%"],["ruim","Lucro <10%"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setFilter(id)} style={{padding:"6px 14px",borderRadius:20,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:filter===id?"linear-gradient(135deg,#059669,#0d9488)":"rgba(255,255,255,.06)",color:filter===id?"#fff":"rgba(255,255,255,.4)"}}>
            {lbl}
          </button>
        ))}
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr>
              {["Mês","Fat","CMV%","Pessoal%","Lucro%"].map(h=>(
                <th key={h} style={{padding:"7px 9px",textAlign:"right",color:"rgba(255,255,255,.35)",fontWeight:600,fontSize:10,letterSpacing:".4px",borderBottom:"1px solid rgba(255,255,255,.07)",whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...filtered].reverse().map((m,i)=>{
              const cmvC=m.cmv_pct>=42?"#f87171":m.cmv_pct>=38?"#fbbf24":"#34d399";
              const lucroC=m.lucro_pct<8?"#f87171":m.lucro_pct>=15?"#34d399":"#fbbf24";
              return(
                <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                  <td style={{padding:"8px 9px",color:"rgba(255,255,255,.8)",fontWeight:700,whiteSpace:"nowrap"}}>{m.mes}</td>
                  <td style={{padding:"8px 9px",textAlign:"right",color:"rgba(255,255,255,.5)",fontSize:11}}>{(m.fat/1000).toFixed(0)}k</td>
                  <td style={{padding:"8px 9px",textAlign:"right",fontWeight:700,color:cmvC}}>{m.cmv_pct}%</td>
                  <td style={{padding:"8px 9px",textAlign:"right",color:"rgba(255,255,255,.5)"}}>{m.pessoal_pct}%</td>
                  <td style={{padding:"8px 9px",textAlign:"right",fontWeight:700,color:lucroC}}>{m.lucro_pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   APP PRINCIPAL
══════════════════════════════════════════════════════════════ */
const NAV = [
  {id:"dashboard", icon:"🏠", label:"Início"},
  {id:"chat",      icon:"💬", label:"Chat IA"},
  {id:"lancamento",icon:"📝", label:"Lançar"},
  {id:"alertas",   icon:"🔔", label:"Alertas"},
  {id:"historico", icon:"📊", label:"Histórico"},
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [thresholds, setThresholds] = useState(DEFAULT_TH);
  const [dayLogs, setDayLogs] = useState([]);

  const current = HISTORY[HISTORY.length-1];
  const alerts = Object.entries(thresholds).map(([k,th])=>alertLevel(current[th.key],th));
  const critCount = alerts.filter(a=>a==="crit").length;
  const warnCount = alerts.filter(a=>a==="warn").length;

  function handleSave(entry) {
    const fatN=entry.faturamento||0, cmvN=entry.cmv||0;
    setDayLogs(l=>[{ts:new Date().toLocaleString("pt-BR"),faturamento:fatN,cmv:cmvN,cmv_pct:fatN>0?+(cmvN/fatN*100).toFixed(1):0,resumo:entry.resumo||"",items:entry.items||{}},...l.slice(0,29)]);
  }

  const hColor = critCount>0?"#ef4444":warnCount>0?"#f59e0b":"#10b981";
  const TITLES = {dashboard:"Restaurante · CMV",chat:"Assistente IA",lancamento:"Lançar Dados",alertas:"Monitor de Alertas",historico:"Histórico Completo"};
  const SUBS = {
    dashboard: critCount>0?`${critCount} alerta(s) crítico(s)`:warnCount>0?`${warnCount} atenção`:`Tudo normal · ${current.mes}`,
    chat:"21 meses de histórico",lancamento:`Hoje ${DateFmt()}`,
    alertas:`${critCount+warnCount} indicador(es) ativos`,historico:"Jul/2024 → Mar/2026"
  };

  return (
    <div style={{minHeight:"100vh",maxWidth:640,margin:"0 auto",background:"linear-gradient(165deg,#020d0a 0%,#041a10 55%,#020d0a 100%)",fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",position:"relative"}}>
      <style>{`
        *{box-sizing:border-box}
        body{margin:0;background:#020d0a}
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-7px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-3px)}40%,80%{transform:translateX(3px)}}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:rgba(16,185,129,.15);border-radius:2px}
        input,textarea,button{font-family:'Segoe UI',system-ui,sans-serif}
        textarea{resize:none;outline:none}
        button:active{opacity:.85}
      `}</style>

      {/* HEADER */}
      <div style={{padding:"14px 18px 10px",borderBottom:"1px solid rgba(16,185,129,.1)",display:"flex",alignItems:"center",gap:11,background:"rgba(2,13,10,.95)",backdropFilter:"blur(10px)",position:"sticky",top:0,zIndex:50}}>
        <div style={{width:40,height:40,borderRadius:11,flexShrink:0,background:`linear-gradient(135deg,${hColor},${hColor}99)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,boxShadow:`0 3px 16px ${hColor}50`,animation:critCount>0?"shake 1.5s ease infinite":"none"}}>
          {page==="dashboard"?"🍽️":page==="chat"?"💬":page==="lancamento"?"📝":page==="alertas"?"🔔":"📊"}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{color:"#fff",fontWeight:800,fontSize:15,letterSpacing:"-0.2px"}}>{TITLES[page]}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            <span style={{color:critCount>0?"#f87171":warnCount>0?"#fbbf24":"rgba(255,255,255,.35)"}}>{SUBS[page]}</span>
          </div>
        </div>
        {(critCount>0||warnCount>0)&&page!=="alertas"&&(
          <button onClick={()=>setPage("alertas")} style={{width:32,height:32,borderRadius:"50%",flexShrink:0,border:"none",cursor:"pointer",background:critCount>0?"rgba(239,68,68,.2)":"rgba(245,158,11,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,animation:"pulse 1.5s infinite"}}>
            🔔
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"14px 18px 80px"}}>
        {page==="dashboard"  && <Dashboard thresholds={thresholds} dayLogs={dayLogs} onNav={setPage}/>}
        {page==="chat"       && <ChatIA/>}
        {page==="lancamento" && <Lancamento onSave={handleSave}/>}
        {page==="alertas"    && <Alertas thresholds={thresholds} setThresholds={setThresholds}/>}
        {page==="historico"  && <Historico/>}
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:640,background:"rgba(2,13,10,.97)",borderTop:"1px solid rgba(16,185,129,.12)",display:"flex",padding:"8px 0 8px",backdropFilter:"blur(12px)",zIndex:50}}>
        {NAV.map(n=>{
          const active=page===n.id;
          const hasBadge=n.id==="alertas"&&(critCount+warnCount>0);
          return(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"transparent",border:"none",cursor:"pointer",padding:"6px 0",position:"relative",fontFamily:"inherit"}}>
              <div style={{position:"relative"}}>
                <span style={{fontSize:active?22:19,transition:"font-size .15s"}}>{n.icon}</span>
                {hasBadge&&(
                  <span style={{position:"absolute",top:-4,right:-6,width:15,height:15,borderRadius:"50%",background:critCount>0?"#ef4444":"#f59e0b",fontSize:9,fontWeight:700,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {critCount||warnCount}
                  </span>
                )}
              </div>
              <span style={{fontSize:10,fontWeight:active?700:400,color:active?"#34d399":"rgba(255,255,255,.35)",letterSpacing:active?".2px":"0",transition:"all .15s"}}>
                {n.label}
              </span>
              {active&&<div style={{position:"absolute",bottom:-1,left:"50%",transform:"translateX(-50%)",width:20,height:2,background:"#10b981",borderRadius:1}}/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
