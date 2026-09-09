(() => {
 'use strict';
 const form=document.getElementById('quoteForm'),rules=window.QuoteRules;
 if(!form||!rules)return;
 const by=id=>document.getElementById(id),groups=[...form.querySelectorAll('fieldset')];
 if(groups.length!==3)return;
 const steps=[groups[2],groups[1],groups[0]],labels=['Your project','Property address','Contact details','Review & send'];
 const button=by('sendQuote'),back=by('wizardBack'),review=by('quoteReview'),nav=by('wizardNav'),note=by('formNote');
 const addressIds=['street','unit','city','state','zip'];let current=0,furthest=0,sending=false;
 form.noValidate=true;
 steps[0].querySelectorAll('.check-row').forEach(el=>steps[2].append(el));
 steps.forEach((el,i)=>{el.querySelector('legend').textContent=(i+1)+'. '+labels[i];el.tabIndex=-1;});
 const navButtons=labels.map((label,i)=>{const b=document.createElement('button');b.type='button';b.textContent=(i+1)+' · '+label;b.addEventListener('click',()=>{if(i<current)show(i);});nav.append(b);return b;});nav.hidden=false;
 by('quoteProgress').hidden=false;
 const address=()=>Object.fromEntries(addressIds.map(id=>[id,by(id).value]));
 const photos=()=>[by('photo1'),by('photo2'),by('photo3')];
 function filesValid(){
  const inputs=photos();inputs.forEach(el=>el.setCustomValidity(''));
  const files=inputs.flatMap(el=>[...el.files]);let error='';
  if(files.some(f=>!['image/jpeg','image/png','image/webp'].includes(f.type)))error='Please choose JPG, PNG or WebP photos.';
  if(files.reduce((n,f)=>n+f.size,0)>8*1024*1024)error='Your photos exceed 8 MB in total. Choose smaller images or remove a photo.';
  if(error)inputs.find(el=>el.files.length)?.setCustomValidity(error);
  by('photoStatus').textContent=error||`${files.length} photo${files.length===1?'':'s'} selected · ${(files.reduce((n,f)=>n+f.size,0)/1024/1024).toFixed(1)} MB / 8 MB`;
 }
 function validate(){
  const errors=rules.addressErrors(address());addressIds.forEach(id=>by(id).setCustomValidity(errors[id]||''));
  by('customerPhone').setCustomValidity(rules.phoneValid(by('customerPhone').value)?'':'Enter a 10-digit phone number, with an optional +1 country code.');
  by('customerName').setCustomValidity(rules.clean(by('customerName').value).length>=2?'':'Enter your full name.');
  by('jobDetails').setCustomValidity(rules.clean(by('jobDetails').value).length>=15?'':'Please describe the work in at least 15 characters.');
  filesValid();
  by('addressPreview').textContent=Object.keys(errors).length?'Include the house number, full street, city, state and ZIP code.':rules.fullAddress(address());
 }
 function firstInvalid(group){return [...group.querySelectorAll('input,select,textarea')].find(el=>!el.checkValidity());}
 function show(i,focus=true){
  current=i;sending=false;button.disabled=false;
  steps.forEach((el,n)=>el.hidden=n!==i);review.hidden=i!==3;back.hidden=i===0;
  navButtons.forEach((b,n)=>{b.disabled=n>=i;b.removeAttribute('aria-current');if(n===i)b.setAttribute('aria-current','step');});
  button.textContent=i===3?'Send quote request':i===2?'Review my request':'Continue →';
  by('quoteProgress').textContent=`Step ${i+1} of 4 · ${labels[i]}`;
  note.textContent=i===3?'Check your details below. Your request has not been sent yet.':'';
  if(focus)(i===3?review:steps[i]).focus();
 }
 function buildReview(){
  const full=rules.fullAddress(address());by('fullAddress').value=full;by('mapLink').value='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(full);
  const fields=[['Service',by('service').value],['Property size',by('propertySize').value],['Frequency',by('serviceFrequency').value],['Timing',by('timing').value],['Job details',by('jobDetails').value.trim()],['Service address',full],['Name',rules.clean(by('customerName').value)],['Email',by('customerEmail').value.trim()],['Phone',by('customerPhone').value.trim()],['Photos',photos().flatMap(el=>[...el.files].map(f=>f.name)).join(', ')||'None attached']];
  by('reviewDetails').replaceChildren();for(const [label,value] of fields){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;by('reviewDetails').append(dt,dd);}
 }
 form.addEventListener('input',e=>{if(addressIds.includes(e.target.id))by('addressConfirmed').checked=false;validate();});
 form.addEventListener('change',validate);
 form.addEventListener('submit',event=>{
  validate();
  if(sending){event.preventDefault();return;}
  if(current<3){
   event.preventDefault();const invalid=firstInvalid(steps[current]);
   if(invalid){invalid.closest('details')?.setAttribute('open','');invalid.reportValidity();return;}
   if(current===2)buildReview();furthest=Math.max(furthest,current+1);show(current+1);window.ArianaEvents?.track('quote_step',{step:current+1});return;
  }
  for(let i=0;i<steps.length;i++){const invalid=firstInvalid(steps[i]);if(invalid){event.preventDefault();show(i);invalid.closest('details')?.setAttribute('open','');invalid.reportValidity();return;}}
  buildReview();sending=true;button.disabled=true;note.textContent='Opening the secure submission page. Complete any verification shown there.';
  window.ArianaEvents?.track('quote_submit_attempt',{service:by('service').value,city:rules.towns.includes(by('city').value)?by('city').value:'Nearby / other'});
 });
 back.addEventListener('click',()=>show(Math.max(0,current-1)));
 by('editQuote').addEventListener('click',()=>show(1));
 const params=new URLSearchParams(location.search);
 if(rules.services.includes(params.get('service')))by('service').value=params.get('service');
 if(rules.towns.includes(params.get('city'))){by('city').value=params.get('city');by('state').value='PA';}
 if(['Light leaf cover','Heavy leaf cover','Not sure yet'].includes(params.get('scope')))by('jobDetails').value='Leaf conditions: '+params.get('scope')+'. ';
 window.addEventListener('pageshow',()=>{validate();show(current,false);});
 validate();show(0,false);
})();
