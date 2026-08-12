// Добавьте ЭТИ функции в ваш существующий Apps Script.
// Ваш текущий syncWbFinal и WB_API_TOKEN не меняем.

function doGet(e) {
  const out = buildClientDashboardData_(e && e.parameter ? e.parameter : {});
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

function buildClientDashboardData_(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sales = ss.getSheetByName('Продажи');
  if (!sales) throw new Error('Не найден лист Продажи');
  const values = sales.getDataRange().getValues();
  const today = new Date();
  const daysBack = Math.max(1, Math.min(30, Number(params.days || 30)));
  const cutoff = new Date(today.getTime() - (daysBack + 2) * 86400000);
  const byDay = {}, byProduct = {};
  for (let i=1;i<values.length;i++) {
    const r=values[i], d=r[0]; if (!(d instanceof Date) || d<cutoff) continue;
    const key=Utilities.formatDate(d,'Europe/Moscow','dd.MM');
    const nm=String(r[7]||''); if(!nm) continue;
    const orders=Number(r[12]||0), salesSum=Number(r[13]||0);
    if(!byDay[key]) byDay[key]={date:key,sales:0,ads:0,profit:0};
    byDay[key].sales+=salesSum;
    if(!byProduct[nm]) byProduct[nm]={nmId:nm,name:r[5]||('Артикул '+nm),orders:0,sales:0,ads:0,profit:0,cpo:0};
    byProduct[nm].orders+=orders; byProduct[nm].sales+=salesSum;
  }
  // Берём готовые расходы/прибыль из клиентских листов 001/002/... по датам.
  const cats=ss.getSheets().filter(s=>/^\d{3}\s*$/.test(s.getName()));
  cats.forEach(sh=>{
    const v=sh.getDataRange().getValues();
    for(let r=0;r<v.length;r++){
      const nm=Number(v[r][0]); if(!nm || !byProduct[String(nm)]) continue;
      for(let rr=r+1;rr<Math.min(v.length,r+10);rr++){
        const label=String(v[rr][0]||'').trim().toLowerCase();
        if(label!=='бюджет' && label!=='прибыль') continue;
        for(let c=1;c<v[r].length;c++){
          const d=v[r][c]; if(!(d instanceof Date)||d<cutoff) continue;
          const key=Utilities.formatDate(d,'Europe/Moscow','dd.MM'), val=Number(v[rr][c]||0);
          if(!byDay[key]) byDay[key]={date:key,sales:0,ads:0,profit:0};
          if(label==='бюджет'){byDay[key].ads+=val;byProduct[String(nm)].ads+=val;}
          if(label==='прибыль'){byDay[key].profit+=val;byProduct[String(nm)].profit+=val;}
        }
      }
    }
  });
  Object.values(byProduct).forEach(p=>p.cpo=p.orders?p.ads/p.orders:0);
  return {client:'ИП Сергеева',updatedAt:new Date().toISOString(),days:Object.values(byDay).sort((a,b)=>a.date.localeCompare(b.date)),products:Object.values(byProduct)};
}
