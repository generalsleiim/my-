// app.js

// URL الأساسي للخادم الخلفي
const BACKEND_BASE_URL = 'http://192.168.162.175
:5000';// تأكد من مطابقة هذا لـ PORT في server.js

// لا نحتاج لـ saveData() و loadData() بعد الآن، لكن نترك المتغيرات الأولية
// المتغيرات الأولية (هذه ستحتاج إلى إدارة عبر API في تطبيق كامل)
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

let entries = {}; // سيتم تحميل هذه من الخادم
let users = [];   // سيتم تحميل هذه من الخادم
let currentUser = null;
let logs = []; // يمكن حفظ logs محليًا أو إرسالها إلى الخادم إذا كانت مهمة جدا

let lang = localStorage.getItem('appData_lang') || "ar"; // اللغة لا تزال محليًا
let darkMode = JSON.parse(localStorage.getItem('appData_darkMode')) || false; // الوضع الداكن لا يزال محليًا

const tr = {
  "ar": {
    "login": "تسجيل الدخول", "username": "اسم المستخدم", "password": "كلمة المرور", "loginBtn": "دخول",
    "wrongLogin": "بيانات الدخول غير صحيحة!", "logout": "خروج", "entries": "الإدخالات", "settings": "الإعدادات",
    "users": "إدارة المستخدمين", "stats": "لوحة الإحصائيات", "dataview": "عرض البيانات", "addEntry": "إدخال جديد",
    "viewEntries": "عرض الإدخالات", "back": "عودة", "save": "حفظ", "fields": "الحقول", "editFields": "تعديل الحقول",
    "deleteModel": "حذف النموذج", "addModel": "إضافة نموذج جديد", "modelNamePrompt": "اسم النموذج الجديد:",
    "modelExists": "النموذج موجود بالفعل!", "confirmDeleteModel": "تأكيد حذف النموذج؟", "addField": "إضافة حقل",
    "deleteField": "حذف", "fieldName": "اسم الحقل", "fieldType": "نوع الحقل", "fieldOptions": "خيارات (مفصولة بفاصلة)",
    "noEntries": "لا توجد إدخالات.", "addUser": "إضافة مستخدم", "editUser": "تعديل", "deleteUser": "حذف",
    "userExists": "اسم المستخدم موجود!", "userPermsPrompt": "أدخل النماذج المسموح بها مفصولة بفاصلة (أو * للكل):",
    "userPerms": "الصلاحيات", "all": "الكل", "confirmDeleteUser": "تأكيد حذف المستخدم؟",
    "rolePrompt": "حدد الصلاحيات (add:إضافة, edit:تعديل, view:عرض) لكل نموذج مفصولة بفاصلة (مثال: add,edit):",
    "roles": "الصلاحيات المتقدمة", "file": "ملف", "chooseFile": "اختر ملف", "fileUploaded": "تم رفع الملف",
    "exportCSV": "تصدير إلى Excel", "importCSV": "استيراد من Excel", "search": "بحث...", "filter": "تصفية",
    "notifyAdd": "تمت الإضافة بنجاح", "notifyEdit": "تم التعديل بنجاح", "notifyDelete": "تم الحذف بنجاح",
    "notifyMail": "تم إرسال بريد إلكتروني!", "dark": "الوضع الليلي", "lang": "EN/AR", "statEntries": "عدد الإدخالات",
    "statUsers": "عدد المستخدمين", "statModels": "عدد النماذج", "statMostActive": "أكثر النماذج نشاطًا",
    "statUserActivity": "نشاط المستخدمين", "addSection": "إضافة إدارة جديدة", "sectionNamePrompt": "اسم الإدارة الجديدة:",
    "sectionExists": "الإدارة موجودة بالفعل!", "sectionAdded": "تمت إضافة الإدارة", "editSectionName": "تعديل اسم الإدارة",
    "sectionNameUpdated": "تم تعديل اسم الإدارة", "editModelName": "تعديل اسم النموذج", "modelNameUpdated": "تم تعديل اسم النموذج"
  },
  "en": {
    "login": "Login", "username": "Username", "password": "Password", "loginBtn": "Login",
    "wrongLogin": "Wrong credentials!", "logout": "Logout", "entries": "Entries", "settings": "Settings",
    "users": "Users", "stats": "Statistics", "dataview": "Data View", "addEntry": "Add Entry",
    "viewEntries": "View Entries", "back": "Back", "save": "Save", "fields": "Fields", "editFields": "Edit Fields",
    "deleteModel": "Delete Model", "addModel": "Add New Model", "modelNamePrompt": "New model name:",
    "modelExists": "Model already exists!", "confirmDeleteModel": "Confirm delete model?",
    "addField": "Add Field", "deleteField": "Delete", "fieldName": "Field Name", "fieldType": "Field Type",
    "fieldOptions": "Options (comma separated)", "noEntries": "No entries.", "addUser": "Add User",
    "editUser": "Edit", "deleteUser": "Delete", "userExists": "Username already exists!",
    "userPermsPrompt": "Enter allowed models separated by comma (* for all):", "userPerms": "Permissions",
    "all": "All", "confirmDeleteUser": "Confirm delete user?",
    "rolePrompt": "Set permissions (add,edit,view) for each model separated by comma (e.g.: add,edit):",
    "roles": "Advanced Permissions", "file": "File", "chooseFile": "Choose File", "fileUploaded": "File uploaded",
    "exportCSV": "Export to Excel", "importCSV": "Import from Excel", "search": "Search...", "filter": "Filter",
    "notifyAdd": "Added successfully", "notifyEdit": "Edited successfully", "notifyDelete": "Deleted successfully",
    "notifyMail": "Email sent!", "dark": "Dark Mode", "lang": "EN/AR", "statEntries": "Total Entries",
    "statUsers": "Total Users", "statModels": "Total Models", "statMostActive": "Most Active Models",
    "statUserActivity": "User Activity", "addSection": "Add New Section", "sectionNamePrompt": "New section name:",
    "sectionExists": "Section already exists!", "sectionAdded": "Section added", "editSectionName": "Edit Section Name",
    "sectionNameUpdated": "Section name updated", "editModelName": "Edit Model Name", "modelNameUpdated": "Model name updated"
  }
};
function t(key) { return tr[lang][key]||key; }

