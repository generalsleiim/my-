let sections = {
  "إدارة الأمن": ["الأمن الإداري", "الكاميرات"],
  "إدارة الصيانة": ["الصيانة الكهربائية", "الصيانة الميكانيكية"],
  "إدارة المخازن": ["مخازن الخامات", "مخازن المنتج التام", "مخازن قطع الغيار"],
  "إدارة الحسابات": ["نموذج تقرير مالي"]
};
let modelTemplates = {
  "الأمن الإداري": [{name:"الاسم",type:"text"},{name:"التاريخ",type:"date"}],
  "الكاميرات": [{name:"الموقع",type:"text"},{name:"الحالة",type:"select",options:"جيد,معطل"}],
  "الصيانة الكهربائية": [{name:"اسم الفني",type:"text"},{name:"تاريخ الصيانة",type:"date"}],
  "الصيانة الميكانيكية": [{name:"اسم الفني",type:"text"},{name:"ملاحظات",type:"text"}],
  "مخازن الخامات": [{name:"الصنف",type:"text"},{name:"الكمية",type:"number"}],
  "مخازن المنتج التام": [{name:"المنتج",type:"text"},{name:"العدد",type:"number"}],
  "مخازن قطع الغيار": [{name:"القطعة",type:"text"},{name:"الكمية",type:"number"}],
  "نموذج تقرير مالي": [{name:"المبلغ",type:"number"},{name:"التاريخ",type:"date"}]
};
let entries = {};
let users = [
  {username:"general", password:"generalsleiim", permissions:["*"], roles:{}}
];
let currentUser = null;
let logs = [];
let lang = "ar";
let darkMode = false;