// **********************************************
// وظائف جديدة للتفاعل مع الواجهة الخلفية (Backend API)
// **********************************************

async function fetchUsers() {
    try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/users`);
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        users = await response.json();
        console.log('Users loaded from backend:', users);
        // ابحث عن المستخدم العام واضبطه
        currentUser = users.find(u => u.username === "general");
        if (!currentUser) {
            console.warn("General user not found in backend. Consider registering it.");
            // إذا لم يكن هناك مستخدم عام، يمكنك إظهار شاشة التسجيل أو تسجيل الدخول
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        notify("فشل تحميل المستخدمين: " + error.message, "danger");
    }
}

async function fetchEntries(model) {
    try {
        const url = model ? `${BACKEND_BASE_URL}/api/entries?modelName=${encodeURIComponent(model)}` : `${BACKEND_BASE_URL}/api/entries`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch entries');
        }
        const fetchedEntries = await response.json();
        // قم بتنظيم الإدخالات حسب النموذج
        if (model) {
            entries[model] = fetchedEntries;
        } else {
            // إذا لم يتم تحديد نموذج، قم بتنظيم كل الإدخالات
            entries = {};
            fetchedEntries.forEach(entry => {
                if (!entries[entry.modelName]) {
                    entries[entry.modelName] = [];
                }
                entries[entry.modelName].push(entry);
            });
        }
        console.log(`Entries for ${model || 'all models'} loaded from backend:`, entries);
    } catch (error) {
        console.error(`Error fetching entries for ${model || 'all models'}:`, error);
        notify("فشل تحميل الإدخالات: " + error.message, "danger");
    }
}


// **********************************************
// تعديل الدوال الحالية للتفاعل مع الـ API
// **********************************************

async function login() {
  const u = document.getElementById('login-username').value.trim();
  const p = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: u, password: p })
    });

    const data = await response.json();

    if (response.ok) {
      currentUser = data.user;
      document.getElementById('login-screen').style.display='none';
      document.getElementById('main-app').style.display='';
      // تأكد من تحميل الإدخالات بعد تسجيل الدخول
      await fetchEntries(); // جلب جميع الإدخالات عند تسجيل الدخول
      showSection('entries');
      document.getElementById('login-msg').textContent = '';
    } else {
      document.getElementById('login-msg').textContent = t("wrongLogin");
      console.error('Login error:', data.message);
    }
  } catch (error) {
    console.error('Network error during login:', error);
    document.getElementById('login-msg').textContent = "خطأ في الاتصال بالخادم.";
  }
}

function logout() {
  currentUser = null;
  document.getElementById('main-app').style.display='none';
  document.getElementById('login-screen').style.display='';
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  // لا حاجة لـ localStorage.clear() هنا، لأن البيانات لم تعد مخزنة محليًا
}

// دالة showSection تبقى كما هي، لكن renderEntries() ستجلب البيانات
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

// renderEntries الآن تستدعي fetchEntries
async function renderEntries() {
  await fetchEntries(); // جلب أحدث الإدخالات من الخادم

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

// showEntryForm الآن ترسل إلى الخادم
async function showEntryForm(model) {
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

  document.getElementById('entry-form').onsubmit = async function(e){
    e.preventDefault();
    let obj = {};
    fields.forEach((f,i)=>{
      if(f.type==="file") {
        // لا يمكن حفظ كائن File في قاعدة البيانات مباشرة عبر JSON، يتطلب معالجة خاصة بالخادم
        obj[f.name]=document.getElementById('field'+i).files.length?document.getElementById('field'+i).files[0].name:"";
        //obj["__file_"+f.name]=document.getElementById('field'+i).files.length?document.getElementById('field'+i).files[0]:null;
      } else {
        obj[f.name]=document.getElementById('field'+i).value;
      }
    });

    const entryData = {
        modelName: model,
        data: obj,
        __user: currentUser ? currentUser.username : "unknown",
        __date: new Date().toLocaleString()
    };

    try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/entries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entryData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
        }

        const newEntry = await response.json();
        logs.push({user:currentUser.username, action:"add", model, date:new Date().toLocaleString()});
        notify(t("notifyAdd"));
        notify(t("notifyMail"),"info");
        renderEntries(); // إعادة تحميل الإدخالات بعد الإضافة
    } catch (error) {
        console.error("Error saving entry to backend:", error);
        notify("فشل حفظ الإدخال: " + error.message, "danger");
    }
  };
}

// showEntriesList الآن تستدعي fetchEntries للموديل المحدد
async function showEntriesList(model) {
  if(!hasPermission(model,"view")) return;
  await fetchEntries(model); // جلب الإدخالات الخاصة بهذا النموذج

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
        // إذا كان هناك مسار ملف مخزن في قاعدة البيانات، يمكن عرضه
        if(f.type==="file" && row.data[f.name]) // استخدم row.data للوصول إلى البيانات الفعلية
          // هنا ستحتاج إلى ربط لملف فعلي على الخادم أو S3
          html+=`<td><span class="file-link" onclick="downloadFile('${model}',${idx},'${f.name}')">${row.data[f.name]}</span></td>`;
        else
          html+=`<td>${row.data[f.name]||''}</td>`; // استخدم row.data
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

// دالة importCSV تحتاج لتعديل كبير لإرسال البيانات إلى الخادم
async function importCSV(e,model) {
  let file = e.target.files[0];
  if(!file) return;
  let reader = new FileReader();
  reader.onload = async function(ev){
    let lines = ev.target.result.split("\n").filter(x=>x.trim());
    let fields = modelTemplates[model]||[];
    // تخطي الرأس
    for(let i=1;i<lines.length;i++){
      let vals = lines[i].split(",");
      let obj = {};
      fields.forEach((f,idx)=>obj[f.name]=vals[idx]?vals[idx].replace(/^"|"$/g,""):"");

      const entryData = {
          modelName: model,
          data: obj,
          __user: vals[fields.length]?vals[fields.length].replace(/^"|"$/g,""):"unknown",
          __date: vals[fields.length+1]?vals[fields.length+1].replace(/^"|"$/g,""):"unknown date"
      };

      try {
          const response = await fetch(`${BACKEND_BASE_URL}/api/entries`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(entryData)
          });
          if (!response.ok) {
              const errorText = await response.text();
              console.error(`Failed to import entry: ${errorText}`);
          }
      } catch (error) {
          console.error("Error importing entry:", error);
      }
    }
    notify(t("notifyAdd"));
    showEntriesList(model); // إعادة تحميل القائمة بعد الاستيراد
  };
  reader.readAsText(file);
}

// downloadFile لن تعمل بالملفات المحلية
function downloadFile(model, idx, fname) {
  // هذه الدالة ستحتاج إلى مسار ملف فعلي من الخادم
  // حاليا، لن تعمل إذا كان الملف لم يتم تحميله على الخادم
  alert("وظيفة تنزيل الملفات تتطلب الآن تخزين الملفات على الخادم.");
  // مثال (إذا كان لديك مسار ملف في row.data[f.name]):
  // let filePath = entries[model][idx].data[fname];
  // if(filePath) {
  //   window.open(`${BACKEND_BASE_URL}/uploads/${filePath}`, '_blank');
  // }
}


// **********************************************
// وظائف إدارة المستخدمين (تتفاعل الآن مع الـ API)
// **********************************************

async function renderUsers() {
  await fetchUsers(); // جلب أحدث قائمة بالمستخدمين
  let html = `<div class="card mb-3"><div class="card-body"><h5>${t("users")}</h5>
    <button class="btn btn-sm btn-success mb-2" onclick="addUser()">${t("addUser")}</button>
    <div>`;
  users.forEach((u,i)=>{
    html += `<div class="user-row">
      <b>${u.username}</b>
      <button class="btn btn-sm btn-warning" onclick="editUser('${u._id}')">${t("editUser")}</button>
      ${u.username!=="general"?`<button class="btn btn-sm btn-danger" onclick="deleteUser('${u._id}')">${t("deleteUser")}</button>`:""}
      <span style="font-size:12px;color:#888;">${t("userPerms")}: ${u.permissions.includes("*")?t("all"):u.permissions.join(", ")}</span>
    </div>`;
  });
  html += `</div></div></div>`;
  document.getElementById('content-area').innerHTML = html;
}

async function addUser() {
  let username = prompt(t("username"));
  if(!username) return;
  if(users.find(u=>u.username===username)) { alert(t("userExists")); return; }
  let password = prompt(t("password"));
  if(!password) return;
  let perms = choosePermissions();
  let roles = chooseRoles(perms);

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, permissions: perms, roles })
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add user: ${errorText}`);
    }
    notify(t("notifyAdd"));
    renderUsers(); // إعادة تحميل المستخدمين
  } catch (error) {
    console.error("Error adding user:", error);
    notify("فشل إضافة المستخدم: " + error.message, "danger");
  }
}

async function editUser(userId) {
  let u = users.find(user => user._id === userId);
  if (!u) return;

  let password = prompt(t("password"), u.password);
  if(!password) return; // المستخدم ألغى أو أدخل كلمة مرور فارغة

  let perms = choosePermissions(u.permissions);
  let roles = chooseRoles(perms, u.roles);

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u.username, password, permissions: perms, roles })
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update user: ${errorText}`);
    }
    notify(t("notifyEdit"));
    renderUsers(); // إعادة تحميل المستخدمين
  } catch (error) {
    console.error("Error editing user:", error);
    notify("فشل تعديل المستخدم: " + error.message, "danger");
  }
}

async function deleteUser(userId) {
  let u = users.find(user => user._id === userId);
  if (u.username === "general") return; // لا تسمح بحذف المستخدم العام

  if(confirm(t("confirmDeleteUser"))) {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/users/${userId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete user: ${errorText}`);
      }
      notify(t("notifyDelete"),"danger");
      renderUsers(); // إعادة تحميل المستخدمين
    } catch (error) {
      console.error("Error deleting user:", error);
      notify("فشل حذف المستخدم: " + error.message, "danger");
    }
  }
}

// choosePermissions و chooseRoles لا تتفاعلان مع API بشكل مباشر
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

// renderFieldInput لا يتفاعل مع الـ API
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