const tr = {
  "ar": {
    "login": "تسجيل الدخول",
    "username": "اسم المستخدم",
    "password": "كلمة المرور",
    "loginBtn": "دخول",
    "wrongLogin": "بيانات الدخول غير صحيحة!",
    "logout": "خروج",
    "entries": "الإدخالات",
    "settings": "الإعدادات",
    "users": "إدارة المستخدمين",
    "stats": "لوحة الإحصائيات",
    "dataview": "عرض البيانات", // إضافة لترجمة تبويب عرض البيانات
    "addEntry": "إدخال جديد",
    "viewEntries": "عرض الإدخالات",
    "back": "عودة",
    "save": "حفظ",
    "fields": "الحقول",
    "editFields": "تعديل الحقول",
    "deleteModel": "حذف النموذج",
    "addModel": "إضافة نموذج جديد",
    "modelNamePrompt": "اسم النموذج الجديد:",
    "modelExists": "النموذج موجود بالفعل!",
    "confirmDeleteModel": "تأكيد حذف النموذج؟",
    "addField": "إضافة حقل",
    "deleteField": "حذف",
    "fieldName": "اسم الحقل",
    "fieldType": "نوع الحقل",
    "fieldOptions": "خيارات (مفصولة بفاصلة)",
    "noEntries": "لا توجد إدخالات.",
    "addUser": "إضافة مستخدم",
    "editUser": "تعديل",
    "deleteUser": "حذف",
    "userExists": "اسم المستخدم موجود!",
    "userPermsPrompt": "أدخل النماذج المسموح بها مفصولة بفاصلة (أو * للكل):",
    "userPerms": "الصلاحيات",
    "all": "الكل",
    "confirmDeleteUser": "تأكيد حذف المستخدم؟",
    "rolePrompt": "حدد الصلاحيات (add:إضافة, edit:تعديل, view:عرض) لكل نموذج مفصولة بفاصلة (مثال: add,edit):",
    "roles": "الصلاحيات المتقدمة",
    "file": "ملف",
    "chooseFile": "اختر ملف",
    "fileUploaded": "تم رفع الملف",
    "exportCSV": "تصدير إلى Excel",
    "importCSV": "استيراد من Excel",
    "search": "بحث...",
    "filter": "تصفية",
    "notifyAdd": "تمت الإضافة بنجاح",
    "notifyEdit": "تم التعديل بنجاح",
    "notifyDelete": "تم الحذف بنجاح",
    "notifyMail": "تم إرسال بريد إلكتروني!",
    "dark": "الوضع الليلي",
    "lang": "EN/AR",
    "statEntries": "عدد الإدخالات",
    "statUsers": "عدد المستخدمين",
    "statModels": "عدد النماذج",
    "statMostActive": "أكثر النماذج نشاطًا",
    "statUserActivity": "نشاط المستخدمين",
    "addSection": "إضافة إدارة جديدة",
    "sectionNamePrompt": "اسم الإدارة الجديدة:",
    "sectionExists": "الإدارة موجودة بالفعل!",
    "sectionAdded": "تمت إضافة الإدارة",
    "editSectionName": "تعديل اسم الإدارة",
    "sectionNameUpdated": "تم تعديل اسم الإدارة",
    "editModelName": "تعديل اسم النموذج",
    "modelNameUpdated": "تم تعديل اسم النموذج"
  },
  "en": {
    "login": "Login",
    "username": "Username",
    "password": "Password",
    "loginBtn": "Login",
    "wrongLogin": "Wrong credentials!",
    "logout": "Logout",
    "entries": "Entries",
    "settings": "Settings",
    "users": "Users",
    "stats": "Statistics",
    "dataview": "Data View", // إضافة لترجمة تبويب عرض البيانات
    "addEntry": "Add Entry",
    "viewEntries": "View Entries",
    "back": "Back",
    "save": "Save",
    "fields": "Fields",
    "editFields": "Edit Fields",
    "deleteModel": "Delete Model",
    "addModel": "Add New Model",
    "modelNamePrompt": "New model name:",
    "modelExists": "Model already exists!",
    "confirmDeleteModel": "Confirm delete model?",
    "addField": "Add Field",
    "deleteField": "Delete",
    "fieldName": "Field Name",
    "fieldType": "Field Type",
    "fieldOptions": "Options (comma separated)",
    "noEntries": "No entries.",
    "addUser": "Add User",
    "editUser": "Edit",
    "deleteUser": "Delete",
    "userExists": "Username already exists!",
    "userPermsPrompt": "Enter allowed models separated by comma (* for all):",
    "userPerms": "Permissions",
    "all": "All",
    "confirmDeleteUser": "Confirm delete user?",
    "rolePrompt": "Set permissions (add,edit,view) for each model separated by comma (e.g.: add,edit):",
    "roles": "Advanced Permissions",
    "file": "File",
    "chooseFile": "Choose File",
    "fileUploaded": "File uploaded",
    "exportCSV": "Export to Excel",
    "importCSV": "Import from Excel",
    "search": "Search...",
    "filter": "Filter",
    "notifyAdd": "Added successfully",
    "notifyEdit": "Edited successfully",
    "notifyDelete": "Deleted successfully",
    "notifyMail": "Email sent!",
    "dark": "Dark Mode",
    "lang": "EN/AR",
    "statEntries": "Total Entries",
    "statUsers": "Total Users",
    "statModels": "Total Models",
    "statMostActive": "Most Active Models",
    "statUserActivity": "User Activity",
    "addSection": "Add New Section",
    "sectionNamePrompt": "New section name:",
    "sectionExists": "Section already exists!",
    "sectionAdded": "Section added",
    "editSectionName": "Edit Section Name",
    "sectionNameUpdated": "Section name updated",
    "editModelName": "Edit Model Name",
    "modelNameUpdated": "Model name updated"
  }
};
function t(key) { return tr[lang][key]||key; }
function login() {
  const u = document.getElementById('login-username').value.trim();
  const p = document.getElementById('login-password').value;
  const user = users.find(x=>x.username===u && x.password===p);
  if(user) {
    currentUser = user;
    document.getElementById('login-screen').style.display='none';
    document.getElementById('main-app').style.display='';
    showSection('entries');
    document.getElementById('login-msg').textContent = '';
  } else {
    document.getElementById('login-msg').textContent = t("wrongLogin");
  }
}
function logout() {
  currentUser = null;
  document.getElementById('main-app').style.display='none';
  document.getElementById('login-screen').style.display='';
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
}
function hasPermission(model, action="view") {
  if(!currentUser) return false;
  if(currentUser.permissions.includes("*")) return true;
  if(currentUser.permissions.includes(model)) return true;
  if(currentUser.roles && currentUser.roles[model]) return currentUser.roles[model].includes(action);
  return false;
}
function showSection(section) {
  document.querySelectorAll('.tab-btn').forEach(btn=>btn.classList.remove('active'));
  document.getElementById('tab-'+section).classList.add('active');
  if(section==='entries') renderEntries();
  else if(section==='settings') renderSettings();
  else if(section==='users') renderUsers();
  else if(section==='stats') renderStats();
  else if(section==='dataview') renderDataView();
}
function notify(msg, type="success") {
  let area = document.getElementById('notif-area');
  area.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
  setTimeout(()=>{area.innerHTML="";},2000);
}
function renderEntries() {
  let html = '';
  for(const sec in sections) {
    let models = sections[sec].filter(m=>hasPermission(m,"view"));
    if(models.length===0) continue;
    html += `<div class="card mb-3"><div class="card-body"><h5>${sec}</h5>`;
    models.forEach(model=>{
      html += `<div class="model-box">
        <b>${model}</b>
        ${hasPermission(model,"add")?`<button class="btn btn-sm btn-primary ms-2" onclick="showEntryForm('${model}')">${t("addEntry")}</button>`:""}
        <button class="btn btn-sm btn-secondary" onclick="showEntriesList('${model}')">${t("viewEntries")}</button>
      </div>`;
    });
    html += `</div></div>`;
  }
  document.getElementById('content-area').innerHTML = html;
}
function showEntryForm(model) {
  if(!hasPermission(model,"add")) return;
  let fields = modelTemplates[model]||[];
  let html = `<div class="card mb-3"><div class="card-body">
    <button class="btn btn-secondary back-btn" onclick="renderEntries()">${t("back")}</button>
    <h5>${t("addEntry")}: ${model}</h5>
    <form id="entry-form">`;
  fields.forEach((f,i)=>{
    html += `<div class="mb-2">
      <label>${f.name}:</label>
      ${renderFieldInput(f, '', 'field'+i)}
    </div>`;
  });
  html += `<button type="submit" class="btn btn-success">${t("save")}</button></form></div></div>`;
  document.getElementById('content-area').innerHTML = html;
  fields.forEach((f,i)=>{
    if(f.type==="file") document.getElementById('field'+i).onchange = function(e){
      if(e.target.files.length) notify(t("fileUploaded"),"info");
    };
  });
  document.getElementById('entry-form').onsubmit = function(e){
    e.preventDefault();
    let obj = {};
    fields.forEach((f,i)=>{
      if(f.type==="file") {
        let fileInput = document.getElementById('field'+i);
        obj[f.name]=fileInput.files.length?fileInput.files[0].name:"";
        obj["__file_"+f.name]=fileInput.files.length?fileInput.files[0]:null;
      } else {
        obj[f.name]=document.getElementById('field'+i).value;
      }
    });
    if(!entries[model]) entries[model]=[];
    entries[model].push({...obj, __user:currentUser.username, __date:new Date().toLocaleString()});
    logs.push({user:currentUser.username, action:"add", model, date:new Date().toLocaleString()});
    notify(t("notifyAdd"));
    notify(t("notifyMail"),"info");
    renderEntries();
  };
}
function showEntriesList(model) {
  if(!hasPermission(model,"view")) return;
  let list = entries[model]||[];
  let fields = modelTemplates[model]||[];
  let html = `<div class="card mb-3"><div class="card-body">
    <button class="btn btn-secondary back-btn" onclick="renderEntries()">${t("back")}</button>
    <h5>${model} - ${t("viewEntries")}</h5>
    <input class="form-control mb-2" id="searchBox" placeholder="${t("search")}" oninput="filterTable('${model}')"/>
    <button class="btn btn-sm btn-outline-success mb-2" onclick="exportCSV('${model}')">${t("exportCSV")}</button>
    <input type="file" id="importFile" style="display:none" accept=".csv" onchange="importCSV(event,'${model}')"/>
    <button class="btn btn-sm btn-outline-primary mb-2" onclick="document.getElementById('importFile').click()">${t("importCSV")}</button>
    `;
  if(list.length===0) html += `<div>${t("noEntries")}</div>`;
  else {
    html += `<div style="overflow-x:auto;"><table class="table table-bordered" id="entriesTable"><thead><tr>`;
    fields.forEach(f=>html+=`<th>${f.name}</th>`);
    html += `<th>المستخدم</th><th>التاريخ</th><th>تصدير</th>`;
    html += `</tr></thead><tbody>`;
    list.forEach((row,idx)=>{
      html += `<tr>`;
      fields.forEach(f=>{
        if(f.type==="file" && row["__file_"+f.name])
          html+=`<td><span class="file-link" onclick="downloadFile('${model}',${idx},'${f.name}')">${row[f.name]}</span></td>`;
        else
          html+=`<td>${row[f.name]||''}</td>`;
      });
      html += `<td>${row.__user||""}</td><td>${row.__date||""}</td>`;
      html += `<td>
        <button class="btn btn-sm btn-success" onclick="exportSingleEntry('${model}',${idx})">Excel</button>
        <button class="btn btn-sm btn-primary" onclick="sendMail('${model}',${idx})">Gmail</button>
        <button class="btn btn-sm btn-success" style="background:#25D366;border:none" onclick="sendWhatsApp('${model}',${idx})">WhatsApp</button>
      </td>`;
      html += `</tr>`;
    });
    html += `</tbody></table></div>`;
  }
  html += `</div></div>`;
  document.getElementById('content-area').innerHTML = html;
}
function filterTable(model) {
  let val = document.getElementById('searchBox').value.toLowerCase();
  let table = document.getElementById('entriesTable');
  if(!table) return;
  for(let i=1;i<table.rows.length;i++) {
    let row = table.rows[i];
    let show = false;
    for(let j=0;j<row.cells.length;j++) {
      if(row.cells[j].innerText.toLowerCase().includes(val)) show=true;
    }
    row.style.display = show?"":"none";
  }
}
function exportCSV(model) {
  let list = entries[model]||[];
  if(list.length===0) return;
  let fields = modelTemplates[model]||[];
  let csv = fields.map(f=>f.name).concat(["المستخدم","التاريخ"]).join(",")+"\n";
  list.forEach(row=>{
    let arr = fields.map(f=>`"${(row[f.name]||"").replace(/"/g,'""')}"`);
    arr.push(`"${row.__user||""}"`); arr.push(`"${row.__date||""}"`);
    csv += arr.join(",")+"\n";
  });
  let blob = new Blob([csv],{type:"text/csv"});
  let a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = model+".csv";
  a.click();
}
function importCSV(e,model) {
  let file = e.target.files[0];
  if(!file) return;
  let reader = new FileReader();
  reader.onload = function(ev){
    let lines = ev.target.result.split("\n").filter(x=>x.trim());
    let fields = modelTemplates[model]||[];
    let header = lines[0].split(",");
    for(let i=1;i<lines.length;i++){
      let vals = lines[i].split(",");
      let obj = {};
      fields.forEach((f,idx)=>obj[f.name]=vals[idx]?vals[idx].replace(/^"|"$/g,""):"");
      obj.__user = vals[fields.length]?vals[fields.length].replace(/^"|"$/g,""):"";
      obj.__date = vals[fields.length+1]?vals[fields.length+1].replace(/^"|"$/g,""):"";
      if(!entries[model]) entries[model]=[];
      entries[model].push(obj);
    }
    notify(t("notifyAdd"));
    showEntriesList(model);
  };
  reader.readAsText(file);
}
function downloadFile(model, idx, fname) {
  let file = entries[model][idx]["__file_"+fname];
  if(!file) return;
  let url = URL.createObjectURL(file);
  let a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.click();
}
function renderSettings() {
  let html = `<div class="card mb-3"><div class="card-body"><h5>${t("settings")}</h5>
    <button class="btn btn-sm btn-info mb-3" onclick="addSection()">${t("addSection")}</button>
  `;
  for(const sec in sections) {
    html += `<div style="margin-bottom:18px;">
      <b>${sec}</b>
      <button class="btn btn-sm btn-outline-warning ms-2" onclick="editSectionName('${sec}')">${t("editSectionName")}</button>
    `;
    sections[sec].forEach(model=>{
      html += `<div class="model-box">
        <b>${model}</b>
        <div class="settings-buttons">
          <button class="btn btn-sm btn-secondary" onclick="editModelName('${sec}','${model}')">${t("editModelName")}</button>
          <button class="btn btn-sm btn-warning" onclick="editFields('${model}')">${t("editFields")}</button>
          <button class="btn btn-sm btn-danger" onclick="deleteModel('${sec}','${model}')">${t("deleteModel")}</button>
        </div>
        <div style="margin-top:5px;">
          <small>${t("fields")}: ${modelTemplates[model]?.map(f=>f.name).join(', ')||''}</small>
        </div>
      </div>`;
    });
    html += `<button class="btn btn-sm btn-success mt-2" onclick="addModel('${sec}')">${t("addModel")}</button></div>`;
  }
  html += `</div></div>`;
  document.getElementById('content-area').innerHTML = html;
}
function addSection() {
  let name = prompt(t("sectionNamePrompt"));
  if(!name) return;
  if(sections[name]) { alert(t("sectionExists")); return; }
  sections[name]=[];
  notify(t("sectionAdded"));
  renderSettings();
}
function editSectionName(oldName) {
  let newName = prompt(t("sectionNamePrompt"), oldName);
  if(!newName || newName === oldName) return;
  if(sections[newName]) { alert(t("sectionExists")); return; }
  sections[newName] = sections[oldName];
  delete sections[oldName];
  notify(t("sectionNameUpdated"));
  renderSettings();
}
function editModelName(sec, oldName) {
  let newName = prompt(t("modelNamePrompt"), oldName);
  if(!newName || newName === oldName) return;
  if(modelTemplates[newName]) { alert(t("modelExists")); return; }
  // تحديث في sections
  let idx = sections[sec].indexOf(oldName);
  if(idx !== -1) sections[sec][idx] = newName;
  // تحديث في modelTemplates
  modelTemplates[newName] = modelTemplates[oldName];
  delete modelTemplates[oldName];
  // تحديث في entries
  if(entries[oldName]) {
    entries[newName] = entries[oldName];
    delete entries[oldName];
  }
  // تحديث صلاحيات المستخدمين
  users.forEach(u=>{
    if(u.permissions && Array.isArray(u.permissions)) {
      let i = u.permissions.indexOf(oldName);
      if(i !== -1) u.permissions[i] = newName;
    }
    if(u.roles && u.roles[oldName]) {
      u.roles[newName] = u.roles[oldName];
      delete u.roles[oldName];
    }
  });
  notify(t("modelNameUpdated"));
  renderSettings();
}
function editFields(model) {
  let fields = modelTemplates[model]||[];
  let html = `<div class="card mb-3"><div class="card-body">
    <button class="btn btn-secondary back-btn" onclick="renderSettings()">${t("back")}</button>
    <h5>${t("editFields")}: ${model}</h5>
    <form id="fields-form">`;
  fields.forEach((f,i)=>{
    html += `<div class="row mb-2">
      <div class="col-4"><input type="text" class="form-control" value="${f.name}" id="fname${i}" placeholder="${t("fieldName")}"/></div>
      <div class="col-3">
        <select class="form-select" id="ftype${i}">
          <option value="text" ${f.type==="text"?"selected":""}>نص</option>
          <option value="number" ${f.type==="number"?"selected":""}>رقم</option>
          <option value="date" ${f.type==="date"?"selected":""}>تاريخ</option>
          <option value="time" ${f.type==="time"?"selected":""}>وقت</option>
          <option value="select" ${f.type==="select"?"selected":""}>اختيار من قائمة</option>
          <option value="file" ${f.type==="file"?"selected":""}>${t("file")}</option>
        </select>
      </div>
      <div class="col-4">
        <input type="text" class="form-control" id="fopts${i}" placeholder="${t("fieldOptions")}" value="${f.options||''}" ${f.type==="select"?"":"style='display:none;'"} />
      </div>
      <div class="col-1">
        <button type="button" class="btn btn-sm btn-danger" onclick="removeField('${model}',${i})">${t("deleteField")}</button>
      </div>
    </div>`;
  });
  html += `<button type="button" class="btn btn-sm btn-success" onclick="addField('${model}')">${t("addField")}</button>
    <button type="submit" class="btn btn-primary">${t("save")}</button></form></div></div>`;
  document.getElementById('content-area').innerHTML = html;
  fields.forEach((f,i)=>{
    document.getElementById('ftype'+i).onchange = function(){
      document.getElementById('fopts'+i).style.display = this.value==="select"?"":"none";
    };
  });
  document.getElementById('fields-form').onsubmit = function(e){
    e.preventDefault();
    let newFields = [];
    for(let i=0;i<fields.length;i++){
      let name = document.getElementById('fname'+i).value.trim();
      let type = document.getElementById('ftype'+i).value;
      let opts = document.getElementById('fopts'+i).value.trim();
      if(name) {
        let field = {name,type};
        if(type==="select" && opts) field.options=opts;
        newFields.push(field);
      }
    }
    modelTemplates[model]=newFields;
    notify(t("notifyEdit"));
    renderSettings();
  };
}
function addField(model) {
  modelTemplates[model].push({name:"",type:"text"});
  editFields(model);
}
function removeField(model, idx) {
  modelTemplates[model].splice(idx,1);
  editFields(model);
}
function addModel(sec) {
  let name = prompt(t("modelNamePrompt"));
  if(!name) return;
  if(modelTemplates[name]) { alert(t("modelExists")); return; }
  sections[sec].push(name);
  modelTemplates[name]=[{name:"حقل جديد",type:"text"}];
  notify(t("notifyAdd"));
  renderSettings();
}
function deleteModel(sec, model) {
  if(!confirm(t("confirmDeleteModel"))) return;
  sections[sec]=sections[sec].filter(m=>m!==model);
  delete modelTemplates[model];
  delete entries[model];
  notify(t("notifyDelete"),"danger");
  renderSettings();
}
function renderUsers() {
  let html = `<div class="card mb-3"><div class="card-body"><h5>${t("users")}</h5>
    <button class="btn btn-sm btn-success mb-2" onclick="addUser()">${t("addUser")}</button>
    <div>`;
  users.forEach((u,i)=>{
    html += `<div class="user-row">
      <b>${u.username}</b>
      <button class="btn btn-sm btn-warning" onclick="editUser(${i})">${t("editUser")}</button>
      ${u.username!=="general"?`<button class="btn btn-sm btn-danger" onclick="deleteUser(${i})">${t("deleteUser")}</button>`:""}
      <span style="font-size:12px;color:#888;">${t("userPerms")}: ${u.permissions.includes("*")?t("all"):u.permissions.join(", ")}</span>
    </div>`;
  });
  html += `</div></div></div>`;
  document.getElementById('content-area').innerHTML = html;
}
function addUser() {
  let username = prompt(t("username"));
  if(!username) return;
  if(users.find(u=>u.username===username)) { alert(t("userExists")); return; }
  let password = prompt(t("password"));
  if(!password) return;
  let perms = choosePermissions();
  let roles = chooseRoles(perms);
  users.push({username,password,permissions:perms,roles});
  notify(t("notifyAdd"));
  renderUsers();
}
function editUser(idx) {
  let u = users[idx];
  let password = prompt(t("password"), u.password);
  if(!password) return;
  let perms = choosePermissions(u.permissions);
  let roles = chooseRoles(perms, u.roles);
  users[idx] = {username:u.username, password, permissions:perms, roles};
  notify(t("notifyEdit"));
  renderUsers();
}
function deleteUser(idx) {
  if(users[idx].username==="general") return;
  if(confirm(t("confirmDeleteUser"))) {
    users.splice(idx,1);
    notify(t("notifyDelete"),"danger");
    renderUsers();
  }
}
function choosePermissions(existing=[]) {
  let allModels = [];
  for(const sec in sections) allModels.push(...sections[sec]);
  let perms = prompt(t("userPermsPrompt")+"\n"+allModels.join(", "), existing.includes("*")?"*":existing.join(","));
  if(!perms) return [];
  perms = perms.split(",").map(x=>x.trim());
  if(perms.includes("*")) return ["*"];
  return perms.filter(x=>x);
}
function chooseRoles(perms, existing={}) {
  let roles = {};
  let models = perms.includes("*")?Object.values(sections).flat():perms;
  models.forEach(m=>{
    let val = prompt(`${m} - ${t("rolePrompt")}`, existing[m]?existing[m].join(","):"add,edit,view");
    if(val) roles[m]=val.split(",").map(x=>x.trim());
  });
  return roles;
}
function renderFieldInput(f, val, id) {
  if(f.type==="text") return `<input type="text" class="form-control" id="${id}" value="${val||''}"/>`;
  if(f.type==="number") return `<input type="number" class="form-control" id="${id}" value="${val||''}"/>`;
  if(f.type==="date") return `<input type="date" class="form-control" id="${id}" value="${val||''}"/>`;
  if(f.type==="time") return `<input type="time" class="form-control" id="${id}" value="${val||''}"/>`;
  if(f.type==="select") {
    let opts = (f.options||"").split(",").map(x=>x.trim());
    return `<select class="form-select" id="${id}">${opts.map(o=>`<option>${o}</option>`).join("")}</select>`;
  }
  if(f.type==="file") return `<input type="file" class="form-control" id="${id}"/>`;
  return `<input type="text" class="form-control" id="${id}" value="${val||''}"/>`;
}
function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark-mode", darkMode);
  document.getElementById("darkBtn").innerText = darkMode ? "☀️" : "🌙";
}
function toggleLang() {
  lang = lang==="ar"?"en":"ar";
  document.dir = lang==="ar"?"rtl":"ltr";
  document.body.style.textAlign = lang==="ar"?"right":"left";
  document.getElementById('login-username').placeholder = t("username");
  document.getElementById('login-password').placeholder = t("password");
  document.getElementById('login-screen').querySelector("h2").innerText = t("login");
  document.getElementById('login-screen').querySelector("button").innerText = t("loginBtn");
  // تحديث نصوص الألسنة
  document.getElementById('tab-entries').innerText = t("entries");
  document.getElementById('tab-settings').innerText = t("settings");
  document.getElementById('tab-users').innerText = t("users");
  document.getElementById('tab-stats').innerText = t("stats");
  document.getElementById('tab-dataview').innerText = t("dataview");
  showSection(document.querySelector('.tab-btn.active').id.replace("tab-",""));
}
function renderStats() {
  let totalEntries = Object.values(entries).reduce((a,b)=>a+b.length,0);
  let totalUsers = users.length;
  let totalModels = Object.values(sections).reduce((a,b)=>a+b.length,0);
  let modelCounts = {};
  for(let m in entries) modelCounts[m]=entries[m].length;
  let sortedModels = Object.entries(modelCounts).sort((a,b)=>b[1]-a[1]);
  let userCounts = {};
  logs.forEach(l=>{
    userCounts[l.user]=(userCounts[l.user]||0)+1;
  });
  let sortedUsers = Object.entries(userCounts).sort((a,b)=>b[1]-a[1]);
  let html = `<div class="row">
    <div class="col-md-4"><div class="stat-card"><b>${t("statEntries")}:</b> ${totalEntries}</div></div>
    <div class="col-md-4"><div class="stat-card"><b>${t("statUsers")}:</b> ${totalUsers}</div></div>
    <div class="col-md-4"><div class="stat-card"><b>${t("statModels")}:</b> ${totalModels}</div></div>
  </div>
  <div class="row">
    <div class="col-md-6"><div class="stat-card"><b>${t("statMostActive")}</b><br/>`;
  sortedModels.slice(0,5).forEach(([m,c])=>{
    html += `<div>${m} <div class="chart-bar" style="width:${c*20}px;display:inline-block"></div> (${c})</div>`;
  });
  html += `</div></div>
    <div class="col-md-6"><div class="stat-card"><b>${t("statUserActivity")}</b><br/>`;
  sortedUsers.slice(0,5).forEach(([u,c])=>{
    html += `<div>${u} <div class="chart-bar" style="width:${c*20}px;display:inline-block;background:#f44336"></div> (${c})</div>`;
  });
  html += `</div></div>
  </div>`;
  document.getElementById('content-area').innerHTML = html;
}