// **********************************************
// الدوال الخاصة بالإعدادات (لا تزال تعمل محليًا وتحتاج لتحديث مستقبلي)
// **********************************************
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
  notify("ملاحظة: الإعدادات لا تزال محفوظة محليًا (لا يتم حفظها في قاعدة البيانات).", "warning", 5000); // إشعار
}

// الدوال التالية ستحتاج إلى تحديث للتعامل مع الـ API إذا أردت حفظ الإعدادات دائمًا
function addSection() {
  let name = prompt(t("sectionNamePrompt"));
  if(!name) return;
  if(sections[name]) { alert(t("sectionExists")); return; }
  sections[name]=[];
  localStorage.setItem('sections', JSON.stringify(sections)); // لا يزال محليًا
  notify(t("sectionAdded"));
  renderSettings();
}
function editSectionName(oldName) {
  let newName = prompt(t("sectionNamePrompt"), oldName);
  if(!newName || newName === oldName) return;
  if(sections[newName]) { alert(t("sectionExists")); return; }
  sections[newName] = sections[oldName];
  delete sections[oldName];
  localStorage.setItem('sections', JSON.stringify(sections)); // لا يزال محليًا
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
  // تحديث في entries (هذه ستصبح من الخادم)
  // if(entries[oldName]) {
  //   entries[newName] = entries[oldName];
  //   delete entries[oldName];
  // }
  // تحديث صلاحيات المستخدمين (ستكون من الخادم)
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
  localStorage.setItem('sections', JSON.stringify(sections)); // لا يزال محليًا
  localStorage.setItem('modelTemplates', JSON.stringify(modelTemplates)); // لا يزال محليًا
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
    localStorage.setItem('modelTemplates', JSON.stringify(modelTemplates)); // لا يزال محليًا
    notify(t("notifyEdit"));
    renderSettings();
  };
}
function addField(model) {
  modelTemplates[model].push({name:"",type:"text"});
  localStorage.setItem('modelTemplates', JSON.stringify(modelTemplates)); // لا يزال محليًا
  editFields(model);
}
function removeField(model, idx) {
  modelTemplates[model].splice(idx,1);
  localStorage.setItem('modelTemplates', JSON.stringify(modelTemplates)); // لا يزال محليًا
  editFields(model);
}
function addModel(sec) {
  let name = prompt(t("modelNamePrompt"));
  if(!name) return;
  if(modelTemplates[name]) { alert(t("modelExists")); return; }
  sections[sec].push(name);
  modelTemplates[name]=[{name:"حقل جديد",type:"text"}];
  localStorage.setItem('sections', JSON.stringify(sections)); // لا يزال محليًا
  localStorage.setItem('modelTemplates', JSON.stringify(modelTemplates)); // لا يزال محليًا
  notify(t("notifyAdd"));
  renderSettings();
}
function deleteModel(sec, model) {
  if(!confirm(t("confirmDeleteModel"))) return;
  sections[sec]=sections[sec].filter(m=>m!==model);
  delete modelTemplates[model];
  // delete entries[model]; // الإدخالات ستُحذف من القاعدة
  localStorage.setItem('sections', JSON.stringify(sections)); // لا يزال محليًا
  localStorage.setItem('modelTemplates', JSON.stringify(modelTemplates)); // لا يزال محليًا
  notify(t("notifyDelete"),"danger");
  renderSettings();
}

// **********************************************
// الدوال الأخرى التي لا تتفاعل مع الـ API بشكل مباشر
// **********************************************

function hasPermission(model, action="view") {
  if(!currentUser) return false;
  if(currentUser.permissions.includes("*")) return true;
  if(currentUser.permissions.includes(model)) return true;
  if(currentUser.roles && currentUser.roles[model]) return currentUser.roles[model].includes(action);
  return false;
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
    // الوصول إلى البيانات من row.data
    let arr = fields.map(f=>`"${(row.data[f.name]||"").replace(/"/g,'""')}"`);
    arr.push(`"${row.__user||""}"`); arr.push(`"${row.__date||""}"`);
    csv += arr.join(",")+"\n";
  });
  let blob = new Blob([csv],{type:"text/csv"});
  let a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = model+".csv";
  a.click();
}
// exportSingleEntry تحتاج لتحديث للوصول إلى row.data
function exportSingleEntry(model, idx) {
  let entry = entries[model][idx];
  let fields = modelTemplates[model]||[];
  let csv = fields.map(f=>f.name).join(",")+"\n";
  csv += fields.map(f=>`"${(entry.data[f.name]||"").replace(/"/g,'""')}"`).join(",");
  let blob = new Blob([csv],{type:"text/csv"});
  let a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = model+"_entry.csv";
  a.click();
}
// sendMail تحتاج لتحديث للوصول إلى row.data
function sendMail(model, idx) {
  let entry = entries[model][idx];
  let fields = modelTemplates[model]||[];
  let body = fields.map(f=>`${f.name}: ${entry.data[f.name]||""}`).join('%0A');
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&body=${body}`,'_blank');
}
// sendWhatsApp تحتاج لتحديث للوصول إلى row.data
function sendWhatsApp(model, idx) {
  let entry = entries[model][idx];
  let fields = modelTemplates[model]||[];
  let text = fields.map(f=>`${f.name}: ${entry.data[f.name]||""}`).join('%0A');
  window.open(`https://wa.me/?text=${text}`,'_blank');
}