// نافذة عرض البيانات المستقلة
function renderDataView() {
  let html = '';
  for(const sec in sections) {
    html += `<div class="card mb-3"><div class="card-body"><h5>${sec}</h5>`;
    sections[sec].forEach(model=>{
      html += `<div class="model-box"><b>${model}</b>`;
      let list = entries[model]||[];
      let fields = modelTemplates[model]||[];
      if(list.length===0) {
        html += `<div style="color:#888">${t("noEntries")}</div>`;
      } else {
        html += `<div style="overflow-x:auto;"><table class="table table-bordered"><thead><tr>`;
        fields.forEach(f=>html+=`<th>${f.name}</th>`);
        html += `<th>المستخدم</th><th>التاريخ</th><th>تصدير</th></tr></thead><tbody>`;
        list.forEach((row,idx)=>{
          html += `<tr>`;
          fields.forEach(f=>{
            if(f.type==="file" && row["__file_"+f.name])
              html+=`<td><span class="file-link" onclick="downloadFile('${model}',${idx},'${f.name}')">${row[f.name]}</span></td>`;
            else
              html+=`<td>${row[f.name]||''}</td>`;
          });
          html += `<td>${row.__user||""}</td><td>${row.__date||""}</td>`;
          html += `<td>
            <button class="btn btn-sm btn-success" onclick="exportSingleEntry('${model}',${idx})">Excel</button>
            <button class="btn btn-sm btn-primary" onclick="sendMail('${model}',${idx})">Gmail</button>
            <button class="btn btn-sm btn-success" style="background:#25D366;border:none" onclick="sendWhatsApp('${model}',${idx})">WhatsApp</button>
          </td>`;
          html += `</tr>`;
        });
        html += `</tbody></table></div>`;
      }
      html += `</div>`;
    });
    html += `</div></div>`;
  }
  document.getElementById('content-area').innerHTML = html;
}

// دوال التصدير الفردي
function exportSingleEntry(model, idx) {
  let entry = entries[model][idx];
  let fields = modelTemplates[model]||[];
  let csv = fields.map(f=>f.name).join(",")+"\n";
  csv += fields.map(f=>`"${(entry[f.name]||"").replace(/"/g,'""')}"`).join(",");
  let blob = new Blob([csv],{type:"text/csv"});
  let a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = model+"_entry.csv";
  a.click();
}
function sendMail(model, idx) {
  let entry = entries[model][idx];
  let fields = modelTemplates[model]||[];
  let body = fields.map(f=>`${f.name}: ${entry[f.name]||""}`).join('%0A');
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&body=${body}`,'_blank');
}
function sendWhatsApp(model, idx) {
  let entry = entries[model][idx];
  let fields = modelTemplates[model]||[];
  let text = fields.map(f=>`${f.name}: ${entry[f.name]||""}`).join('%0A');
  window.open(`https://wa.me/?text=${text}`,'_blank');
}


// تسجيل الـ Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered! Scope:', registration.scope);
      })
      .catch(err => {
        console.log('Service Worker registration failed:', err);
      });
  });
}