function toggleDarkMode() {
  darkMode = !darkMode;
  localStorage.setItem('appData_darkMode', JSON.stringify(darkMode)); // لا يزال محليًا
  document.body.classList.toggle("dark-mode", darkMode);
  document.getElementById("darkBtn").innerText = darkMode ? "☀️" : "🌙";
}
function toggleLang() {
  lang = lang==="ar"?"en":"ar";
  localStorage.setItem('appData_lang', lang); // لا يزال محليًا
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
  // إعادة عرض القسم الحالي لضمان تحديث كل النصوص داخل المحتوى
  if (currentUser) {
      showSection(document.querySelector('.tab-btn.active').id.replace("tab-",""));
  }
}
function renderStats() {
  // هذه الدوال تحتاج لجلب البيانات من الخادم أيضًا
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

function renderDataView() {
  let html = '';
  for(const sec in sections) {
    html += `<div class="card mb-3"><div class="card-body"><h5>${sec}</h5>`;
    sections[sec].forEach(model=>{
      html += `<div class="model-box"><b>${model}</b>`;
      let list = entries[model]||[]; // هذه تحتاج لجلب من الخادم
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
            if(f.type==="file" && row.data[f.name]) // استخدم row.data
              html+=`<td><span class="file-link" onclick="downloadFile('${model}',${idx},'${f.name}')">${row.data[f.name]}</span></td>`;
            else
              html+=`<td>${row.data[f.name]||''}</td>`; // استخدم row.data
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

// **********************************************
// تسجيل الـ Service Worker (يبقى كما هو)
// **********************************************
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